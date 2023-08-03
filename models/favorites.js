'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favorites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  favorites.init({
    user_id: DataTypes.INTEGER,
    podcast_id: DataTypes.STRING,
    podcast_title: DataTypes.STRING,
    podcast_image: DataTypes.STRING,
    podcast_audio: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'favorites',
  });
  return favorites;
};