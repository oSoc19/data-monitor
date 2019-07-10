const bridgeEvent = (sequelize, DataTypes) => {
  const BridgeEvent = sequelize.define('bridge_event', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
		version: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		location: {
			type: DataTypes.ARRAY(DataTypes.FLOAT)
		},
    creationTime: {
      type: DataTypes.DATE
    },
    startTime: {
      type: DataTypes.DATE
    },
    endTime: {
      type: DataTypes.DATE
		},
		geoJsonLocation: {
			type: DataTypes.GEOMETRY('POINT')
		}
  });

  return BridgeEvent;
};

module.exports = bridgeEvent;
