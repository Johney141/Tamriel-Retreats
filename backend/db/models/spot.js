'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo( 
        models.User,
          { as: 'Owner', foreignKey: 'ownerId' }
      )

      Spot.hasMany(
        models.SpotImage,
        {foreignKey: 'spotId', onDelete: 'CASCADE'}
      )

      Spot.hasMany(
        models.Review,
        {foreignKey: 'spotId', onDelete: 'CASCADE'}
      )
    }
  }
  Spot.init({
    address:{
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type:DataTypes.STRING,
      allowNull: false
    },
    state: {
      type:DataTypes.STRING,
      allowNull: false
    },
    country: {
      type:DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type:DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isValidLng(value) {
          if(value < -90 ||  value > 90) {
            throw new Error("Latitude is not valid");
          }
        }
      }
    },
    lng:{
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isValidLng(value) {
          if(value < -180 ||  value > 180) {
            throw new Error("Longitude is not valid");
          }
        }
      }
    },
    name: {
      type:DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};