'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // Only define association if model exists
            User.belongsToMany(models.Club, {
                through: 'userclubs',
                as: 'clubs',
                foreignKey: 'user_id',
                otherKey: 'club_id',
                timestamps: false
            })
            {
            }
        }
    }

    User.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        ufirstname: DataTypes.STRING,
        ulastname: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING,
        isapproved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'user',
        timestamps: false
    });

    return User;
};