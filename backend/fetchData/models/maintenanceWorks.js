const GeoJson = require('geojson');
const get = require('../getNested.js');

const maintenanceWorks = (sequelize, DataTypes) => {
  const MaintenanceWorks = sequelize.define('maintenance_works', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
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

  MaintenanceWorks.addMaintenanceWorks = async (situationRecord, models) => {
    if (get(['$', 'xsi:type'], situationRecord) !== 'MaintenanceWorks') {
      return;
    }

    if (!isNewData(new Date(situationRecord.situationRecordVersionTime))) {
      return;
    }
    
    let locationForDisplay;
    let groupOfLocations = situationRecord.groupOfLocations;
    let listOfLines;
    let lineString = [];
    if (groupOfLocations['$']['xsi:type'] === 'Point') {
      locationForDisplay = groupOfLocations.locationForDisplay;

    } else if (groupOfLocations['$']['xsi:type'] === 'Linear') {
      locationForDisplay = groupOfLocations.locationForDisplay;
      listOfLines = [{
        location: groupOfLocations
      }] // To keep the same format

    } else if (groupOfLocations['$']['xsi:type'] === 'ItineraryByIndexedLocations') {
    // if (groupOfLocations['$']['xsi:type'] === 'ItineraryByIndexedLocations') {
      if (Array.isArray(groupOfLocations.locationContainedInItinerary)) {
        locationForDisplay = groupOfLocations.locationContainedInItinerary[0].location.locationForDisplay;
        listOfLines = groupOfLocations.locationContainedInItinerary;

      } else {
        locationForDisplay = groupOfLocations.locationContainedInItinerary.location.locationForDisplay;
        listOfLines = [groupOfLocations.locationContainedInItinerary];
      }
    }

    if (listOfLines) {
      for (let i = 0; i < listOfLines.length; i++) {
        if (listOfLines[i].location['$']['xsi:type'] === 'Point') {
          // console.log("Point value " + Date.now())
          return; //Need to manage this case later
        }
        let startPoint = listOfLines[i].location.linearExtension.linearByCoordinatesExtension.linearCoordinatesStartPoint.pointCoordinates;
        let endPoint = listOfLines[i].location.linearExtension.linearByCoordinatesExtension.linearCoordinatesEndPoint.pointCoordinates;
        lineString.push([
          [startPoint.longitude, startPoint.latitude],
          [endPoint.longitude, endPoint.latitude]
        ]);
      }
    }

    if (!locationForDisplay) {
			console.log("No locationfordisplay value " + Date.now())
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
      situationRecordCreationTime: situationRecord.situationRecordCreationTime,
      situationRecordVersionTime: situationRecord.situationRecordVersionTime,
      probabilityOfOccurrence: situationRecord.probabilityOfOccurrence,
      operatorActionStatus: situationRecord.operatorActionStatus,
      source: get(['source', 'sourceName', 'values', 'value', '_'], situationRecord),
      overallStartTime: get(['validity', 'validityTimeSpecification', 'overallStartTime'], situationRecord),
      overallEndTime: get(['validity', 'validityTimeSpecification', 'overallEndTime'], situationRecord),
      mobilityType: get(['mobility', 'mobilityType'], situationRecord),
      subjectTypeOfWorks: get(['subjects', 'subjectTypeOfWorks'], situationRecord),
      locationForDisplay: GeoJson.parse(locationForDisplay, {
        Point: ['longitude', 'latitude']
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
