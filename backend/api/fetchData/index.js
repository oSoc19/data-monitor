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

// const addBridge = async situation => {
  //   let location = situation.situationRecord.groupOfLocations.locationForDisplay;
  //   let id = crypto.createHash('sha1').update(location.longitude + location.latitude).digest('hex');
  //   let bridge = await models.Bridge.findOne({
    //     where: {
      //       id: id
      //     }
//   });
//   if (!bridge) {
//     await models.Bridge.create({
//       id: id,
//       longitude: location.longitude,
//       latitude: location.latitude,
//     });
//     let situationRecord = situation.situationRecord;
//     let bridgeSituationRecord = await models.BridgeSituationRecord.findOne({
//       where: {
//         id: situationRecord['$'].id
//       }
//     });
//
//     if (!bridgeSituationRecord) {
//       bridgeSituationRecord = await models.BridgeSituationRecord.create({
//         id: situationRecord['$'].id,
//         creationTime: situationRecord.situationRecordCreationTime,
//         startTime: situationRecord.validity.validityTimeSpecification.overallStartTime,
//         endTime: situationRecord.validity.validityTimeSpecification.overallEndTime,
//       });
//     }
//   }
// };
module.exports = models
