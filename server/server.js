const express = require('express');
const parse = require('./parserToJson');
const cleaner = require('./jsonCleaner');
const cors = require('cors');

let data;
let app = express();

parse('http://opendata.ndw.nu/brugopeningen.xml.gz').then(result => data = cleaner(result));

app.use(cors());

app.listen(8080, () => {});

app.get("/", (req, res, next) => {});

app.get("/api/bridges", (req, res, next) => {
    res.json(data);
});

app.use(function(req, res) {
    res.status(404);
});
