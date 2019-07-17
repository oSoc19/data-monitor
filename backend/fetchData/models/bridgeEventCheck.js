/*
 * BridgeEventCheck Model which contains all the check for the quality assessment
 * This model is used to display the dashboard on the website
 */
const bridgeEventCheck = (sequelize, DataTypes) => {
  const BridgeEventCheck = sequelize.define('bridge_event_check', {
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

  BridgeEventCheck.associate = models => {
    BridgeEventCheck.belongsTo(models.BridgeEvent)
  }

  BridgeEventCheck.version = bridgeEvent => {
    if (bridgeEvent.dataValues.version !== undefined)
      return 1;
    else
      return 0;
  }
  
  BridgeEventCheck.probabilityOfOccurence = bridgeEvent => {
    let value = bridgeEvent.dataValues.probabilityOfOccurence;
    if (value === 'certain' || value === 'probable' || value === 'riskOf') {
      return 1
    }
    else return 0
  }

  BridgeEventCheck.source = bridgeEvent => {
    if (bridgeEvent.dataValues.source !== undefined) {
      return 1
    }
    else return 0
  }

  BridgeEventCheck.locationForDisplay = bridgeEvent => {
    if (bridgeEvent.dataValues.locationForDisplay !== undefined)
      return 1;
    else
      return 0;
  }

  BridgeEventCheck.location = bridgeEvent => {
    if (bridgeEvent.dataValues.location !== undefined)
      return 1;
    else
      return 0;
  }

  BridgeEventCheck.generalNetworkManagementType = bridgeEvent => {
    if (bridgeEvent.dataValues.generalNetworkManagementType !== undefined)
      return 1;
    else
      return 0;
  }

  BridgeEventCheck.checksum = bridgeEvent => {
    let c = 0;
    c+=BridgeEventCheck.version(bridgeEvent);
    c+=BridgeEventCheck.probabilityOfOccurence(bridgeEvent);
    c+=BridgeEventCheck.source(bridgeEvent);
    c+=BridgeEventCheck.locationForDisplay(bridgeEvent);
    c+=BridgeEventCheck.location(bridgeEvent);
    c+=BridgeEventCheck.generalNetworkManagementType(bridgeEvent);
    return c/6
  }

  BridgeEventCheck.createCheckAllFields = async (event) => {
    // let allFields = BridgeEventCheck.checkAllFields(event);
    let bridgeEventCheck = await BridgeEventCheck.findOne({
      where: {
        bridgeEventId: event.id
      }
    });
    if (!bridgeEventCheck) {
      let checkFields = await BridgeEventCheck.create({
        version: BridgeEventCheck.version(event),
        probabilityOfOccurence: BridgeEventCheck.probabilityOfOccurence(event),
        source: BridgeEventCheck.source(event),
        locationForDisplay: BridgeEventCheck.locationForDisplay(event),
        location: BridgeEventCheck.location(event),
        generalNetworkManagementType: BridgeEventCheck.generalNetworkManagementType(event),
        checksum: BridgeEventCheck.checksum(event)
      })
      return checkFields;

    } else {
      let checkFields = await bridgeEventCheck.update({
        version: BridgeEventCheck.version(event),
        probabilityOfOccurence: BridgeEventCheck.probabilityOfOccurence(event),
        source: BridgeEventCheck.source(event),
        locationForDisplay: BridgeEventCheck.locationForDisplay(event),
        location: BridgeEventCheck.location(event),
        generalNetworkManagementType: BridgeEventCheck.generalNetworkManagementType(event),
        checksum: BridgeEventCheck.checksum(event)
      })
      return checkFields;
    }

  }
  return BridgeEventCheck;
}

module.exports = bridgeEventCheck;
