const express = require('express');
const cors = require('cors');
const geojson = require('geojson');
const Sequelize = require('sequelize');
const models = require('./fetchData/index').models;
const bodyParser = require('body-parser');
const fs = require('fs');
const csvStringify = require('csv-stringify');
const associateModels = require('./fetchData/index').associateModels;

const op = Sequelize.Op;
let app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.listen(8080, () => {
  console.log('API Server listening on port 8080');
});

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD, {
    host: 'database',
    dialect: 'postgres',
  },
);

// Load the file with all the provincie and cities
const citiesByProvince = JSON.parse(fs.readFileSync('./data/dutchCities.json'));
associateModels();

app.get('/api/bridges/', async (req, res, next) => {
  let startTime = req.query.startTime;
  let endTime = req.query.endTime;

  let bridges = await models.Bridge.findAll({
    raw: true
  });
  let features = [];
  for (let i = 0; i < bridges.length; i++) {
    let bridgeOpenings = await getBridgeOpenings(startTime, endTime, bridges[i].id);
    // If the bridge has at least one bridge event between the startTime and the endTime
    // we can add it to the list of bridges to show on the map
    if (bridgeOpenings.length > 0) {
      features.push(geojson.parse(bridges[i], {
        Point: 'location'
      }));
    }
  }

  let featureCollection = {
    "type": "FeatureCollection",
    "features": features
  };
  res.send(featureCollection);
});


app.get('/api/bridge_openings/', async (req, res, next) => {
  let startTime = req.query.startTime;
  let endTime = req.query.endTime;
  let bridgeId = req.query.id;
  res.send(await getBridgeOpenings(startTime, endTime, bridgeId));

});

app.get('/api/qa/bridge_openings/summary/', async (req, res) => {
  let results = await getSummary('bridge_openings', models.BridgeOpeningCheck, 'bridgeOpeningId');
  res.send(results);
});

app.get('/api/qa/bridge_openings/summary/provinces/:province', async (req, res) => {
  let province = req.params.province.split('_').join(' ');
  let results = [];
  for (let city of citiesByProvince[province]) {
    let cityQuery = city.replace("'", "''");
    let citiesLevel = 8;
    let result = await intersects('bridge_openings', 'b', 'b.id', cityQuery, citiesLevel);
    let ids = [];
    for (let bridgeOpening of result[0]) {
      ids.push(bridgeOpening.id);
    }
    let goodBridgeOpeningss = await findGoodEvents(models.BridgeOpeningCheck, 'bridgeOpeningId', ids);
    let badBridgeOpeningss = await findBadEvents(models.BridgeOpeningCheck, 'bridgeOpeningId', ids);
    let cityName = city.split(' ').join('_');
    results.push({
      name: city,
      nextUrl: '/api/qa/bridge_openings/summary/cities/' + cityName,
      summary: {
        numberOfGoodEvents: goodBridgeOpeningss.count,
        numberOfBadEvents: badBridgeOpeningss.count
      }
    });
  }
  res.send(results);
});

app.get('/api/qa/bridge_openings/summary/cities/:city', async (req, res) => {
  let city = req.params.city.split('_').join(' ');
  let cityQuery = city.replace("'", "''");
  let cityLevel = 8;
  let result = await intersects('bridge_openings', 'b', 'b.id', city, cityLevel);
  let ids = [];
  for (let bridgeOpening of result[0]) {
    ids.push(bridgeOpening.id);
  }
  let bridgeOpeningChecks = await models.BridgeOpeningCheck.findAll({
    // attributes: ['bridgeOpeningId', 'allFields', 'correctID', 'checksum', 'manualIntervention', 'comment'],
    where: {
      bridgeOpeningId: ids
    }
  });

  res.send(bridgeOpeningChecks);
});
app.get('/api/download/bridge_openings/summary/', async (req, res) => {
	let results = await getEventSummary('bridge_openings');
  sendCsv(results, 'bride_openings', res);
});

app.get('/api/download/bridge_openings/summary/provinces/:province', async (req, res) => {
  let province = req.params.province;
  let provinceName = province.split('_').join(' ');
  let provinceLevel = 4;
  let result = await intersects('bridge_openings', 'b', 'b.*', provinceName, provinceLevel);
  sendCsv(result[0], 'bridge_openings', res);
});

app.get('/api/download/bridge_openings/summary/cities/:city', async (req, res) => {
  let city = req.params.city;
  let cityName = city.split('_').join(' ');
  let cityLevel = 8;
  let result = await intersects('bridge_openings', 'b', 'b.*', cityName, cityLevel);
  sendCsv(result[0], 'bridge_openings', res);
});

app.put('/api/qa/bridge_openings/:id', async (req, res, next) => {
  let id = req.params.id;

  let checks = await models.BridgeOpeningCheck.findOne({
    where: {
      bridgeOpeningId: id
    }
  });

  if (checks) {
    try {
      await checks.update({
        manualIntervention: req.body.manualIntervention,
        comment: req.body.comment
      });
      res.send(checks);
    } catch (e) {
      console.error(e);
      res.status(500).json({
        'error': 'internal server error'
      });
    }
  }
});

app.get('/api/maintenance_works/:id', async (req, res) => {
  let result = await models.MaintenanceWorks.findOne({
    where: {
      id: req.params.id
    }
  });
  res.send(result);


});
app.get('/api/maintenance_works/', async (req, res, next) => {
  let startTime = req.query.startTime;
  let endTime = req.query.endTime;
  let maintenanceWorks = await getMaintenanceWorks(startTime, endTime);
  let features = [];
  for (let event of maintenanceWorks) {
    let feature = {
      "type": "Feature",
      "geometry": {},
      "properties": {}
    }
    feature.geometry = event.locationForDisplay;
    feature.properties.id = event.id;
    features.push(feature);
  }
  let featureCollection = {
    "type": "FeatureCollection",
    "features": features
  };
  res.send(featureCollection);
});


app.get('/api/qa/maintenance_works/summary/', async (req, res) => {
  let results = await getSummary('maintenance_works', models.MaintenanceWorksCheck, 'maintenanceWorkId');
  res.send(results);
});

app.get('/api/qa/maintenance_works/summary/provinces/:province', async (req, res) => {
  let province = req.params.province.split('_').join(' ');
  let results = [];
  for (let city of citiesByProvince[province]) {
    let cityQuery = city.replace("'", "''");
    let citiesLevel = 8;
    let result = await intersects('maintenance_works', 'b', 'b.id', cityQuery, citiesLevel);
    let ids = [];
    for (let event of result[0]) {
      ids.push(event.id);
    }
    let goodEvents = await findGoodEvents(models.MaintenanceWorksCheck, 'maintenanceWorkId', ids);
    let badEvents = await findBadEvents(models.MaintenanceWorksCheck, 'maintenanceWorkId', ids);
    let cityName = city.split(' ').join('_');
    results.push({
      name: city,
      nextUrl: '/api/qa/maintenance_works/summary/cities/' + cityName,
      summary: {
        numberOfGoodEvents: goodEvents.count,
        numberOfBadEvents: badEvents.count
      }
    });
  }
  res.send(results);
});

app.get('/api/qa/maintenance_works/summary/cities/:city', async (req, res) => {
  let city = req.params.city.split('_').join(' ');
  let cityQuery = city.replace("'", "''");
  let cityLevel = 8;
  let result = await intersects('maintenance_works', 'b', 'b.id', city, cityLevel);
  let ids = [];
  for (let event of result[0]) {
    ids.push(event.id);
  }
  let checkEvents = await models.MaintenanceWorksCheck.findAll({
    where: {
      maintenanceWorkId: ids
    }
  });

  res.send(checkEvents);
});

//TODO NEED TO FIX

// app.get('/api/download/maintenance_works/summary/', async (req, res) => {
// 	console.log('summary call')
// 	let results = await getEventSummary('maintenance_works');
//   sendCsv(results, 'maintenance_works', res);
// });
//
// app.get('/api/download/maintenance_works/summary/provinces/:province', async (req, res) => {
// 	console.log('province call')
//   let province = req.params.province;
//   let provinceName = province.split('_').join(' ');
//   let provinceLevel = 4;
//   let result = await intersects('maintenance_works', 'b', 'b.*', provinceName, provinceLevel);
//   sendCsv(result[0], 'maintenance_works', res);
// });
//
// app.get('/api/download/maintenance_works/summary/cities/:city', async (req, res) => {
// 	console.log('city call')
//   let city = req.params.city;
//   let cityName = city.split('_').join(' ');
//   let cityLevel = 8;
//   let result = await intersects('maintenance_works', 'b', 'b.*', cityName, cityLevel);
//   sendCsv(result[0], 'maintenance_works', res);
// });
//

// Default route
app.use('*', function(req, res) {
  res.send({
    'msg': 'route not found'
  }, 404);
});


async function getBridgeOpenings(startTime, endTime, bridgeId) {
  if (startTime === undefined) {
    startTime = 0;
  }
  if (endTime === undefined) {
    endTime = '9999-12-01';
  }

  if (bridgeId === undefined) {
    return [];
  }

  let bridgeOpenings = await models.BridgeOpening.findAll({
    raw: true,
    where: {
      bridgeId: bridgeId,
      startTime: {
        [op.gte]: new Date(startTime)
      },
      endTime: {
        [op.lte]: new Date(endTime)
      }
    }
  });
  return bridgeOpenings;

}

async function getMaintenanceWorks(startTime, endTime) {
  if (startTime === undefined) {
    startTime = 0;
  }
  if (endTime === undefined) {
    endTime = '9999-12-01';
  }
  console.log(startTime, endTime)

  let maintenanceWorks = await models.MaintenanceWorks.findAll({
    raw: true,
    attributes: ['id', 'locationForDisplay'],
    where: {
      situationRecordVersionTime: {
        [op.and]: {
          [op.gte]: new Date(startTime),
          [op.lte]: new Date(endTime)
        }
      }
    }
  });
  return maintenanceWorks;

}

async function getSummary(table, model, idName) {
  let provinces = ["North Holland", "Flevoland", "Gelderland", "North Brabant", "Overijssel", "Drenthe", "Groningen", "Friesland", "Limburg"];
  let results = [];
  for (let province of provinces) {
    let provinceLevel = 4;
    let result = await intersects(table, 'b', 'b.id', province, provinceLevel);
    let ids = [];
    for (let event of result[0]) {
      ids.push(event.id);
    }
    let goodBridgeOpeningss = await findGoodEvents(model, idName, ids);
    let badBridgeOpeningss = await findBadEvents(model, idName, ids);
    let provinceName = province.split(' ').join('_');
    results.push({
      name: province,
      nextUrl: `/api/qa/${table}/summary/provinces/${provinceName}`,
      summary: {
        numberOfGoodEvents: goodBridgeOpeningss.count,
        numberOfBadEvents: badBridgeOpeningss.count
      }
    });
  }
  return results;

}

async function intersects(table, as, attributes, boundariesName, level) {
  return [results, metadata] = await sequelize.query(
    `SELECT ${attributes} FROM ${table} AS ${as}, administrative_boundaries AS a
       WHERE a.name = '${boundariesName}' AND a.level=${level} AND
         ST_Intersects(
           ST_FlipCoordinates(${as}."locationForDisplay"), a.geog)`
  );
}

async function findGoodEvents(model, idName, ids) {
  let options = {
    where: {
      checksum: 1
    }
  };
  options.where[idName] = ids;
  let goodEvents = await model.findAndCountAll(options);
  return goodEvents;
}

async function findBadEvents(model, idName, ids) {
  let options = {
    where: {
      checksum: {
        [Sequelize.Op.ne]: 1
      }
    }
  };
  options.where[idName] = ids;
  let badEvents = await model.findAndCountAll(options);
  return badEvents;
}

async function getEventSummary(table) {
  let provinces = ["North Holland", "Flevoland", "Gelderland", "North Brabant", "Overijssel", "Drenthe", "Groningen", "Friesland", "Limburg"];
  let results = [];
  for (let province of provinces) {
    let provinceLevel = 4;
    let result = await intersects(table, 'b', 'b.*', province, provinceLevel);
    results.push(...result[0])
  }
	return results;
}

function sendCsv(body, name, res) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + name +'-' + Date.now() + '.csv\"');
  csvStringify(body, {
    header: true
  }).pipe(res);
}
