const express = require('express');
const {
  models,
  sequelize,
  createSituation,
  addBridge
} = require('./models/index.js');
const parse = require('./parserToJson');
const cleaner = require('./jsonCleaner');
const cors = require('cors');

const locationFinder = require('./locationFinder');

let app = express();


app.use(cors());

sequelize.sync({
  force: true
}).then(() => {
  let template = {
    situationVersionTime: 'situation/situationVersionTime'
  }
  parse('http://opendata.ndw.nu/brugopeningen.xml.gz', template)
    .then(situations => {
			(async () => {
				await addBridge(situations[0].situation);
			})();
			// (async () => {
			// 	for(let situation of situations) {
			// 		await addBridge(situation.situation);
			// 	}
      //
			// })();
      // parse('http://opendata.ndw.nu/wegwerkzaamheden.xml.gz', template).then(result => data = result);
      app.listen(8080, () => {
        console.log('API Server listening on port 8080');
      });
    });
});

app.get("/", (req, res, next) => {});

app.get("/api/bridges", (req, res, next) => {
  res.json(data);
});

app.use(function(req, res) {
  res.status(404);
});
