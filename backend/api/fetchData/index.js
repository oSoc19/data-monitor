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
  BridgeOpening: sequelize.import('./models/bridgeOpening.js'),
  BridgeOpeningCheck: sequelize.import('./models/bridgeOpeningCheck.js'),
  MaintenanceWorks: sequelize.import('./models/maintenanceWorks.js'),
  MaintenanceWorksCheck: sequelize.import('./models/maintenanceWorksCheck.js')
};

/* Make all the association between models.
 * Ex. A bridge has multiple bridge events (hasMany)
*/
const associateModels = () => {
  Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });
}

const loadBridges = async () => {
  await waitForDatabase();
  await sequelize.sync();
  const bridgeOpeningsUrl = 'http://opendata.ndw.nu/brugopeningen.xml.gz';
  let situations = [];
  // We want to run synchronusly the insertion of all bridge events in the table
  // And pipe used in the function parse are always asynchronous(see implementation of parse)
  await parse(bridgeOpeningsUrl, "situation", (situation) => {
    situations.push(situation);
  });
  for(let situation of situations) {
    await models.BridgeOpening.addBridgeOpening(situation, models)
  }
};

const loadMaintenanceWorks = async () => {
  await waitForDatabase();
	await sequelize.sync();
  const roadMaintenancesUrl = 'http://opendata.ndw.nu/wegwerkzaamheden.xml.gz';
  console.log("START FETCHING MaintenanceWorks : " + Date.now())
  await parse(roadMaintenancesUrl, "situationRecord", (situation) => {
    models.MaintenanceWorks.addMaintenanceWorks(situation, models)
  });
  console.log("END ROAD MAINTENANCE : " + Date.now())
};

const waitForDatabase = async() => {
  console.log(`----- Trying to connect to database`);
  let counter = 0;
  let maxAttempts = 300;
  let sleepTimeMs = 5000;
  while(counter < maxAttempts){
    try{
      await sequelize.authenticate();
      break;
    }
    catch(error){
      counter += 1;
      console.log(`----- Database not alive, waiting ${sleepTimeMs}`);
      await sleep(sleepTimeMs);
    }
  }

  if(counter === maxAttempts){
    throw('Unable to connect to datase');
  }
  console.log(`----- Connection ok`);
};

const sleep = (ms) => {
    return new Promise(resolve=>{
      setTimeout(resolve,ms);
    });
};

module.exports = { models, loadBridges, loadMaintenanceWorks, associateModels };
