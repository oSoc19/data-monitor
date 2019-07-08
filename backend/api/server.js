const express = require('express');
const parse = require('./parserToJson');
const cleaner = require('./jsonCleaner');
const cors = require('cors');

const locationFinder = require('./locationFinder');

let data;
let app = express();

let template = {
  situationVersionTime: 'situation/situationVersionTime'
}
parse('http://opendata.ndw.nu/brugopeningen.xml.gz', template).then(result => console.log(result));
// parse('http://opendata.ndw.nu/wegwerkzaamheden.xml.gz', template).then(result => data = result);

app.use(cors());

app.listen(8080, () => {
    let location;
    locationFinder(52.4715154435141, 4.81342942207674).then(res => {
        return res.json();
    });
});

app.get("/", (req, res, next) => {});

app.get("/api/bridges", (req, res, next) => {
    res.json(data);
});

app.use(function(req, res) {
    res.status(404);
});
