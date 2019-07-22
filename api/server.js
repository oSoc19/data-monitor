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


const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD, {
    host: 'database',
    dialect: 'postgres',
  },
);

associateModels();

// Load the file with all the provincie and cities
const citiesByProvince = JSON.parse(fs.readFileSync('./data/dutchCitiesBigger.json'));
const PROVINCES = Object.keys(citiesByProvince);

// City and province level defined in the administrative table
const CITY_LEVEL = 8;
const PROVINCE_LEVEL = 4;

let app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.listen(8080, () => {
  console.log('API Server listening on port 8080');
});

// Bridge and Bridge Openings API

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
    let feature = geojson.parse(bridges[i], {
      Point: 'location'
    });

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
  let results = await getSummary(models.BridgeOpening);
  res.send(results);
});

app.get('/api/qa/bridge_openings/summary/provinces/:province', async (req, res) => {
  let results = await getProvinceSummary(req.params.province, models.BridgeOpening);
  res.send(results);
});

app.get('/api/qa/bridge_openings/summary/cities/:city', async (req, res) => {
  let results = await getCitySummary(req.params.city, models.BridgeOpening);
  res.send(results);
});

app.get('/api/download/bridge_openings/summary/', async (req, res) => {
  let results = await getEventSummary(models.BridgeOpening);
  sendCsv(results, models.BridgeOpening.getTableName(), res);
});

app.get('/api/download/bridge_openings/summary/provinces/:province', async (req, res) => {
  let result = await getEventProvinceSummary(req.params.province, models.BridgeOpening);
  sendCsv(result, models.BridgeOpening.getTableName(), res);
});

app.get('/api/download/bridge_openings/summary/cities/:city', async (req, res) => {
  let result = await getEventCitySummary(req.params.city, models.BridgeOpening);
  sendCsv(result, models.BridgeOpening.getTableName(), res);
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

// Maintenance works API

app.get('/api/maintenance_works/:id', async (req, res) => {
  let result = await models.MaintenanceWorks.findOne({
    where: {
      id: req.params.id
    }
  });
  res.send(result);


});

app.get('/api/maintenance_works/', async (req, res, next) => {
  let startTime = req.params.startTime;
  let endTime = req.params.endTime;
  let featureCollection = await createFeatureCollection(models.MaintenanceWorks, startTime, endTime);
  res.send(featureCollection);
});


app.get('/api/qa/maintenance_works/summary/', async (req, res) => {
  let results = await getSummary(models.MaintenanceWorks);
  res.send(results);
});

app.get('/api/qa/maintenance_works/summary/provinces/:province', async (req, res) => {
  let results = await getProvinceSummary(req.params.province, models.MaintenanceWorks);
  res.send(results);
});

app.get('/api/qa/maintenance_works/summary/cities/:city', async (req, res) => {
  res.send(await getCitySummary(req.params.city, models.MaintenanceWorks));
});

app.get('/api/download/maintenance_works/summary/', async (req, res) => {
  let results = await getEventSummary(models.MaintenanceWorks);
  sendCsv(results, models.MaintenanceWorks.getTableName(), res);
});

app.get('/api/download/maintenance_works/summary/provinces/:province', async (req, res) => {
  let result = await getEventProvinceSummary(req.params.province, models.MaintenanceWorks);
  sendCsv(result, models.MaintenanceWorks.getTableName(), res);
});

app.get('/api/download/maintenance_works/summary/cities/:city', async (req, res) => {
  let result = await getEventCitySummary(req.params.city, models.MaintenanceWorks);
  sendCsv(result, models.MaintenanceWorks.getTableName(), res);
});

// Accident API

app.get('/api/accidents/:id', async (req, res) => {
  let result = await models.Accident.findOne({
    where: {
      id: req.params.id
    }
  });
  res.send(result);


});

app.get('/api/accidents/', async (req, res, next) => {
  let startTime = req.query.startTime;
  let endTime = req.query.endTime;
  let featureCollection = await createFeatureCollection(models.Accident, startTime, endTime);
  res.send(featureCollection);
});


app.get('/api/qa/accidents/summary/', async (req, res) => {
  let results = await getSummary(models.Accident);
  res.send(results);
});

app.get('/api/qa/accidents/summary/provinces/:province', async (req, res) => {
  let results = await getProvinceSummary(req.params.province, models.Accident);
  res.send(results);
});

app.get('/api/qa/accidents/summary/cities/:city', async (req, res) => {
  res.send(await getCitySummary(req.params.city, models.Accident));
});

app.get('/api/download/accidents/summary/', async (req, res) => {
  let results = await getEventSummary(models.Accident);
  sendCsv(results, models.Accident.getTableName(), res);
});

app.get('/api/download/accidents/summary/provinces/:province', async (req, res) => {
  let result = await getEventProvinceSummary(req.params.province, models.Accident);
  sendCsv(result, models.Accident.getTableName(), res);
});

app.get('/api/download/accidents/summary/cities/:city', async (req, res) => {
  let result = await getEventCitySummary(req.params.city, models.Accident);
  sendCsv(result, models.Accident.getTableName(), res);
});

/*
 * --------------------------------------------------
 * Default route
 * Don't put others API endpoints after this function
 * --------------------------------------------------
 */
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

async function createFeatureCollection(table, startTime, endTime) {
  let events = await getAllEvents(table, startTime, endTime);
  let features = [];
  for (let event of events) {
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

  return featureCollection;
}

async function getAllEvents(table, startTime, endTime) {
  if (startTime === undefined) {
    startTime = 0;
  }
  if (endTime === undefined) {
    endTime = '9999-12-01';
  }

  let events = await table.findAll({
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
  return events;

}

async function getSummary(table) {
  let results = [];
  for (let province of PROVINCES) {
    let result = await intersects(table, 'b', 'b.id', province, PROVINCE_LEVEL);
    let ids = [];
    for (let event of result[0]) {
      ids.push(event.id);
    }
    let goodEvents = await findGoodEvents(table.checkTable, ids);
    let badEvents = await findBadEvents(table.checkTable, ids);
    let provinceName = province.split(' ').join('_');
    results.push({
      name: province,
      nextUrl: `/api/qa/${table.getTableName()}/summary/provinces/${provinceName}`,
      summary: {
        numberOfGoodEvents: goodEvents.count,
        numberOfBadEvents: badEvents.count
      }
    });
  }
  return results;

}

async function getProvinceSummary(province, table) {
  province = province.split('_').join(' ');
  let results = [];
  for (let city of citiesByProvince[province]) {
    // String in query which contain ' must be changed to ''
    let cityQuery = city.replace("'", "''");
    let result = await intersects(table, 'b', 'b.id', cityQuery, CITY_LEVEL);
    let ids = [];
    for (let event of result[0]) {
      ids.push(event.id);
    }
    let goodEvents = await findGoodEvents(table.checkTable, ids);
    let badEvents = await findBadEvents(table.checkTable, ids);
    let cityName = city.split(' ').join('_');
    results.push({
      name: city,
      nextUrl: `/api/qa/${table.getTableName()}/summary/cities/` + cityName,
      summary: {
        numberOfGoodEvents: goodEvents.count,
        numberOfBadEvents: badEvents.count
      }
    });
  }
  return results;
}

async function getCitySummary(city, table) {
  city = city.split('_').join(' ');
  let cityQuery = city.replace("'", "''");
  let result = await intersects(table, 'b', 'b.id', city, CITY_LEVEL);
  let ids = [];
  for (let event of result[0]) {
    ids.push(event.id);
  }
  let checkEvents = await table.checkTable.findAll({
    where: {
      [table.checkTable.eventId]: ids
    }
  });
  return checkEvents;
}

async function intersects(table, as, attributes, boundariesName, level) {
  return [results, metadata] = await sequelize.query(
    `SELECT ${attributes} FROM ${table.getTableName()} AS ${as}, administrative_boundaries AS a
       WHERE a.name = '${boundariesName}' AND a.level=${level} AND
         ST_Intersects(${as}."locationForDisplay", a.geog)`
  );
}

async function findGoodEvents(model, ids) {
  let goodEvents = await model.findAndCountAll({
    where: {
      [model.eventId]: ids,
      checksum: 1
    }
  });
  return goodEvents;
}

async function findBadEvents(model, ids) {
  let badEvents = await model.findAndCountAll({
    where: {
      [model.eventId]: ids,
      checksum: {
        [op.ne]: 1
      }
    }
  });
  return badEvents;
}

async function getEventSummary(table) {
  let results = [];
  for (let province of PROVINCES) {
    let result = await intersects(table, 'b', 'b.*', province, PROVINCE_LEVEL);
    results.push(...result[0])
  }
  return results;
}

async function getEventProvinceSummary(province, table) {
  let provinceName = province.split('_').join(' ');
  let result = await intersects(table, 'b', 'b.*', provinceName, PROVINCE_LEVEL);
  return result[0];
}

async function getEventCitySummary(city, table) {
  city = city.split('_').join(' ');
  let result = await intersects(table, 'b', 'b.*', city, CITY_LEVEL);
  return result[0];
}

function sendCsv(body, name, res) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + name + '-' + Date.now() + '.csv\"');
  csvStringify(body, {
    header: true
  }).pipe(res);
}

