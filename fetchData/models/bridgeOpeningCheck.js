const get = require('../getNested');
const bridgeOpeningCheck = (sequelize, DataTypes) => {
  /**
   * BridgeOpeningCheck Model which contains all the check for the quality assessment
   * This model is used to display the dashboard on the website
   */
  const BridgeOpeningCheck = sequelize.define('bridge_opening_check', {
    version: {
      type: DataTypes.FLOAT
    },
    probabilityOfOccurence: {
      type: DataTypes.FLOAT
    },
    source: {
      type: DataTypes.FLOAT
    },
    locationForDisplay: {
      type: DataTypes.FLOAT
    },
    location: {
      type: DataTypes.FLOAT
    },
    generalNetworkManagementType: {
      type: DataTypes.FLOAT
    },
    checksum: {
      type: DataTypes.FLOAT
    },
    allFields: {
      type: DataTypes.FLOAT
    },
    manualIntervention: {
      type: DataTypes.BOOLEAN
    },
    comment: {
      type: DataTypes.STRING
    }
  });

  /**
   * Associate the bridge opening check model with the bridge opening model.
   */
  BridgeOpeningCheck.associate = models => {
    BridgeOpeningCheck.belongsTo(models.BridgeOpening);
    BridgeOpeningCheck.eventId = 'bridgeOpeningId';
  }

  /**
   * Check if the "version" field is defined.
   */
  BridgeOpeningCheck.version = bridgeOpening => {
    if (get(['dataValues', 'version'], bridgeOpening) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if the "probabilityOfOccurence" field is defined and has a correct value.
   */
  BridgeOpeningCheck.probabilityOfOccurence = bridgeOpening => {
    let value = get(['dataValues', 'probabilityOfOccurence'], bridgeOpening);
    if (value === 'certain' || value === 'probable' || value === 'riskOf') {
      return 1
    }
    else return 0
  }

  /**
   * Check if the "source" field is defined.
   */
  BridgeOpeningCheck.source = bridgeOpening => {
    if (get(['dataValues', 'source'], bridgeOpening) !== undefined) {
      return 1
    }
    else return 0
  }

  /**
   * Check if the "locationForDisplay" field is defined.
   */
  BridgeOpeningCheck.locationForDisplay = bridgeOpening => {
    if (get(['dataValues', 'locationForDisplay'], bridgeOpening) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if the "location" field is defined.
   */
  BridgeOpeningCheck.location = bridgeOpening => {
    if (get(['dataValues', 'location'], bridgeOpening) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if the "generalNetworkManagementType" field is defined.
   */
  BridgeOpeningCheck.generalNetworkManagementType = bridgeOpening => {
    if (get(['dataValues', 'generalNetworkManagementType'], bridgeOpening) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if each column of the table made for the object is defined and return the proportion a float between 0 and 1 that is the ratio (number of field)/(number of defined field)
   */
  BridgeOpeningCheck.allFields = bridgeOpening => {
    let bridgeOpeningKeys = Object.values(bridgeOpening.dataValues)
    let c = 0;
    for (let value of bridgeOpeningKeys) {
      if (value !== undefined & value !== null & value !== '') {
        c++;
      }
    }
    return ((c - 2) / (bridgeOpeningKeys.length - 2));
  }

  /**
   * Provide an average value for all the tests
   */
  BridgeOpeningCheck.checksum = bridgeOpening => {
    let c = 0;
    c += BridgeOpeningCheck.version(bridgeOpening);
    c += BridgeOpeningCheck.probabilityOfOccurence(bridgeOpening);
    c += BridgeOpeningCheck.source(bridgeOpening);
    c += BridgeOpeningCheck.locationForDisplay(bridgeOpening);
    c += BridgeOpeningCheck.location(bridgeOpening);
    c += BridgeOpeningCheck.generalNetworkManagementType(bridgeOpening);
    c += BridgeOpeningCheck.allFields(bridgeOpening);
    return c / 7
  }

  /**
   * Create a check for the bridge opening event.
   * @param  {Object} event
   */
  BridgeOpeningCheck.createCheck = async (event) => {
    let bridgeOpeningCheck = await BridgeOpeningCheck.findOne({
      where: {
        bridgeOpeningId: event.id
      }
    });
    if (!bridgeOpeningCheck) {
      let checkFields = await BridgeOpeningCheck.create({
        version: BridgeOpeningCheck.version(event),
        probabilityOfOccurence: BridgeOpeningCheck.probabilityOfOccurence(event),
        source: BridgeOpeningCheck.source(event),
        locationForDisplay: BridgeOpeningCheck.locationForDisplay(event),
        location: BridgeOpeningCheck.location(event),
        generalNetworkManagementType: BridgeOpeningCheck.generalNetworkManagementType(event),
        checksum: BridgeOpeningCheck.checksum(event),
        allFields: BridgeOpeningCheck.allFields(event),
        bridgeOpeningId: event.id
      })
      return checkFields;

    } else {
      let checkFields = await bridgeOpeningCheck.update({
        version: BridgeOpeningCheck.version(event),
        probabilityOfOccurence: BridgeOpeningCheck.probabilityOfOccurence(event),
        source: BridgeOpeningCheck.source(event),
        locationForDisplay: BridgeOpeningCheck.locationForDisplay(event),
        location: BridgeOpeningCheck.location(event),
        generalNetworkManagementType: BridgeOpeningCheck.generalNetworkManagementType(event),
        checksum: BridgeOpeningCheck.checksum(event),
        allFields: BridgeOpeningCheck.allFields(event),
        bridgeOpeningId: event.id
      })
      return checkFields;
    }

  }
  return BridgeOpeningCheck;
}

module.exports = bridgeOpeningCheck;
