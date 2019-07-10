const express = require('express');
const cors = require('cors');
// const Sequelize = require('sequelize');

// const models = require('../fetchData/index')

// const locationFinder = require('./locationFinder');

let app = express();

// const sequelize = new Sequelize(
//   process.env.DATABASE,
//   process.env.DATABASE_USER,
//   process.env.DATABASE_PASSWORD, {
//     host: 'database',
//     dialect: 'postgres',
//   },
// );

app.use(cors())

// sequelize.sync({ force: true })
//   .then(() => {
    app.listen(8080, () => {
      console.log('API Server listening on port 8080')
    })
  // })

app.get("/", (req, res, next) => { })

// app.get("/api/bridges", async (req, res, next) => {
//   let id = req.query.id
//   // let loc = req.query.location

//   let bridge = await models.Bridge.findOne({
//     where: {
//       id: id
//     }
//   })
//   res.send(bridge)
// })

app.get('/api/bridgeopenings', async (req, res, next) => {

  let id = req.query.id

  let sample = [
    {
      "type": "Feature",
      "properties": {
        "situationRecordId": "1",
        "name": "BridgeOpening",
      },
      "geometry": {
        "type": "Point",
        "coordinates": [52.386032, 4.647417]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "situationRecordId": "2",
        "name": "BridgeOpening"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [52.371426, 4.640142]
      }
    }
  ]
  res.json(sample)

})

app.get('/api/bridgeopenings/:id', (req, res, next) => {
  let bridge = {
    "id": req.params.id,
    "operatorActionStatus": "beingTerminated",
    "other property of interest": "other value",
    "location": [52.386032, 4.647417],
    "score": Math.random(1)
  }
  res.json(bridge)
})

app.get('/api/qa/bridgeopenings/summary/country/:country', (req, res, next) => {
  let aggregate = {
    "name": req.params.country,
    "children":[
      {"name": "Oost-Nederland",
       "children":
         [ {"name": "good", "value": 168}, {"name": "bad", "value": 0}]
       },
       {"name": "Noord-Nederland",
        "children":
           [{"name": "good", "value": 99}, {"name": "bad", "value": 1}]
       }
      ]
    }
    res.json(aggregate)
})

app.get('/api/qa/bridgeopenings/summary/city/:city', (req, res, next) => {
  let qa = {
    "name": req.params.city,
    "children": [
      { "id": "qa-assessment-id",
        "situationRecordId": "situationRecordId",
        "nameOfCheck1": "ok",
        "check2": "nok",
        "check3": "overruled ok"
      }
     ]
   }
   res.json(qa)
})

app.put('/api/qa/bridgeopenings/:qaID', (req, res, next) => {
  let payload = {
    "id": req.params.qaID,
    "situationRecordId": "situationRecordId",
    "nameOfCheck1": "ok",
    "check2": "nok",
    "check3": "overruled ok"
  }
})

app.use(function (req, res) {
  res.status(404);
});

