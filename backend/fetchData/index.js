const Sequelize = require('sequelize');
const parse = require('./parserToJson.js');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD, {
    host: 'database',
    dialect: 'postgres',
    logging: false
  }
);

const models = {
  Bridge: sequelize.import('./models/bridge.js'),
  BridgeEvent: sequelize.import('./models/bridgeEvent.js'),
  BridgeEventCheck: sequelize.import('./models/bridgeEventCheck.js'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    console.log(models[key])
    models[key].associate(models);
  }
});



sequelize.sync({
    force: true // Delete table
  })
  .then(() => {
    parse('http://opendata.ndw.nu/brugopeningen.xml.gz')
      .then(situations => {
        (async () => {
          for (let situation of situations) {
            await models.BridgeEvent.addBridgeEvent(situation.situation, models);
          }
        })();
      })
  })

module.exports = models

