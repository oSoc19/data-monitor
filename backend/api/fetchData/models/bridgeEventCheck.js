/*
 * BridgeEventCheck Model which contains all the check for the quality assessment
 * This model is used to display the dashboard on the website
 */
const bridgeEventCheck = (sequelize, DataTypes) => {
  const BridgeEventCheck = sequelize.define('bridge_event_check', {
    allFields: {
      type: DataTypes.FLOAT
    },
    correctID: {
      type: DataTypes.FLOAT
    },
    // Checksum of all the others checks
    checksum: {
      type: DataTypes.FLOAT
    },
    manualIntervention: {
      type: DataTypes.BOOLEAN
    }
  });

  BridgeEventCheck.associate = models => {
    BridgeEventCheck.belongsTo(models.BridgeEvent)
  }


  BridgeEventCheck.checkAllFields = bridgeEvent => {
    let bridgeEventKeys = Object.values(bridgeEvent.dataValues)
    let count = 0;
    for (let value of bridgeEventKeys) {
      if (value !== undefined & value !== null & value !== '') {
        count++;
      }
    }
    return ((count - 2) / (bridgeEventKeys.length - 2));
  }

  BridgeEventCheck.createCheckAllFields = async (event) => {
    let allFields = BridgeEventCheck.checkAllFields(event);
    let bridgeEventCheck = await BridgeEventCheck.findOne({
      where: {
        bridgeEventId: event.id
      }
    });
    if (!bridgeEventCheck) {
      let checkFields = await BridgeEventCheck.create({
        allFields: allFields,
        correctID: 1,
        checksum: (allFields + 1) / 2,
        bridgeEventId: event.id
      })
			return checkFields;

    } else {
      let checkFields = await bridgeEventCheck.update({
        allFields: allFields,
        correctID: 1,
        checksum: (allFields + 1) / 2,
        bridgeEventId: event.id
      })
			return checkFields;
    }

  }
  return BridgeEventCheck;
}

module.exports = bridgeEventCheck;
