var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://yaakov:Yaakov(12345)@cluster0-ltnsl.mongodb.net/mydb";
MongoClient.connect(uri, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection("entries", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
   db.close();
});
});
