const bridgeSituationRecord = (sequelize, DataTypes) => {
  const BridgeSituationRecord = sequelize.define('bridge_situation_record', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
		creationTime: {
			type: DataTypes.DATE
		},
		startTime: {
			type: DataTypes.DATE
		},
		endTime: {
			type: DataTypes.DATE
		}
  });
 
  bridgeSituationRecord.associate = models => {
    BridgeSituationRecord.belongsTo(models.bridge);
  };

  return BridgeSituationRecord;
};

module.exports = bridgeSituationRecord;
