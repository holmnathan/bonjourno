'use strict';
const uid = require("uid-safe");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.image_source);
      // this.hasMany(models.user);
      // this.hasMany(models.journal_entry);
    }
  };
  image.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uid.sync(8)
    },
    image_source_id: {
      type: DataTypes.INTEGER
    },
    source_value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'image',
  });
  return image;
};