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

const citiesByProvince = JSON.parse(fs.readFileSync('./data/dutchCities.json'));
associateModels();

app.get("/", (req, res, next) => {});

app.get('/api/bridges/', async (req, res, next) => {
  let bridges = await models.Bridge.findAll({
    raw: true
  });
  for (let i = 0; i < bridges.length; i++) {
    bridges[i] = geojson.parse(bridges[i], {
      Point: 'location'
    });
  }

  let featureCollection = {
    "type": "FeatureCollection",
    "features": bridges
  };
  res.send(featureCollection);
});


app.get('/api/bridgeopenings/', async (req, res, next) => {
  let start = req.query.startTime;
  let end = req.query.endTime;
  let bridgeId = req.query.id;

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = '9999-12-01';
  }

  if (bridgeId === undefined) {
    res.send({});
    return;
  }

  let bridgeEvents = await models.BridgeEvent.findAll({
    raw: true,
    attributes: ['id', 'version', 'startTime', 'endTime'],
    where: {
      bridgeId: bridgeId,
      startTime: {
        [op.gt]: new Date(start)
      },
      endTime: {
        [op.lt]: new Date(end)
      }
    }
  });
  for (let bridgeEvent of bridgeEvents) {
    bridgeEvent = geojson.parse(bridgeEvent, {
      Point: 'location'
    });
  }
  let featureCollection = {
    "type": "FeatureCollection",
    "features": bridgeEvents
  };
  res.send(featureCollection);
});

app.get('/api/bridgeopenings/:id', (req, res, next) => {
  (async () => {
    let output = await models.BridgeEvent.findOne({
      where: {
        id: req.params.id
      }
    });
    res.send(output);
  })();
});

app.get('/api/qa/bridgeopenings/summary/', async (req, res) => {
  // let provinces = ["North Holland", "South Holland", "Flevoland", "Gelderland", "North Brabant", "Overijssel", "Drenthe", "Utrecht", "Groningen", "Friesland", "Zeeland", "Limburg"]
  let provinces = ["North Holland", "Flevoland", "Gelderland", "North Brabant", "Overijssel", "Drenthe", "Groningen", "Friesland", "Limburg"];
  let results = [];
  for (let province of provinces) {
    let provinceLevel = 4;
    let result = await intersectsBridgeEvent(province, provinceLevel);
    let ids = [];
    for (let bridgeEvent of result[0]) {
      ids.push(bridgeEvent.id);
    }
    let goodBridgeEvents = await findGoodEvents(models.BridgeEventCheck, ids);
    let badBridgeEvents = await findBadEvents(models.BridgeEventCheck, ids);
    let provinceName = province.split(' ').join('_');
    results.push({
      name: province,
      nextUrl: `/api/qa/bridgeopenings/summary/provinces/${provinceName}`,
      summary: {
        numberOfGoodEvents: goodBridgeEvents.count,
        numberOfBadEvents: badBridgeEvents.count
      }
    });
  }
  res.send(results);
});

app.get('/api/qa/bridgeopenings/summary/provinces/:province', async (req, res) => {
  let province = req.params.province.split('_').join(' ');
  let results = [];
  for (let city of citiesByProvince[province]) {
    let cityQuery = city.replace("'", "''");
    let citiesLevel = 8;
    let result = await intersectsBridgeEvent(cityQuery, citiesLevel);
    let ids = [];
    for (let bridgeEvent of result[0]) {
      ids.push(bridgeEvent.id);
    }
    let goodBridgeEvents = await findGoodEvents(models.BridgeEventCheck, ids);
    let badBridgeEvents = await findBadEvents(models.BridgeEventCheck, ids);
    let cityName = city.split(' ').join('_');
    results.push({
      name: city,
      nextUrl: '/api/qa/bridgeopenings/summary/city/' + cityName,
      summary: {
        numberOfGoodEvents: goodBridgeEvents.count,
        numberOfBadEvents: badBridgeEvents.count
      }
    });
  }
  res.send(results);
});

app.get('/api/qa/bridgeopenings/summary/city/:city', async (req, res) => {
  let city = req.params.city.split('_').join(' ');
  let cityQuery = city.replace("'", "''");
  let cityLevel = 8;
  let result = await intersectsBridgeEvent(cityQuery, cityLevel);
  let ids = [];
  for (let bridgeEvent of result[0]) {
    ids.push(bridgeEvent.id);
  }
  let bridgeEventChecks = await models.BridgeEventCheck.findAll({
    attributes: ['bridgeEventId', 'allFields', 'correctID', 'checksum', 'manualIntervention'],
    where: {
      bridgeEventId: ids
    }
  });

  res.send(bridgeEventChecks);
});
app.get('/api/donwload/bridgeopenings/summary/', async (req, res) => {
  let provinces = ["North Holland", "Flevoland", "Gelderland", "North Brabant", "Overijssel", "Drenthe", "Groningen", "Friesland", "Limburg"];
  let results = [];
  for (let province of provinces) {
    let provinceLevel = 4;
    let result = await intersectsBridgeEvent(province, provinceLevel);
    console.log(result);
  }
  res.send(results);
});

app.put('/api/qa/bridgeopenings/:id', async (req, res, next) => {
  let id = parseInt(req.params.id);

  let checks = await models.BridgeEventCheck.findOne({
    where: {
      id: id
    }
  });

  if (checks) {
    try{
      await checks.update({
        manualIntervention: req.body.manualIntervention,
        comment : req.body.comment
      });
      res.send(checks);
    }

    catch (e) {
      console.error(e);
      res.status(500).json({'error':  'internal server error'});
    }
  }
});


app.use(function (req, res) {
  res.status(404);
});


async function intersectsBridgeEvent(boundariesName, level) {
  return [results, metadata] = await sequelize.query(

    `/* Select all columns from bridge_events, use table administrative boundaries*/
     SELECT  b.id FROM bridge_events AS b, administrative_boundaries AS a

       WHERE a.name = '${boundariesName}' AND a.level=${level} AND

         /* Basically we want the points of the event bridges which intersects the admin boundaries*/
         ST_Intersects(

           ST_FlipCoordinates(b."geoJsonLocation"),
           a.geog)`
  );

}

async function findGoodEvents(model, ids) {
  let goodBridgeEvents = await model.findAndCountAll({
    where: {
      bridgeEventId: ids,
      checksum: 1
    }
  });
  return goodBridgeEvents;
}


async function findBadEvents(model, ids) {
  let badBridgeEvents = await model.findAndCountAll({
    where: {
      bridgeEventId: ids,
      checksum: {
        [Sequelize.Op.ne]: 1
      }
    }
  });
  return badBridgeEvents;
}
