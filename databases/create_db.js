require('dotenv').config
var MongoClient = require('mongodb').MongoClient;



var url = process.env.DATABASE_URL;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});