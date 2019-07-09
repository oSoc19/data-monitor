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

  bridge.associate = models => {
    Bridge.hasMany(models.bridgeSituationRecord);
  };

  return Bridge;
};


module.exports = bridge;
