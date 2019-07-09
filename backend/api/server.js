const express = require('express');
const cors = require('cors');

const locationFinder = require('./locationFinder');

let app = express();


app.use(cors());

app.listen(8080, () => {
  console.log('API Server listening on port 8080');
});

app.get("/", (req, res, next) => {});

app.get("/api/bridges", (req, res, next) => {
  res.json(data);
});

app.use(function(req, res) {
  res.status(404);
});

