const get = require('../getNested');
/*
 * BridgeOpeningCheck Model which contains all the check for the quality assessment
 * This model is used to display the dashboard on the website
 */
const bridgeOpeningCheck = (sequelize, DataTypes) => {
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
    // Checksum of all the others checks
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

  BridgeOpeningCheck.associate = models => {
    BridgeOpeningCheck.belongsTo(models.BridgeOpening)
  }

  BridgeOpeningCheck.version = bridgeOpening => {
    if (get(['dataValues', 'version'], bridgeOpening) !== undefined)
      return 1;
    else
      return 0;
  }

  BridgeOpeningCheck.probabilityOfOccurence = bridgeOpening => {
    let value = get(['dataValues', 'probabilityOfOccurence'], bridgeOpening);
    if (value === 'certain' || value === 'probable' || value === 'riskOf') {
      return 1
    }
    else return 0
  }

  BridgeOpeningCheck.source = bridgeOpening => {
    if (get(['dataValues', 'source'], bridgeOpening) !== undefined) {
      return 1
    }
    else return 0
  }

  BridgeOpeningCheck.locationForDisplay = bridgeOpening => {
    if (get(['dataValues', 'locationForDisplay'], bridgeOpening) !== undefined)
      return 1;
    else
      return 0;
  }

  BridgeOpeningCheck.location = bridgeOpening => {
    if (get(['dataValues', 'location'], bridgeOpening) !== undefined)
      return 1;
    else
      return 0;
  }

  BridgeOpeningCheck.generalNetworkManagementType = bridgeOpening => {
    if (get(['dataValues', 'generalNetworkManagementType'], bridgeOpening) !== undefined)
      return 1;
    else
      return 0;
  }

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
