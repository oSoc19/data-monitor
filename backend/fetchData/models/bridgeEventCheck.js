const bridgeEventCheck = (sequelize, DataTypes) => {
    const BridgeEventCheck = sequelize.define('bridge_event_check', {
        allFields: {
            type: DataTypes.FLOAT
        },
        correctID: {
            type: DataTypes.FLOAT
        },
        checksum: {
            type: DataTypes.FLOAT
        },
        manualIntervention: {
            type: DataTypes.BOOLEAN
        }
    })

    BridgeEventCheck.associate = models => {
        BridgeEventCheck.belongsTo(models.BridgeEvent)
    }


    return BridgeEventCheck
}

module.exports = bridgeEventCheck