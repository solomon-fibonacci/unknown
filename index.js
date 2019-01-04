const express = require('express');
const app = express();
var fs = require('fs');
var multer = require('multer');
var upload = multer ({
  dest: './tempUploads/'
});
const path = require ('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://yaakov:Yaakov(12345)@cluster0-ltnsl.mongodb.net/mydb";

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

var sourceData = fs.readFileSync('data.json');
var entries = JSON.parse(sourceData);

var id = entries.length;

var newCommentId = 0;

app.use('/',express.static('public'));


app.post('/entry/',upload.single('file'), (req, res, next) =>{
var username = req.body.username;
var content = req.body.content;
id = entries.length+1;


var newEntry ={id:id,username:username,content:content,upvote:0,downvote:0,parentEntry:"",comments:[]}
entries.push(newEntry);

MongoClient.connect(uri,{ useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");

  dbo.collection("entries").insertOne(newEntry, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

var jsonContent = JSON.stringify(entries);
console.log(jsonContent);

fs.writeFile("data.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});

var tempPath = req.file.path;
var targetPath = path.join(__dirname, `./posts/images/${username}-${id}.png`);
if (path.extname(req.file.originalname).toLowerCase() === ".png") {
  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res);
  });
    res.redirect('/posts/');
} else {
  fs.unlink(tempPath, err => {
    if (err) return handleError(err, res);

    res
      .status(403)
      .contentType("text/plain")
      .end("Only .png files are allowed!");
  });
}
});

// Troublesome code
app.post('/comments/:id',upload.single('file'),(req, res, next) =>{
var newComment = req.body.newComment;
    if (!req.file){
      console.log('Please upload a file');
    }

var idToFind = Number(req.params.id);
var entryIndex = entries.findIndex(entry => entry.id === idToFind);

if (entryIndex === -1) {
  return res.status(404).send('Post not found');
}

//if (idToFind && specificCommentId) {
//  specificCommentId++
//} else {
//  specificCommentId= 1;
//}

var specificCommentId = entries[entryIndex].comments.length + 1;
var newCommentId = `${idToFind}-${specificCommentId}`
var newCommentObject = {comment:newComment,tag:newCommentId}
entries[entryIndex].comments.push(newCommentObject);

var jsonContent = JSON.stringify(entries);
console.log(jsonContent);

fs.writeFile("data.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});

console.log(entries[entryIndex].comments);
res.send(entries);

// Trying to put image in comment box
var tempPath = req.file.path
var targetPath = path.join(__dirname, `./posts/commentImages/commentImage-${newCommentId}.png`);
if (path.extname(req.file.originalname).toLowerCase() === ".png") {
  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res);
  });
} else {
  fs.unlink(tempPath, err => {
    if (err) return handleError(err, res);

    res
      .status(403)
      .contentType("text/plain")
      .end("Only .png files are allowed!");
  });
}

});


app.use('/posts/',express.static('posts'));


app.get('/entry/', (req, res, next) =>{
res.send(entries);
});

app.get('/entry/:id', (req, res, next) =>{
const entry = entries[req.params.id];
res.send(entry);
});

app.put('/upvote/:id', (req, res, next) =>{
var idToFind = Number(req.params.id);
var entryIndex = entries.findIndex(entry => entry.id === idToFind);
if (entryIndex === -1) {
  return res.status(404).send('Post not found');
}
entries[entryIndex].upvote++;
res.send(entries[entryIndex]);
});

app.put('/downvote/:id', (req, res, next) =>{
var idToFind = Number(req.params.id);
var entryIndex = entries.findIndex(entry => entry.id === idToFind);
if (entryIndex === -1) {
  return res.status(404).send('Post not found');
}
entries[entryIndex].downvote++;
res.send(entries[entryIndex]);
});

app.delete('/deletePost/:id', (req, res, next) =>{
var idToFind = Number(req.params.id);
var entryIndex = entries.findIndex(entry => entry.id === idToFind);
if (entryIndex === -1) {
  return res.status(404).send('Post not found');
}
entries.splice(entryIndex,1);
res.send(entries[entryIndex]);
});

app.listen(8080);
