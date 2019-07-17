const GeoJson = require('geojson');
/*
 * A BridgeOpening indicates when a bridge will be open or close 
 * (Note: a bridge is considered open if a boat can pass below it.
 *  OPEN  : __/ \__
 *  CLOSE : _______)
 */
const bridgeOpening = (sequelize, DataTypes) => {
  const BridgeOpening = sequelize.define('bridge_opening', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    version: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT)
    },
    creationTime: {
      type: DataTypes.DATE
    },
    // The date when the bridge will be open
    startTime: {
      type: DataTypes.DATE
    },
    endTime: {
      type: DataTypes.DATE
    },
    geoJsonLocation: {
      type: DataTypes.GEOMETRY('POINT')
    }
  });

  BridgeOpening.associate = models => {
    BridgeOpening.hasOne(models.BridgeOpeningCheck)
  }


  /* Create a bridge event corresponding to a situation record
   * and associate this event to a bridge. 
   */
  BridgeOpening.addBridgeOpening = async (situation, models) => {
    let location = situation.situationRecord.groupOfLocations.locationForDisplay;
    let situationRecord = situation.situationRecord;
    let bridgeOpening = await models.BridgeOpening.findOne({
      where: {
        id: situationRecord['$'].id
      }
    });
    if (!bridgeOpening) {
      /* Try to find the bridge associate to the bridge event. If the bridge doesn't 
       * exist, we create a new one.
       */
      let bridge = await models.Bridge.findOne({
        where: {
          location: [location.longitude, location.latitude]
        }
      });
      if (!bridge) {
        bridge = await models.Bridge.createBridge(location.longitude, location.latitude, models)
      }
      bridgeOpening = await BridgeOpening.create({
        id: situationRecord['$'].id,
        version: situationRecord['$'].version,
        location: [location.longitude, location.latitude],
        creationTime: situationRecord.situationRecordCreationTime,
        startTime: situationRecord.validity.validityTimeSpecification.overallStartTime,
        endTime: situationRecord.validity.validityTimeSpecification.overallEndTime,
        geoJsonLocation: GeoJson.parse(location, {
          Point: ['longitude', 'latitude']
        }).geometry,
        bridgeId: bridge.id
      })
    }
    else{
      console.log("updating existing bridge")
      bridgeOpening = await bridgeOpening.update({
        version: situationRecord['$'].version,
        location: [location.longitude, location.latitude],
        creationTime: situationRecord.situationRecordCreationTime,
        startTime: situationRecord.validity.validityTimeSpecification.overallStartTime,
        endTime: situationRecord.validity.validityTimeSpecification.overallEndTime,
        geoJsonLocation: GeoJson.parse(location, {
          Point: ['longitude', 'latitude']
        }).geometry
      })
    }
		models.BridgeOpeningCheck.createCheckAllFields(bridgeOpening);
  };

  return BridgeOpening;
};

module.exports = bridgeOpening;

