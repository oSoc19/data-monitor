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
    creationTime: {
      type: DataTypes.DATE
    },
    locationForDisplay: {
      type: DataTypes.GEOMETRY('POINT')
    },
    // The date when the bridge will be open
    startTime: {
      type: DataTypes.DATE
    },
    endTime: {
      type: DataTypes.DATE
    },
  });

  BridgeEvent.associate = models => {
    BridgeEvent.hasOne(models.BridgeEventCheck);
  };


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

    /* Try to find the bridge associate to the bridge event. If the bridge doesn't
     * exist, we create a new one.
     */
    let bridge = await models.Bridge.findOne({
      where: {
        location: [location.longitude, location.latitude]
      }
    });
    if (!bridge) {
      bridge = await models.Bridge.createBridge(location.longitude, location.latitude, models);
    }

    let bridgeEventEntry = {
      id: situationRecord['$'].id,
      version: situationRecord['$'].version,
      creationTime: situationRecord.situationRecordCreationTime,
      startTime: situationRecord.validity.validityTimeSpecification.overallStartTime,
      endTime: situationRecord.validity.validityTimeSpecification.overallEndTime,
      locationForDisplay: GeoJson.parse(location, {
        Point: ['longitude', 'latitude']
      }).geometry,
      bridgeId: bridge.id
    };
    if (!bridgeEvent) {
      // console.log(`Creating bridge_event ${situationRecord['$'].id}`);
      bridgeEvent = await BridgeEvent.create(bridgeEventEntry);
    } else {
      // console.log(`Updating bridge_event ${situationRecord['$'].id}`);
      bridgeEvent = await bridgeEvent.update(bridgeEventEntry);
    }
    models.BridgeEventCheck.createCheckAllFields(bridgeEvent);
  };

  return BridgeEvent;
};

module.exports = bridgeEvent;

