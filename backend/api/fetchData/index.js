const Sequelize = require('sequelize');
const parse = require('./parserToJson.js');
const GeoJson = require('geojson');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD, {
    host: 'database',
    dialect: 'postgres',
  },
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


const addBridgeEvent = async situation => {
  let location = situation.situationRecord.groupOfLocations.locationForDisplay;
  let situationRecord = situation.situationRecord;
  let bridgeEvent = await models.BridgeEvent.findOne({
    where: {
      id: situationRecord['$'].id,
			version: situationRecord['$'].version
    }
  });
  if (!bridgeEvent) {
    bridgeEvent = await models.BridgeEvent.create({
      id: situationRecord['$'].id,
			version: situationRecord['$'].version,
			location: [location.longitude, location.latitude],
      creationTime: situationRecord.situationRecordCreationTime,
      startTime: situationRecord.validity.validityTimeSpecification.overallStartTime,
      endTime: situationRecord.validity.validityTimeSpecification.overallEndTime,
			geoJsonLocation: GeoJson.parse(location, {Point: ['longitude', 'latitude']}).geometry
    })
  }
  check(bridgeEvent)
};

module.exports = models
