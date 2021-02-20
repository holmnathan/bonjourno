'use strict';

const uid = require("uid-safe");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class journal_entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user);
      this.belongsTo(models.image);
      this.belongsToMany(models.tag, { through: "journal_entries_tags"});
    }
  };
  journal_entry.init({
    id: {
      allowNull: false,
      defaultValue: () => uid.sync(8),
      primaryKey: true,
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Untitled Journal Entry"
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    location_value: DataTypes.TEXT,
    location_name: DataTypes.TEXT,
    temperature_kelvin: DataTypes.INTEGER,
    weather: DataTypes.TEXT,
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    user_id: DataTypes.INTEGER,
    image_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'journal_entry',
    underscored: true,
  });
  return journal_entry;
};