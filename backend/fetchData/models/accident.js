const GeoJson = require('geojson');
const get = require('../getNested.js');

const accident = (sequelize, DataTypes) => {
  const Accident = sequelize.define('accident', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    version: {
      type: DataTypes.INTEGER
    },
    probabilityOfOccurrence: {
      type: DataTypes.STRING
    },
    creationTime: {
      type: DataTypes.DATE
    },
    situationRecordVersionTime: {
      type: DataTypes.DATE
    },
    overallStartTime: {
      type: DataTypes.DATE
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT)
    },
    locationForDisplay: {
      type: DataTypes.GEOMETRY('POINT')
    },
    accidentType: {
      type: DataTypes.STRING
    },
    source: {
      type: DataTypes.STRING
    }
  })

  Accident.associate = models => {
    Accident.hasOne(models.AccidentCheck)
  }

  Accident.addAccident = async (situationRecord, models) => {
    if (get(['$', 'xsi:type'], situationRecord) != 'Accident') {
      return;
    }
    let location = get(['groupOfLocations', 'locationForDisplay'], situationRecord);
    let accidentEntry = {
      id: situationRecord['$'].id,
      version: situationRecord['$'].version,
      probabilityOfOccurrence: get(['probabilityOfOccurrence'], situationRecord),
      creationTime: get(['situationRecordCreationTime'], situationRecord),
      situationRecordVersionTime: get(['situationRecordVersionTime'], situationRecord),
      overallStartTime: get(['validity', 'validityTimeSpecification', 'overallStartTime'], situationRecord),
      location: [location.longitude, location.latitude],
      locationForDisplay: GeoJson.parse(location, {
        Point: ['longitude', 'latitude']
      }).geometry,
      accidentType: get(['accidentType'], situationRecord),
      source: get(['source', 'sourceName', 'values', 'value', '_'], situationRecord)
    }

    if(!accident){
      accident = await models.Accident.create(accidentEntry)
    }
    else {
      accident = await accident.update(accidentEntry)
    }
    models.AccidentChecks.createCheck(accident)
  }
  return Accident;
}

module.exports = accident;