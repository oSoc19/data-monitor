const express = require ('express')
const fs = require('fs')

let app = express()
let file = fs.readFileSync('sample.json', 'utf8');

app.listen(8080, () => {
    console.log("Connected on port 8080")
});

app.get("/", (req, res, next) => {
    // res.json({"message":"Ok"})
    res.send("hello")
});

app.get("/api/bridges", (req, res, next) => {
    res.json(file)
});

app.use(function(req, res){
    res.status(404);
});