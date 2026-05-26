'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TeacherClaim extends Model {
        static associate(models) {
            // Only define association if model exists
        }
    }

    TeacherClaim.init({
        teacher_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        club_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        }
    }, {
        sequelize,
        modelName: 'TeacherClaim',
        tableName: 'teacherclaim',
        timestamps: false
    });

    return TeacherClaim;
};