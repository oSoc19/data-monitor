const GeoJson = require('geojson');
const get = require('../getNested.js');

const maintenanceWorks = (sequelize, DataTypes) => {
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
    probabilityOfOccurrence: { // Not required
      type: DataTypes.STRING
    },
    operatorActionStatus: {
      type: DataTypes.STRING
    },
    source: { // Not required
      type: DataTypes.STRING
    },
    overallStartTime: { // Not required
      type: DataTypes.DATE
    },
    overallEndTime: { // Not required
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
    location: {
      type: DataTypes.GEOMETRY('MULTILINESTRING')
    },
  });

  MaintenanceWorks.associate = models => {
    MaintenanceWorks.hasOne(models.MaintenanceWorksCheck);
    MaintenanceWorks.checkTable = models.MaintenanceWorksCheck;
  }

  MaintenanceWorks.addMaintenanceWorks = async (situationRecord, models) => {
    if (get(['$', 'xsi:type'], situationRecord) != 'MaintenanceWorks') {
      return;
    }

    if (!isNewData(new Date(get(['situationRecordVersionTime'],situationRecord)))) {
      return;
    }
    
    let locationForDisplay;
    let groupOfLocations = get(['groupOfLocations'], situationRecord)
    let listOfLines;
    let lineString = [];
    if (groupOfLocations['$']['xsi:type'] === 'Point') {
      locationForDisplay = get(['locationForDisplay'], groupOfLocations)

    } else if (groupOfLocations['$']['xsi:type'] === 'Linear') {
      locationForDisplay = get(['locationForDisplay'], groupOfLocations)
      listOfLines = [{
        location: groupOfLocations
      }] // To keep the same format

    } else if (groupOfLocations['$']['xsi:type'] === 'ItineraryByIndexedLocations') {
      if (Array.isArray(get(['locationContainedInItinerary'], groupOfLocations))) {
        locationForDisplay = get(['locationContainedInItinerary[0]', 'location', 'locationForDisplay'], groupOfLocations)
        listOfLines = get(['locationContainedInItinerary'], groupOfLocations);

      } else {
        locationForDisplay = get(['locationContainedInItinerary', 'location', 'locationForDisplay'], groupOfLocations)
        listOfLines = [groupOfLocations.locationContainedInItinerary];
      }
    }

    if (listOfLines) {
      for (let i = 0; i < listOfLines.length; i++) {
        if (listOfLines[i].location['$']['xsi:type'] === 'Point') {
          return; //Need to manage this case later
        }
        let startPoint = get(['location', 'linearExtension', 'linearByCoordinatesExtension', 'linearCoordinatesStartPoint', 'pointCoordinates'], listOfLines[i])
        let endPoint = get(['location', 'linearExtension', 'linearByCoordinatesExtension', 'linearCoordinatesEndPoint', 'pointCoordinates'], listOfLines[i])
        lineString.push([
          [startPoint.longitude, startPoint.latitude],
          [endPoint.longitude, endPoint.latitude]
        ]);
      }
    }

    if (!locationForDisplay) {
      return;

    } // Error in the situation record

    let location = GeoJson.parse({
      lineString: lineString
    }, {
      MultiLineString: 'lineString'
    }).geometry
    if (location.coordinates.length === 0) {
      location = null;
    }
    // If the maintenanceWorks event doesn't exist we create it else we update it
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
      location: location,

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

function isNewData(date) {
  let maxCreationDate = new Date();
  // We allow only events that were created after the current time - 3 months
  maxCreationDate.setMonth(maxCreationDate.getMonth() - 3);

  return date >= maxCreationDate;
}

module.exports = maintenanceWorks;
