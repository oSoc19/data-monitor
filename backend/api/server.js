const express = require('express')
const cors = require('cors')
const Sequelize = require('sequelize')
const op = Sequelize.Op

const models = require('./index')

// const locationFinder = require('./locationFinder');

let app = express()

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD, {
    host: 'database',
    dialect: 'postgres',
  },
)

app.use(cors())

sequelize.sync({ force: true })
  .then(() => {
    app.listen(8080, () => {
      console.log('API Server listening on port 8080')
    })
  })

app.get("/", (req, res, next) => { })


app.get('/api/bridgeopenings/', async (req, res, next) => {
  let start = req.query.startTime
  let end = req.query.endTime

  if (start === undefined)
    start = 0
  if (end === undefined)
    end = '9999-12-01'

  let output = await models.BridgeEvent.findAll({
    attributes: ['id', 'version', 'geoJsonLocation'],
    where: {
      startTime: {
        [op.gt]: new Date(start)
      },
      endTime: {
        [op.lt]: new Date(end)
      }
    }
  })
  res.send(output)
})

app.get('/api/bridgeopenings/:id', (req, res, next) => {
  (async () => {
    let output = await models.BridgeEvent.findOne({
      where: {
        id: req.params.id
      }
    })
    res.send(output)
  })()
})

app.get('/api/qa/bridgeopenings/summary/country/:country', (req, res, next) => {
  let aggregate = {
    "name": req.params.country,
    "children": [
      {
        "name": "Oost-Nederland",
        "children":
          [{ "name": "good", "value": 168 }, { "name": "bad", "value": 0 }]
      },
      {
        "name": "Noord-Nederland",
        "children":
          [{ "name": "good", "value": 99 }, { "name": "bad", "value": 1 }]
      }
    ]
  }
  res.json(aggregate)
})

app.get('/api/qa/bridgeopenings/summary/city/:city', (req, res, next) => {
  let qa = {
    "name": req.params.city,
    "children": [
      {
        "id": "qa-assessment-id",
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
  res.status(404)
})

