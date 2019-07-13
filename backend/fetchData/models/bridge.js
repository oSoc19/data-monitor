/*
 * Bridge Model that store a unique bridge with its location.
 * A unique id column is generate automatically by Sequelize
 * A bridge can have multiple BridgeEvent. See BridgeEvent model
 * for more information. 
 */
const bridge = (sequelize, DataTypes) => {
  const Bridge = sequelize.define('bridge', {
    location: {
      type: DataTypes.ARRAY(DataTypes.FLOAT)
    },
  });

  Bridge.associate = models => {
    Bridge.hasMany(models.BridgeEvent);
  }


  Bridge.createBridge = async (longitude, latitude) => {
    let bridge = await Bridge.create({
      location: [longitude, latitude]
    });
    return bridge;
  }

  return Bridge;
};

module.exports = bridge;

