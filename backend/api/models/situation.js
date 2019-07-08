const situation = (sequelize, DataTypes) => {
  const Situation = sequelize.define('situation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    version: {
      type: DataTypes.INTEGER
    },
    overallSeverity: {
      type: DataTypes.STRING
    },
    situationVersionTime: {
      type: DataTypes.DATE
    }
  });

  // situation.associate = models => {
  //   User.hasMany(models.SituationRecord);
  // };

  return Situation;
};

module.exports = situation;
