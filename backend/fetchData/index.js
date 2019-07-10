const Sequelize = require('sequelize');
const parse = require('./parserToJson.js');
const crypto = require('crypto');
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
  Bridge: sequelize.import('./models/bridge'),
  BridgeSituationRecord: sequelize.import('./models/bridgeSituationRecord.js'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
		console.log(models[key])
    models[key].associate(models);
  }
});

sequelize.sync({ force: true })
  .then(() => {
    parse('http://opendata.ndw.nu/brugopeningen.xml.gz')
      .then(situations => {
        (async () => {
          for(let situation of situations) {
            await addBridge(situation.situation);
          }
        })();
      })
  })


const addBridge = async situation => {
  let location = situation.situationRecord.groupOfLocations.locationForDisplay;
  let id = crypto.createHash('sha1').update(location.longitude + location.latitude).digest('hex');
  let bridge = await models.Bridge.findOne({
    where: {
      id: id
    }
  });
  if (!bridge) {
    let bridgeEntry = await models.Bridge.create({
      id: id,
      longitude: location.longitude,
      latitude: location.latitude,
      bridgeSituationRecord: [{
        id: situation.situationRecord['$'].id,
      }]
    });
    let situationRecord = situation.situationRecord;
    let bridgeSituationRecord = await models.BridgeSituationRecord.findOne({
      where: {
        id: situationRecord['$'].id
      }
    });

    if(!bridgeSituationRecord) {
      bridgeSituationRecord = await models.BridgeSituationRecord.create({
        id: situationRecord['$'].id,
        creationTime: situationRecord.situationRecordCreationTime,
        startTime: situationRecord.validity.validityTimeSpecification.overallStartTime,
        endTime: situationRecord.validity.validityTimeSpecification.overallEndTime,
      });
    }
  }
};

sequelize.exports = models