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
    dialect: 'postgres'
  },
);

// Load the file with all the provincie and cities
const citiesByProvince = JSON.parse(fs.readFileSync('./data/dutchCities.json'));
associateModels();

app.get("/", (req, res, next) => {});

app.get('/api/bridges/', async (req, res, next) => {
  let startTime = req.query.startTime;
  let endTime = req.query.endTime;
  console.log(startTime, endTime)

  let bridges = await models.Bridge.findAll({
    raw: true
  });
  let features = [];
  for (let i = 0; i < bridges.length; i++) {
    let bridgeOpenings = await getBridgeOpeningss(startTime, endTime, bridges[i].id);
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
  res.send(await getBridgeOpeningss(startTime, endTime, bridgeId));

});

app.get('/api/qa/bridge_openings/summary/', async (req, res) => {
  let results = await getSummary('bridge_openings');
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
    let goodBridgeOpeningss = await findGoodEvents(models.BridgeOpeningCheck, ids);
    let badBridgeOpeningss = await findBadEvents(models.BridgeOpeningCheck, ids);
    let cityName = city.split(' ').join('_');
    results.push({
      name: city,
      nextUrl: '/api/qa/bridge_openings/summary/city/' + cityName,
      summary: {
        numberOfGoodEvents: goodBridgeOpeningss.count,
        numberOfBadEvents: badBridgeOpeningss.count
      }
    });
  }
  res.send(results);
});

app.get('/api/qa/bridge_openings/summary/city/:city', async (req, res) => {
  let city = req.params.city.split('_').join(' ');
  let cityQuery = city.replace("'", "''");
  let cityLevel = 8;
  let result = await intersects('bridge_openings', 'b', 'b.id', city, cityLevel);
  let ids = [];
  for (let bridgeOpening of result[0]) {
    ids.push(bridgeOpening.id);
  }
  let bridgeOpeningChecks = await models.BridgeOpeningCheck.findAll({
    attributes: ['bridgeOpeningId', 'allFields', 'correctID', 'checksum', 'manualIntervention', 'comment'],
    where: {
      bridgeOpeningId: ids
    }
  });

  res.send(bridgeOpeningChecks);
});

app.get('/api/download/bridge_openings/summary/', async (req, res) => {
  let provinces = ["North Holland", "Flevoland", "Gelderland", "North Brabant", "Overijssel", "Drenthe", "Groningen", "Friesland", "Limburg"];
  let results = [];
  for (let province of provinces) {
    let provinceLevel = 4;
    let result = await intersects('bridge_openings', 'b', 'b.*', province, provinceLevel);
    results.push(...result[0])
  }
  sendCsv(results, res);
});

app.get('/api/download/bridge_openings/summary/provinces/:province', async (req, res) => {
  let province = req.params.province;
  let provinceName = province.split('_').join(' ');
  let provinceLevel = 4;
  let result = await intersects('bridge_openings', 'b', 'b.*', provinceName, provinceLevel);
  sendCsv(result[0], res);
});

app.get('/api/download/bridge_openings/summary/cities/:city', async (req, res) => {
  let city = req.params.city;
  let cityName = city.split('_').join(' ');
  let cityLevel = 8;
  let result = await intersects('bridge_openings', 'b', 'b.*', cityName, cityLevel);
  sendCsv(result[0], res);
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

// Default route
app.use('*', function(req, res) {
  res.send({
    'msg': 'route not found'
  }, 404);
});

async function getBridgeOpeningss(startTime, endTime, bridgeId) {
  if (startTime === undefined) {
    startTime = 0;
  }
  if (endTime === undefined) {
    endTime = '9999-12-01';
  }

  if (bridgeId === undefined) {
    res.send([]);
    return;
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

async function getSummary(table) {
  let provinces = ["North Holland", "Flevoland", "Gelderland", "North Brabant", "Overijssel", "Drenthe", "Groningen", "Friesland", "Limburg"];
  let results = [];
  for (let province of provinces) {
    let provinceLevel = 4;
    let result = await intersects(table, 'b', 'b.id', province, provinceLevel);
    let ids = [];
    for (let event of result[0]) {
      ids.push(event.id);
    }
    let goodBridgeOpeningss = await findGoodEvents(models.BridgeOpeningCheck, ids);
    let badBridgeOpeningss = await findBadEvents(models.BridgeOpeningCheck, ids);
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

async function findGoodEvents(model, ids) {
  let goodBridgeOpeningss = await model.findAndCountAll({
    where: {
      bridgeOpeningId: ids,
      checksum: 1
    }
  });
  return goodBridgeOpeningss;
}

async function findBadEvents(model, ids) {
  let badBridgeOpeningss = await model.findAndCountAll({
    where: {
      bridgeOpeningId: ids,
      checksum: {
        [Sequelize.Op.ne]: 1
      }
    }
  });
  return badBridgeOpeningss;
}

function sendCsv(body, res) {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'bridgeOpenings-' + Date.now() + '.csv\"');
  csvStringify(body, {
    header: true
  }).pipe(res);
}

