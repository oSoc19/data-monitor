const express = require ('express')
const fs = require('fs')
const parse = require('./parserToJson')
const cleaner = require('./jsonCleaner')


let data;
parse('http://opendata.ndw.nu/brugopeningen.xml.gz').then(result => data = cleaner(result));

let app = express();
// let file = fs.readFileSync('sample.json', 'utf8');

// let datac = cleaner(data)

app.listen(8080, () => {
    console.log("Connected on port 8080")
});

app.get("/", (req, res, next) => {
    // res.json({"message":"Ok"})
    // res.send("hello")
});

app.get("/api/bridges", (req, res, next) => {
    res.json(data)
});

app.use(function(req, res){
    res.status(404);
});