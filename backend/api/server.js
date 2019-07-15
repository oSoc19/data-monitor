const express = require('express');
const cors = require('cors');
const geojson = require('geojson');
const Sequelize = require('sequelize');
const models = require('./fetchData/index');
const bodyParser = require('body-parser');

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

app.get("/", (req, res, next) => { });

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

app.get('/api/qa/bridgeoepnings/summary/', async (req, res) => {
  let provinces = ["North Holland", "South Holland", "Flevoland", "Gelderland", "North Brabant", "Overijssel", "Drenthe", "Utrecht", "Groningen", "Friesland", "Zeeland", "Limburg"]
  let results = [];
  for (let province of provinces) {
    let provinceLevel = 4
    let result = await intersectsBridgeEvent(province, provinceLevel);
    let ids = [];
    for (let bridgeEvent of result[0]) {
      ids.push(bridgeEvent.id);
    }
    let goodBridgeEvents = await findGoodEvents(models.BridgeEventCheck, ids);
    let badBridgeEvents = await findBadEvents(models.BridgeEventCheck, ids);
    results.push({
      name: province,
      nextUrl: `/api/qa/bridgeopenigns/summary/provinces/${province}`,
      summary: {
        numberOfGoodEvents: goodBridgeEvents.count,
        numberOfBadEvents: badBridgeEvents.count
      }
    });
  }
  res.send(results);
});


app.get('/api/qa/bridgeopenings/summary/country/:country', (req, res, next) => {
  let country = {
    "name": req.params.country,
    "children": [{
      "name": "Oost-Nederland",
      "detail": "/api/qa/bridgeopenings/summary/region/Oost-Nederland",
      "children": [{
        "name": "good",
        "value": 168
      }, {
        "name": "bad",
        "value": 0
      }]
    },
    {
      "name": "Noord-Nederland",
      "detail": "/api/qa/bridgeopenings/summary/region/Noord-Nederland",

      "children": [{
        "name": "good",
        "value": 99
      }, {
        "name": "bad",
        "value": 1
      }]
    }
    ]
  };
  res.json(country);
});

app.get('/api/qa/bridgeopenings/summary/region/:region', (req, res, next) => {
  let region = {
    "name": req.params.region,
    "children": [{
      "name": "Utrecht",
      "detail": "/api/qa/bridgeopenings/summary/province/Utrecht",
      "children": [{
        "name": "good",
        "value": 168
      }, {
        "name": "bad",
        "value": 0
      }]
    }]
  };
  res.json(region);
});

app.get('/api/qa/bridgeopenings/summary/province/:province', (req, res, next) => {
  let province = {
    "name": req.params.province,
    "children": [{
      "name": "Utrecht",
      "detail": "/api/qa/bridgeopenings/summary/city/Utrecht",
      "children": [{
        "name": "good",
        "value": 168
      }, {
        "name": "bad",
        "value": 0
      }]
    }]
  };
  res.json(province);
});


app.get('/api/qa/bridgeopenings/summary/city/:city', (req, res, next) => {
  let city = {
    "name": req.params.city,
    "children": [{
      "id": "qa-assessment-id",
      "situationRecordId": "situationRecordId",
      "nameOfCheck1": "ok",
      "check2": "nok",
      "check3": "overruled ok"
    }]
  };
  res.json(city);
});

app.get('/api/bridges/:id', (req, res, next) => {

});

app.put('/api/qa/bridgeopenings/:id', async (req, res, next) => {
  debugger
  let id = req.id;

  let checks = models.bridgeEventCheck.findOne({
    where: {
      bridgeEventId: id
    }
  });

  if (checks) {
    await checks.update({
      manualIntervention: req.body.intervention,
      comment : req.body.comment
    })
  }
})


app.use(function (req, res) {
  res.status(404);
})


async function intersectsBridgeEvent(boundariesName, level) {
  return [results, metadata] = await sequelize.query(

    `/* Select all columns from bridge_events, use table administrative boundaries*/
     SELECT  b.id FROM bridge_events AS b, administrative_boundaries AS a

       WHERE a.name = '${boundariesName}' AND a.level=${level} AND

         /* Basically we want the points of the event bridges which intersects the admin boundaries*/
         ST_Intersects(

           ST_SetSRID(b."geoJsonLocation", 4326),

           /* Arg 2: the coordinates of the polygon of Amsterdam.
               Note 1: it requires to flip coordinates because the data was flipped...
               Note 2: I need some explicit casting to 'geometry' type, because it was stored as 'geogrpahy' type
             */
           ST_FlipCoordinates(a.geog::geometry)::geometry)`
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
