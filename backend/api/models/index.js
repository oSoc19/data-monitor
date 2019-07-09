const Sequelize = require('sequelize');
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
  Bridge: sequelize.import('./bridge'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
		console.log(models[key])
    models[key].associate(models);
  }
});

const createSituation = async (situation) => {
  await models.Situation.create({
    id: situation['$'].id,
    version: situation['$'].version,
    overrallSeverity: situation.overallSeverity,
    situationVersionTime: situation.situationVersionTime
  })
};

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
		bridgeEntry.save();
  }
};

module.exports = {
  sequelize: sequelize,
  models: models,
  createSituation: createSituation,
  addBridge: addBridge
}
