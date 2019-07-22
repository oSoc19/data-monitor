const get = require('../getNested.js');
const maintenanceWorksCheck = (sequelize, DataTypes) => {
  /**
   * MaintenanceWorksCheck Model which contains all the check for the quality assessment
   * This model is used to display the dashboard on the website
   */
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

  /**
   * Associate the maintenance works check model with the maintenance works model.
   */
  MaintenanceWorksCheck.associate = models => {
    MaintenanceWorksCheck.belongsTo(models.MaintenanceWorks);
    MaintenanceWorksCheck.eventId = 'maintenanceWorkId';
  }

  /**
   * Check if the "version" field is defined.
   */
  MaintenanceWorksCheck.version = maintenanceWorks => {
    if (get(['dataValues', 'version'], maintenanceWorks) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if the "probabilityOfOccurence" field is defined and has a correct value.
   */
  MaintenanceWorksCheck.probabilityOfOccurence = maintenanceWorks => {
    let value = get(['dataValues', 'probabilityOfOccurrence'], maintenanceWorks);
    if (value === 'certain' || value === 'probable' || value === 'riskOf') {
      return 1
    }
    else return 0
  }

  /**
   * Check if the "source" field is defined.
   */
  MaintenanceWorksCheck.source = maintenanceWorks => {
    if (get(['dataValues', 'source'], maintenanceWorks) !== undefined) {
      return 1
    }
    else return 0
  }

  /**
   * Check if the "locationForDisplay" field is defined.
   */
  MaintenanceWorksCheck.locationForDisplay = maintenanceWorks => {
    if (get(['dataValues', 'locationForDisplay'], maintenanceWorks) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if the "location" field is defined.
   */
  MaintenanceWorksCheck.location = maintenanceWorks => {
    if (get(['dataValues', 'location'], maintenanceWorks) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if each column of the table made for the object is defined and return the proportion a float between 0 and 1 that is the ratio (number of field)/(number of defined field)
   */
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

  /**
   * Provide an average value for all the tests
   */
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

  /**
   * Create a check for the maintenance works event.
   * @param  {Object} event
   */
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
