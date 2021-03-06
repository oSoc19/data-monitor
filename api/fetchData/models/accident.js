const GeoJson = require('geojson');
const get = require('../getNested.js');

/**
 * Accident indicate if an accident is happening or just happpened in the Netherlands.
 * Model based on objects from the opendata provided by the NDW.
 * Each accident entry is a situationRecord in the SOAP file.
 * Data found at http://opendata.ndw.nu/incidents.xml.gz
 * Documentation found at http://docs.ndwcloud.nu/
 * Documentation for the accident : http://docs.ndwcloud.nu/en/sb/pechenongevallen/specialisatie/Accident.html
 */
const accident = (sequelize, DataTypes) => {
  /**
   * The model of the accident with all its components.
   */
  const Accident = sequelize.define('accident', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
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

  /**
   * Associate the accident model with the accident check model.
   */
  Accident.associate = models => {
    Accident.hasOne(models.AccidentCheck, { onDelete: 'cascade' });
    // Link to the AccidentCheck model.
    // This property is used in the api/server.js to acces the check table
    Accident.checkTable = models.AccidentCheck;
  }

  /**
   * Create an accident object corresponding to a situationRecord.
   * @param  {Object} situationRecord
   * @param  {Object} models
   */
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

    // Search in the database to see if the accident is already in the database
    // if the accident is already in the db we just update the accident
    let accident = await models.Accident.findOne({
      where: {
        id: id
      }
    })

    if (!accident) {
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
