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
const associateModels = () => {
  Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  })
}

const loadBridges = async () => {
	associateModels();
  await sequelize.sync();
  const bridgeOpeningsUrl = 'http://opendata.ndw.nu/brugopeningen.xml.gz'
  const bridgeOpeningsSitutations = await parse(bridgeOpeningsUrl)
  for (situation of bridgeOpeningsSitutations) {
    await models.BridgeEvent.addBridgeEvent(situation.situation, models);
  }
}
module.exports = {models, loadBridges, associateModels}

