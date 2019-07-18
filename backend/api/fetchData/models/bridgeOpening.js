const GeoJson = require('geojson');
const get = require('../getNested.js');
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
      type: DataTypes.INTEGER
    },
    source: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT)
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
    probabilityOfOccurence: {
      type: DataTypes.STRING
    },
    generalNetworkManagementType: {
      type: DataTypes.STRING
    }
  });

  BridgeOpening.associate = models => {
    BridgeOpening.hasOne(models.BridgeOpeningCheck);
  };


  /* Create a bridge event corresponding to a situation record
   * and associate this event to a bridge.
   */
  BridgeOpening.addBridgeOpening = async (situation, models) => {
    let location = get(['situationRecord', 'groupOfLocations', 'locationForDisplay'], situation);
    let situationRecord = get(['situationRecord'], situation)
    let bridgeOpening = await models.BridgeOpening.findOne({
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

    let bridgeOpeningEntry = {
      id: situationRecord['$'].id,
        version: situationRecord['$'].version,
        source: get(['source', 'sourceName', 'values', 'value', '_'], situationRecord),
        location: [location.longitude, location.latitude],
        creationTime: get(['situationRecordCreationTime'], situationRecord),
        startTime: get(['validity', 'validityTimeSpecification', 'overallStartTime'], situationRecord),
        endTime: get(['validity', 'validityTimeSpecification', 'overallEndTime'], situationRecord),
        probabilityOfOccurence: get(['probabilityOfOccurrence'], situationRecord),
        locationForDisplay: GeoJson.parse(location, {
          Point: ['longitude', 'latitude']
        }).geometry,
        generalNetworkManagementType: get(['generalNetworkManagementType'], situationRecord),
        bridgeId: bridge.id
    };
    if (!bridgeOpening) {
      // console.log(`Creating bridge_opening ${situationRecord['$'].id}`);
      bridgeOpening = await BridgeOpening.create(bridgeOpeningEntry);
    } else {
      // console.log(`Updating bridge_opening ${situationRecord['$'].id}`);
      bridgeOpening = await bridgeOpening.update(bridgeOpeningEntry);
    }
    models.BridgeOpeningCheck.createCheck(bridgeOpening);
  };

  return BridgeOpening;
};

module.exports = bridgeOpening;

