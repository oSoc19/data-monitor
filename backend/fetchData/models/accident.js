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
    Accident.hasOne(models.AccidentCheck, { onDelete: 'cascade' });
    Accident.checkTable = models.AccidentCheck;
  }

  Accident.addAccident = async (situationRecord, models) => {
    if (get(['$', 'xsi:type'], situationRecord) != 'Accident') {
      return;
    }
    let location = get(['groupOfLocations', 'locationForDisplay'], situationRecord);
    let id = get(['$', 'id'], situationRecord);
    let accidentEntry = {
      id: id,
      version: get(['$', 'version'], situationRecord),
      probabilityOfOccurrence: get(['probabilityOfOccurrence'], situationRecord),
      creationTime: get(['situationRecordCreationTime'], situationRecord),
      situationRecordVersionTime: get(['situationRecordVersionTime'], situationRecord),
      overallStartTime: get(['validity', 'validityTimeSpecification', 'overallStartTime'], situationRecord),
      locationForDisplay: GeoJson.parse(location, {
        Point: ['latitude', 'longitude']
      }).geometry,
      accidentType: get(['accidentType'], situationRecord),
      source: get(['source', 'sourceName', 'values', 'value', '_'], situationRecord)
    }

    let accident = await models.Accident.findOne({
      where: {
        id: id
      }
    })

    if(!accident){
      accident = await models.Accident.create(accidentEntry)
    }
    else {
      accident = await accident.update(accidentEntry)
    }
    models.AccidentCheck.createCheck(accident)
  }
  return Accident;
}

module.exports = accident;
