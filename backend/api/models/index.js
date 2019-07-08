const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: 'database',
    dialect: 'postgres',
  },
);

const models = {
  Situation: sequelize.import('./situation'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
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

module.exports = {
  sequelize: sequelize,
  models: models,
  createSituation: createSituation
}
