'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Club, {
        as: 'event',
        foreignKey: 'club_id',
      })
    }
  };
  Event.init({
    eventtitle: DataTypes.STRING,
    eventdescription: DataTypes.DATE,
    eventdate: DataTypes.STRING,
    eventstart: DataTypes.TIME,
    eventend: DataTypes.TIME


  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'event',
    timestamps: false
  });
  return Event;
};
