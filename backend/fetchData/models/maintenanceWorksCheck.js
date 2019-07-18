const get = require('../getNested.js');
const maintenanceWorksCheck = (sequelize, DataTypes) => {
  const MaintenanceWorksCheck = sequelize.define('maintenance_works_check', {
    version: {
      type: DataTypes.FLOAT
    },
    probabilityOfOccurrence: {
      type: DataTypes.FLOAT
    },
    source: {
      type: DataTypes.FLOAT
    },
    locationForDisplay: {
      type: DataTypes.FLOAT
    },
    location: {
      type: DataTypes.FLOAT
    },
    checksum: {
      type: DataTypes.FLOAT
    },
    allFields: {
      type: DataTypes.FLOAT
    },
    manualIntervention: {
      type: DataTypes.BOOLEAN
    },
    comment: {
      type: DataTypes.STRING
    }
  })
  MaintenanceWorksCheck.associate = models => {
    MaintenanceWorksCheck.belongsTo(models.MaintenanceWorks)
  }

  MaintenanceWorksCheck.version = maintenanceWorks => {
    if (get(['dataValues', 'version'], maintenanceWorks) !== undefined)
      return 1;
    else
      return 0;
  }

  MaintenanceWorksCheck.probabilityOfOccurence = maintenanceWorks => {
    let value = get(['dataValues', 'probabilityOfOccurrence'], maintenanceWorks);
    if (value === 'certain' || value === 'probable' || value === 'riskOf') {
      return 1
    }
    else return 0
  }

  MaintenanceWorksCheck.source = maintenanceWorks => {
    if (get(['dataValues', 'source'], maintenanceWorks) !== undefined) {
      return 1
    }
    else return 0
  }

  MaintenanceWorksCheck.locationForDisplay = maintenanceWorks => {
    if (get(['dataValues', 'locationForDisplay'], maintenanceWorks) !== undefined)
      return 1;
    else
      return 0;
  }

  MaintenanceWorksCheck.location = maintenanceWorks => {
    if (get(['dataValues', 'location'], maintenanceWorks) !== undefined)
      return 1;
    else
      return 0;
  }

  MaintenanceWorksCheck.allFields = maintenanceWorks => {
    let maintenanceWorksKeys = Object.values(maintenanceWorks.dataValues)
    let c = 0;
    for (let value of maintenanceWorksKeys) {
      if (value !== undefined & value !== null & value !== '') {
        c++;
      }
    }
    return ((c - 2) / (maintenanceWorksKeys.length - 2));
  }

  MaintenanceWorksCheck.checksum = maintenanceWorks => {
    let c = 0;
    c += MaintenanceWorksCheck.version(maintenanceWorks);
    c += MaintenanceWorksCheck.probabilityOfOccurence(maintenanceWorks);
    c += MaintenanceWorksCheck.source(maintenanceWorks);
    c += MaintenanceWorksCheck.locationForDisplay(maintenanceWorks);
    c += MaintenanceWorksCheck.location(maintenanceWorks);
    c += MaintenanceWorksCheck.allFields(maintenanceWorks);
    return c / 6
  }

  MaintenanceWorksCheck.createCheck = async (event) => {
    let maintenanceWorksCheck = await MaintenanceWorksCheck.findOne({
      where: {
        maintenanceWorkId: event.id
      }
    });

    if (!maintenanceWorksCheck) {
      let checkFields = await MaintenanceWorksCheck.create({
        version: MaintenanceWorksCheck.version(event),
        probabilityOfOccurrence: MaintenanceWorksCheck.probabilityOfOccurence(event),
        source: MaintenanceWorksCheck.source(event),
        locationForDisplay: MaintenanceWorksCheck.locationForDisplay(event),
        location: MaintenanceWorksCheck.location(event),
        checksum: MaintenanceWorksCheck.checksum(event),
        allFields: MaintenanceWorksCheck.allFields(event),
        maintenanceWorkId: event.id
      })
      return checkFields
    }
    else {
      let checkFields = await maintenanceWorksCheck.update({
        version: MaintenanceWorksCheck.version(event),
        probabilityOfOccurrence: MaintenanceWorksCheck.probabilityOfOccurence(event),
        source: MaintenanceWorksCheck.source(event),
        locationForDisplay: MaintenanceWorksCheck.locationForDisplay(event),
        location: MaintenanceWorksCheck.location(event),
        checksum: MaintenanceWorksCheck.checksum(event),
        allFields: MaintenanceWorksCheck.allFields(event),
        maintenanceWorkId: event.id,
      })
      return checkFields
    }
  }
  return MaintenanceWorksCheck
}

module.exports = maintenanceWorksCheck;
