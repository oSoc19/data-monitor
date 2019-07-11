const express = require('express')
const cors = require('cors')
const geojson = require('geojson')
const Sequelize = require('sequelize')
const models = require('./fetchData/index')

const op = Sequelize.Op
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
        attributes: ['id', 'version', 'location'],
        where: {
            startTime: {
                [op.gt]: new Date(start)
            },
            endTime: {
                [op.lt]: new Date(end)
            }
        },
        order: [['id', 'ASC']]
    })
    for (let i = 0; i < output.length; i++) {
        output[i] = geojson.parse(output[i].dataValues, { Point: 'location' });
    }
    let featureCollection = {
        "type": "FeatureCollection",
        "features": output
    }
    res.send(featureCollection);
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
    let country = {
        "name": req.params.country,
        "children": [
            {
                "name": "Oost-Nederland",
                "detail": "/api/qa/bridgeopenings/summary/region/Oost-Nederland",
                "children":
                    [{ "name": "good", "value": 168 }, { "name": "bad", "value": 0 }]
            },
            {
                "name": "Noord-Nederland",
                "detail": "/api/qa/bridgeopenings/summary/region/Noord-Nederland",
                "children":
                    [{ "name": "good", "value": 99 }, { "name": "bad", "value": 1 }]
            }
        ]
    }
    res.json(country)
})

app.get('/api/qa/bridgeopenings/summary/region/:region', (req, res, next) => {
    let region = {
        "name": req.params.region,
        "children": [
            {
                "name": "Utrecht",
                "detail": "/api/qa/bridgeopenings/summary/province/Utrecht",
                "children":
                    [{ "name": "good", "value": 168 }, { "name": "bad", "value": 0 }]
            }
        ]
    }
    res.json(region)
})
app.get('/api/qa/bridgeopenings/summary/province/:province', (req, res, next) => {
    let province = {
        "name": req.params.province,
        "children": [
            {
                "name": "Utrecht",
                "detail": "/api/qa/bridgeopenings/summary/city/Utrecht",
                "children":
                    [{ "name": "good", "value": 168 }, { "name": "bad", "value": 0 }]
            }
        ]
    }
    res.json(province)
})

app.get('/api/qa/bridgeopenings/summary/city/:city', (req, res, next) => {
    let city = {
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
    res.json(city)
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

