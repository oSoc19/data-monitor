const bridge = (sequelize, DataTypes) => {
  const Bridge = sequelize.define('bridge', {
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT)
    },
  });

  Bridge.associate = models => {
		Bridge.hasMany(models.BridgeEvent);
  }

  return Bridge;
};

module.exports = bridge;
