const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const path = require ('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
const upload = multer ({
  dest: "./tempUploads/"
});

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

var entries = [];

var id = 0;

app.use('/',express.static('public'));


app.post('/entry/',upload.single("file"), (req, res, next) =>{
var username = req.body.username;
var content = req.body.content;
id++;


var newEntry ={id:id,username:username,content:content,upvote:0,downvote:0,parentEntry:""};
entries.push(newEntry);

const tempPath = req.file.path;
const targetPath = path.join(__dirname, `./posts/images/${username}-${id}.png`);
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
