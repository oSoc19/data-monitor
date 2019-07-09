const bridge = (sequelize, DataTypes) => {
  const Bridge = sequelize.define('bridge', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    longitude: {
      type: DataTypes.FLOAT
    },
    latitude: {
      type: DataTypes.FLOAT
    }
  });

  // bridge.associate = models => {
  //   User.hasMany(models.BridgeRecord);
  // };

  return Bridge;
};

module.exports = bridge;
