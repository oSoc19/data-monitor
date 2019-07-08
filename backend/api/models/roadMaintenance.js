const roadMaintenance = (sequelize, DataTypes) => {
  const RoadMaintenance = sequelize.define('roadMaintenance', {
    id: {
      type: DataTypes.STRING,
      unique: true
    }
    type: {
      type: DataTypes.STRING
    },
    
    source: {
      type: DataTypes.STRING
    },

    startTime: {
      type: DataTypes.DATE
    },

    endTime: {
      type: DataTypes.DATE
    }, 

    speedManagementType: {
      type: DataTypes.STRING
    }, 

    temporarySpeedLimit: {
      type: DataTypes.FLOAT
    }, 

    mobility: {
      type: DataTypes.STRING
    }, 

    roadMaintenanceType: {
      type: DataTypes.STRING
    } 

  });

  return RoadMaintenance;
};

module.exports = roadMaintenance;
