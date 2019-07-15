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

module.exports = models

