const GeoJson = require('geojson');
const get = require('../getNested.js');

/**
 * A BridgeOpening indicates when a bridge will be open
 * (Note: a bridge is considered open if a boat can pass below it).
 * Model based on objects from the opendata provided by the NDW.
 * Data found at http://opendata.ndw.nu/brugopeningen.xml.gz
 * Documentation found at http://docs.ndwcloud.nu/
 */
const bridgeOpening = (sequelize, DataTypes) => {
  /**
   * The model of the bridge opening with all its components.
   */
  const BridgeOpening = sequelize.define('bridge_opening', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
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
    situationRecordVersionTime: {
      type: DataTypes.DATE
    },
    locationForDisplay: {
      type: DataTypes.GEOMETRY('POINT')
    },
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

  /**
   * Associate the bridge opening model with the bridge opening check model.
   */
  BridgeOpening.associate = models => {
    BridgeOpening.hasOne(models.BridgeOpeningCheck);
    BridgeOpening.checkTable = models.BridgeOpeningCheck;

  };

  /** Create a bridge opening event corresponding to a situation record
   * and associate this event to a bridge.
   * @param  {Object} situationRecord
   * @param  {Object} models
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
     * exist, a new one is created.
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
      situationRecordVersionTime: get(['situationRecordVersionTime'], situationRecord),
      startTime: get(['validity', 'validityTimeSpecification', 'overallStartTime'], situationRecord),
      endTime: get(['validity', 'validityTimeSpecification', 'overallEndTime'], situationRecord),
      probabilityOfOccurence: get(['probabilityOfOccurrence'], situationRecord),
      locationForDisplay: GeoJson.parse(location, {
        Point: ['latitude', 'longitude']
      }).geometry,
      generalNetworkManagementType: get(['generalNetworkManagementType'], situationRecord),
      bridgeId: bridge.id
    };
    if (!bridgeOpening) {
      bridgeOpening = await BridgeOpening.create(bridgeOpeningEntry);
    } else {
      bridgeOpening = await bridgeOpening.update(bridgeOpeningEntry);
    }
    models.BridgeOpeningCheck.createCheck(bridgeOpening);
  };

  return BridgeOpening;
};

module.exports = bridgeOpening;

