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
    if (bridgeOpening.dataValues.version !== undefined)
      return 1;
    else
      return 0;
  }
  
  BridgeOpeningCheck.probabilityOfOccurence = bridgeOpening => {
    let value = bridgeOpening.dataValues.probabilityOfOccurence;
    if (value === 'certain' || value === 'probable' || value === 'riskOf') {
      return 1
    }
    else return 0
  }

  BridgeOpeningCheck.source = bridgeOpening => {
    if (bridgeOpening.dataValues.source !== undefined) {
      return 1
    }
    else return 0
  }

  BridgeOpeningCheck.locationForDisplay = bridgeOpening => {
    if (bridgeOpening.dataValues.locationForDisplay !== undefined)
      return 1;
    else
      return 0;
  }

  BridgeOpeningCheck.location = bridgeOpening => {
    if (bridgeOpening.dataValues.location !== undefined)
      return 1;
    else
      return 0;
  }

  BridgeOpeningCheck.generalNetworkManagementType = bridgeOpening => {
    if (bridgeOpening.dataValues.generalNetworkManagementType !== undefined)
      return 1;
    else
      return 0;
  }

  BridgeOpeningCheck.checksum = bridgeOpening => {
    let c = 0;
    c+=BridgeOpeningCheck.version(bridgeOpening);
    c+=BridgeOpeningCheck.probabilityOfOccurence(bridgeOpening);
    c+=BridgeOpeningCheck.source(bridgeOpening);
    c+=BridgeOpeningCheck.locationForDisplay(bridgeOpening);
    c+=BridgeOpeningCheck.location(bridgeOpening);
    c+=BridgeOpeningCheck.generalNetworkManagementType(bridgeOpening);
    return c/6
  }

  BridgeOpeningCheck.createCheckAllFields = async (event) => {
    // let allFields = BridgeOpeningCheck.checkAllFields(event);
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
        checksum: BridgeOpeningCheck.checksum(event)
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
        checksum: BridgeOpeningCheck.checksum(event)
      })
      return checkFields;
    }

  }
  return BridgeOpeningCheck;
}

module.exports = bridgeOpeningCheck;
