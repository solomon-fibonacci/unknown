const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

var entries = [{username:"Solomon",content:"Crazy flood in Lekki British HighSchool",vote:0,parentEntry:""}];


app.post('/entry/', (req, res, next) =>{
var username = req.body.username
var content = req.body.content
var newEntry ={username:username,content:content,vote:0,parentEntry:""};
entries.push(newEntry);
res.send(entries);
});

app.put('/entry/:id', (req, res, next) =>{
var entry = entries[req.params.id];
var vote = entry.vote;
var newVoteTally = vote++;
res.send(entry.vote);
});


app.get('/entry/', (req, res, next) =>{
res.send(entries)
});

app.get('/entry/:id', (req, res, next) =>{
const entry = entries[req.params.id];
res.send(entry)
});

app.listen(8080, ()=>{
app.use(express.static('public'));
});
