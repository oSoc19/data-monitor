const GeoJson = require('geojson');
/*
 * A BridgeEvent indicates when a bridge will be open or close
 * (Note: a bridge is considered open if a boat can pass below it.
 *  OPEN  : __/ \__
 *  CLOSE : _______)
 */
const bridgeEvent = (sequelize, DataTypes) => {
  const BridgeEvent = sequelize.define('bridge_event', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    version: {
      type: DataTypes.INTEGER
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

  BridgeEvent.associate = models => {
    BridgeEvent.hasOne(models.BridgeEventCheck)
  }


  /* Create a bridge event corresponding to a situation record
   * and associate this event to a bridge.
   */
  BridgeEvent.addBridgeEvent = async (situation, models) => {
    let location = situation.situationRecord.groupOfLocations.locationForDisplay;
    let situationRecord = situation.situationRecord;
    let bridgeEvent = await models.BridgeEvent.findOne({
      where: {
        id: situationRecord['$'].id
      }
    });
    if (!bridgeEvent) {
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
      bridgeEvent = await BridgeEvent.create({
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
      bridgeEvent = await bridgeEvent.update({
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
    models.BridgeEventCheck.createCheckAllFields(bridgeEvent);
  };

  return BridgeEvent;
};

module.exports = bridgeEvent;
