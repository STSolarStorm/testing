'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClubEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClubEvent.belongsTo(models.Club, {
        as: 'clubevent',
        foreignKey: 'club_id',
      })
    }
  }
  ClubEvent.init({
    eventtitle: DataTypes.STRING,
    eventdescription: DataTypes.STRING,
    eventdate: DataTypes.DATE,
    eventstart: DataTypes.TIME,
    eventend: DataTypes.TIME,
    club_id: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'ClubEvent',
    tableName: 'clubevent',
    timestamps: false
  });
  return ClubEvent;
};
