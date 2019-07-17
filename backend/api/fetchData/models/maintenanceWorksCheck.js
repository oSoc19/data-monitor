

const maintenanceWorksCheck = (sequelize, DataTypes) => {
  const MaintenanceWorksCheck = sequelize.define('maintenance_works_check', {
    checksum: {
      type: DataTypes.FLOAT
    }
  })
  MaintenanceWorksCheck.associate = models => {
    MaintenanceWorksCheck.belongsTo(models.MaintenanceWorks)
  }

  MaintenanceWorksCheck.createCheck = async (event) => {
    let maintenanceWorksCheck = await MaintenanceWorksCheck.findOne({
      where: {
        maintenanceWorkId: event.id
      }
    });

    if (!maintenanceWorksCheck) {
      let checkFields = await MaintenanceWorksCheck.create({
        maintenanceWorkId: event.id,
        checksum: 1
      })
      return checkFields
    }
    else{
      let checkFields = await MaintenanceWorksCheck.update({
        maintenanceWorkId: event.id,
        checksum: 1
      })
      return checkFields
    }
  }
  return MaintenanceWorksCheck
}

module.exports = maintenanceWorksCheck;