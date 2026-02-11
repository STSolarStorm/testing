'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Officer extends Model {
        static associate(models) {
            // An officer belongs to a club
            Officer.belongsTo(models.Club, {
                foreignKey: 'clubin',
                targetKey: 'clubname'
            });
        }
    }

    Officer.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        officertitle: DataTypes.STRING,
        officerfirstname: DataTypes.STRING,
        officerlastname: DataTypes.STRING,
        clubin: DataTypes.STRING,
        officerstudentid: DataTypes.STRING,
        officergradelevel: DataTypes.STRING,
        officerusername: DataTypes.STRING,
        officerpassword: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Officer',
        tableName: 'officer',
        timestamps: false
    });

    return Officer;
};