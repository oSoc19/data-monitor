const get = require('../getNested.js');

const accidentCheck = (sequelize, DataTypes) => {
  /**
   * AccidentCheck Model which contains all the check for the quality assessment
   * This model is used to display the dashboard on the website
   */
  const AccidentCheck = sequelize.define('accident_checks', {
    version: {
      type: DataTypes.FLOAT
    },
    probabilityOfOccurrence: {
      type: DataTypes.FLOAT
    },
    locationForDisplay: {
      type: DataTypes.FLOAT
    },
    location: {
      type: DataTypes.FLOAT
    },
    accidentType: {
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
   * Associate the accident check model with the accident model.
   */
  AccidentCheck.associate = models => {
    AccidentCheck.belongsTo(models.Accident);
    AccidentCheck.eventId = 'accidentId';
  }

  /**
   * Check if the "version" field is defined.
   */
  AccidentCheck.version = accident => {
    if (get(['dataValues', 'version'], accident) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if the "probabilityOfOccurence" field is defined and has a correct value.
   */
  AccidentCheck.probabilityOfOccurence = accident => {
    let value = get(['dataValues', 'probabilityOfOccurrence'], accident);
    if (value === 'certain' || value === 'probable' || value === 'riskOf') {
      return 1
    }
    else return 0
  }

  /**
   * Check if the "locationForDisplay" field is defined.
   */
  AccidentCheck.locationForDisplay = accident => {
    if (get(['dataValues', 'locationForDisplay'], accident) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if the "location" field is defined.
   */
  AccidentCheck.location = accident => {
    if (get(['dataValues', 'location'], accident) !== undefined)
      return 1;
    else
      return 0;
  }

  /**
   * Check if the "accidentType" field is defined and has a correct value.
   */
  AccidentCheck.accidentType = accident => {
    let possibleTypes = ['accident',
      'accidentInvolvingBicycles',
      'accidentInvolvingBuses',
      'accidentInvolvingHazardousMaterials',
      'accidentInvolvingHeavyLorries',
      'accidentInvolvingMassTransitVehicle',
      'accidentInvolvingMopeds',
      'accidentInvolvingMotorcycles',
      'accidentInvolvingRadioactiveMaterial',
      'accidentInvolvingTrain',
      'chemicalSpillageAccident',
      'collision',
      'collisionWithAnimal',
      'collisionWithObstruction',
      'collisionWithPerson',
      'earlierAccident',
      'fuelSpillageAccident',
      'jackknifedArticulatedLorry',
      'jackknifedCaravan',
      'jackknifedTrailer',
      'multipleVehicleCollision',
      'multivehicleAccident',
      'oilSpillageAccident',
      'overturnedHeavyLorry',
      'overturnedTrailer',
      'overturnedVehicle',
      'seriousAccident',
      'vehicleOffRoad',
      'vehicleSpunAround',
      'other']
    if (possibleTypes.includes(get(['accidentType'], accident)))
      return 1;
    else
      return 0;
  }

  /**
   * Check if each column of the table made for the object is defined and return the proportion a float between 0 and 1 that is the ratio (number of field)/(number of defined field)
   */
  AccidentCheck.allFields = accident => {
    let accidentValues = Object.values(accident.dataValues)
    let c = 0;
    for (let value of accidentValues) {
      if (value !== undefined & value !== null & value !== '') {
        c++;
      }
    }
    return ((c - 2) / (accidentValues.length - 2))
  }

  /**
   * Provide an average value for all the tests
   */
  AccidentCheck.checksum = accident => {
    let c = 0;
    c += AccidentCheck.version(accident);
    c += AccidentCheck.probabilityOfOccurence(accident);
    c += AccidentCheck.locationForDisplay(accident);
    c += AccidentCheck.location(accident);
    c += AccidentCheck.accidentType(accident);
    c += AccidentCheck.allFields(accident);
    return c / 6
  }

  /**
   * Create a check for the accident event.
   * @param  {Object} event
   */
  AccidentCheck.createCheck = async (event) => {
    let accidentCheck = await AccidentCheck.findOne({
      where: {
        accidentId: event.id
      }
    });
    let accidentCheckEntry = {
      version: AccidentCheck.version(event),
        probabilityOfOccurrence: AccidentCheck.probabilityOfOccurence(event),
        locationForDisplay: AccidentCheck.locationForDisplay(event),
        location: AccidentCheck.location(event),
        accidentType: AccidentCheck.accidentType(event),
        checksum: AccidentCheck.checksum(event),
        allFields: AccidentCheck.allFields(event),
        accidentId: event.id
    }
    if (!accidentCheck)
      accidentCheck = await AccidentCheck.create(accidentCheckEntry)
    else
      accidentCheck = await accidentCheck.update(accidentCheckEntry)
  }
  return AccidentCheck
}

module.exports = accidentCheck
