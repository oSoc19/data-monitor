const models = require('./index');
const bridgeSituationRecord = (sequelize, DataTypes) => {
  const BridgeSituationRecord = sequelize.define('bridgeSituationRecord', {
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
 
	BridgeSituationRecord.associate = models => {
		BridgeSituationRecord.belongsTo(models.Bridge, { as: bridgeSituation });
  };

  return BridgeSituationRecord;
};

module.exports = bridgeSituationRecord;
