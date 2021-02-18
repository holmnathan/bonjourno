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
      this.belongsTo(models.image_source, { foreignKey: "source_id" });
      this.hasOne(models.user);
      this.hasOne(models.journal_entry);
    }
  };
  image.init({
    id: {
      allowNull: false,
      defaultValue: () => uid.sync(8),
      primaryKey: true,
      type: DataTypes.STRING
    },
    asset_id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    source_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'image',
    underscored: true,
  });
  return image;
};