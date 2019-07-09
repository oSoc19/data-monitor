const parse = require('./parserToJson.js');
const {
  models,
  sequelize,
  addBridge
} = require('./models/index.js');


sequelize.sync({
  force: true
}).then(() => {
  parse('http://opendata.ndw.nu/brugopeningen.xml.gz')
    .then(situations => {
      (async () => {
				console.log("SEED DATABSE");
        await addBridge(situations[0].situation);
      })();
    })

});
