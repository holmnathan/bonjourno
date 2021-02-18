'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class image_source extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.image, { foreignKey: "source_id" });
    }
  };
  image_source.init({
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true
      }
    }
  }, {
    sequelize,
    modelName: 'image_source',
    underscored: true,
  });
  return image_source;
};