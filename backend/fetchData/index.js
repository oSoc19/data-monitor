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

// TODO: Refactor by iterate in the models folder
const models = {
  Bridge: sequelize.import('./models/bridge.js'),
  BridgeEvent: sequelize.import('./models/bridgeEvent.js'),
  BridgeEventCheck: sequelize.import('./models/bridgeEventCheck.js'),
};

/* Make all the association between models.
 * Ex. A bridge has multiple bridge events (hasMany)
*/
Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});



sequelize.sync({
    // force: true // Delete database if it exits
  })
  .then(() => {
    const bridgeOpeningsUrl = 'http://opendata.ndw.nu/brugopeningen.xml.gz'
    parse(bridgeOpeningsUrl)
      .then(situations => {
        (async () => {
          for (let situation of situations) {
            // Create a BridgeEvent for each situation 
            // See XML documentation : http://docs.ndwcloud.nu/en/
            await models.BridgeEvent.addBridgeEvent(situation.situation, models);
          }
        })();
      })
  })

module.exports = models

