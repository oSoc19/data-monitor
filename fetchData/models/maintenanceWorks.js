const GeoJson = require('geojson');
const get = require('../getNested.js');

/**
 * A maintenance works indicate actual and planned road maintenance works.
 * Model based on objects from the opendata provided by the NDW.
 * Data found at http://opendata.ndw.nu/wegwerkzaamheden.xml.gz
 * Documentation found at http://docs.ndwcloud.nu/en/sb/algemeen/specialisatie/MaintenanceWorks_wwz.html
 */
const maintenanceWorks = (sequelize, DataTypes) => {
  /**
   * The model of the maitenance works with all its components.
   */
  const MaintenanceWorks = sequelize.define('maintenance_works', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    version: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
    },
    situationRecordCreationTime: {
      type: DataTypes.DATE
    },
    situationRecordVersionTime: {
      type: DataTypes.DATE
    },
    probabilityOfOccurrence: {
      type: DataTypes.STRING
    },
    operatorActionStatus: {
      type: DataTypes.STRING
    },
    source: {
      type: DataTypes.STRING
    },
    overallStartTime: {
      type: DataTypes.DATE
    },
    overallEndTime: {
      type: DataTypes.DATE
    },
    mobilityType: {
      type: DataTypes.STRING
    },
    subjectTypeOfWorks: {
      type: DataTypes.STRING
    },
    locationForDisplay: {
      type: DataTypes.GEOMETRY('POINT')
    },
  });

  /**
   * Associate the maintenance works model with the maintenance works check model.
   */
  MaintenanceWorks.associate = models => {
    MaintenanceWorks.hasOne(models.MaintenanceWorksCheck);
    MaintenanceWorks.checkTable = models.MaintenanceWorksCheck;
  }
  /**
   * Create a maintenance works object corresponding to a situationRecord.
   * @param  {Object} situationRecord
   * @param  {Object} models
   */
  MaintenanceWorks.addMaintenanceWorks = async (situationRecord, models) => {
    // If it is not a situationRecord, return.
    if (get(['$', 'xsi:type'], situationRecord) != 'MaintenanceWorks') {
      return;
    }

    //If it is not a recent data, return.
    if (!isNewData(new Date(get(['situationRecordVersionTime'], situationRecord)))) {
      return;
    }

    let locationForDisplay;
    let groupOfLocations = get(['groupOfLocations'], situationRecord)
    if (groupOfLocations['$']['xsi:type'] === 'Point') {
      locationForDisplay = get(['locationForDisplay'], groupOfLocations)

    } else if (groupOfLocations['$']['xsi:type'] === 'Linear') {
      locationForDisplay = get(['locationForDisplay'], groupOfLocations)

    } else if (groupOfLocations['$']['xsi:type'] === 'ItineraryByIndexedLocations') {
      if (Array.isArray(get(['locationContainedInItinerary'], groupOfLocations))) {
        locationForDisplay = get(['locationContainedInItinerary[0]', 'location', 'locationForDisplay'], groupOfLocations)

      } else {
        locationForDisplay = get(['locationContainedInItinerary', 'location', 'locationForDisplay'], groupOfLocations)
      }
    }

    // Error in the situation record
    if (!locationForDisplay) {
      return;
    }
    // If the maintenanceWorks event doesn't exist, it is created, otherwise it is updated.
    let maintenanceWorksEntry = {
      id: get(['$', 'id'], situationRecord),
      version: get(['$', 'version'], situationRecord),
      type: get(['$', 'xsi:type'], situationRecord),
      situationRecordCreationTime: get(['situationRecordCreationTime'], situationRecord),
      situationRecordVersionTime: get(['situationRecordVersionTime'], situationRecord),
      probabilityOfOccurrence: get(['probabilityOfOccurrence'], situationRecord),
      operatorActionStatus: get(['operatorActionStatus'], situationRecord),
      source: get(['source', 'sourceName', 'values', 'value', '_'], situationRecord),
      overallStartTime: get(['validity', 'validityTimeSpecification', 'overallStartTime'], situationRecord),
      overallEndTime: get(['validity', 'validityTimeSpecification', 'overallEndTime'], situationRecord),
      mobilityType: get(['mobility', 'mobilityType'], situationRecord),
      subjectTypeOfWorks: get(['subjects', 'subjectTypeOfWorks'], situationRecord),
      locationForDisplay: GeoJson.parse(locationForDisplay, {
        Point: ['latitude', 'longitude']
      }).geometry,
    }

    let maintenanceWorks = await models.MaintenanceWorks.findOne({
      where: {
        id: situationRecord['$'].id,
      }
    });
    if (!maintenanceWorks) {
      maintenanceWorks = await models.MaintenanceWorks.create(maintenanceWorksEntry)
    } else {
      maintenanceWorks = await maintenanceWorks.update(maintenanceWorksEntry)
    }
    models.MaintenanceWorksCheck.createCheck(maintenanceWorks);
  };

  return MaintenanceWorks;
};

/**
 * Return true if the date is 3 months old or less
 * @param  {String} date
 */
function isNewData(date) {
  let maxCreationDate = new Date();
  // We allow only events that were created after the current time - 3 months
  maxCreationDate.setMonth(maxCreationDate.getMonth() - 3);

  return date >= maxCreationDate;
}

module.exports = maintenanceWorks;
