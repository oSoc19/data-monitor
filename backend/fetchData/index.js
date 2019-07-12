const Sequelize = require('sequelize');
const parse = require('./parserToJson.js');
const GeoJson = require('geojson');
const checkAllFields = require('./checkBridgeOpenings')
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

let createBridge = async (longitude, latitude) => {
  let bridge = await models.Bridge.create({
    location: [longitude, latitude]
  });
  return bridge;
}

let createCheckAllFields = async (event) => {
  let allFields = checkAllFields(event)
  let checkFields = await models.BridgeEventCheck.create({
    allFields: allFields,
    correctID: 1,
    checksum: (allFields + 1) / 2,
    bridgeEventId: event.id
  })
  return checkFields
}


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
    let bridge = await models.Bridge.findOne({
      where: {
        location: [location.longitude, location.latitude]
      }
    });
    if (!bridge) {
      bridge = createBridge(location.longitude, location.latitude)
    }
    bridgeEvent = await models.BridgeEvent.create({
      id: situationRecord['$'].id,
      version: situationRecord['$'].version,
      location: [location.longitude, location.latitude],
      creationTime: situationRecord.situationRecordCreationTime,
      startTime: situationRecord.validity.validityTimeSpecification.overallStartTime,
      endTime: situationRecord.validity.validityTimeSpecification.overallEndTime,
      geoJsonLocation: GeoJson.parse(location, {
        Point: ['longitude', 'latitude']
      }).geometry,
      bridgeId: bridge.id
    })
  }
  console.log(createCheckAllFields(bridgeEvent))
};

sequelize.sync({
    force: true
  })
  .then(() => {
    parse('http://opendata.ndw.nu/brugopeningen.xml.gz')
      .then(situations => {
        (async () => {
          for (let situation of situations) {
            await addBridgeEvent(situation.situation);
          }
        })();
      })
  })

module.exports = models

