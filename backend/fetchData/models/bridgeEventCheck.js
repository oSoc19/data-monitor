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


  return BridgeEventCheck;
}

module.exports = bridgeEventCheck;

