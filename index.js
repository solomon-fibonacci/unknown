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

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

var entries = [];

var id = 0;

var newCommentId = 0;

app.use('/',express.static('public'));


app.post('/entry/',upload.single('file'), (req, res, next) =>{
var username = req.body.username;
var content = req.body.content;
id++;


var newEntry ={id:id,username:username,content:content,upvote:0,downvote:0,parentEntry:"",comments:[]}
entries.push(newEntry);

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
    newCommentId++;
    if (!req.file){
      console.log('Please upload a file');
    }

var newCommentObject = {comment:newComment,tag:newCommentId}

var idToFind = Number(req.params.id);
var entryIndex = entries.findIndex(entry => entry.id === idToFind);

if (entryIndex === -1) {
  return res.status(404).send('Post not found');
}
entries[entryIndex].comments.push(newCommentObject);

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

app.listen(8080);
