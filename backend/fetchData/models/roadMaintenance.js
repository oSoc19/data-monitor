const GeoJson = require('geojson');

const roadMaintenance = (sequelize, DataTypes) => {
  const RoadMaintenance = sequelize.define('road_maintenance', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    version: {
      type: DataTypes.INTEGER,
    },
    creationTime: {
      type: DataTypes.DATE
    },
    startTime: {
      type: DataTypes.DATE
    },
    endTime: {
      type: DataTypes.DATE
    },
    locationForDisplay: {
      type: DataTypes.GEOMETRY('POINT')
    },
    location: {
      type: DataTypes.GEOMETRY('LINESTRING')
    }
  });

  RoadMaintenance.addRoadMaintenance = async (situationRecord, models) => {
    let location;
    let groupOfLocations = situationRecord.groupOfLocations;
    if (groupOfLocations['$']['xsi:type'] === 'Point') {
      console.log('Point')
      location = groupOfLocations.location.locationForDisplay;
    } else if (groupOfLocations['$']['xsi:type'] === 'ItineraryByIndexedLocations' |
      groupOfLocations['$']['xsi:type'] === 'Linear') {
      console.log('itin or linear')
      if (Array.isArray(groupOfLocations.locationContainedInItinerary)) {
        location = groupOfLocations.locationContainedInItinerary[0].location.locationForDisplay;
      } else {
        location = groupOfLocations.locationContainedInItinerary.location.locationForDisplay;
      }
    }
    console.log(location)
    let roadMaintenance = await models.RoadMaintenance.findOne({
      where: {
        id: situationRecord['$'].id
      }
    });
    // if (!roadMaintenance) {
    //   roadMaintenance = await RoadMaintenance.create({
    //     id: situationRecord['$'].id,
    //     location: [location.longitude, location.latitude],
    //     creationTime: situationRecord.situationRecordCreationTime,
    //     startTime: situationRecord.validity.validityTimeSpecification.overallStartTime,
    //     endTime: situationRecord.validity.validityTimeSpecification.overallEndTime,
    //
    //     geoJsonLocation: GeoJson.parse(location, {
    //       Point: ['longitude', 'latitude']
    //     }).geometry,
    //   })
    // }
    // else{
    //   roadMaintenance = await roadMaintenance.update({
    //     version: situationRecord['$'].version,
    //     location: [location.longitude, location.latitude],
    //     creationTime: situationRecord.situationRecordCreationTime,
    //     startTime: situationRecord.validity.validityTimeSpecification.overallStartTime,
    //     endTime: situationRecord.validity.validityTimeSpecification.overallEndTime,
    //     geoJsonLocation: GeoJson.parse(location, {
    //       Point: ['longitude', 'latitude']
    //     }).geometry
    //   })
    // }
    // models.RoadMaintenanceCheck.createCheckAllFields(roadMaintenance);
  };

  return RoadMaintenance;
};

module.exports = roadMaintenance;

