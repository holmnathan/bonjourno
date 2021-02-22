'use strict';

const uid = require("uid-safe");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class journal_entry extends Model { 
    short_date() {
      const month = this.date_time.toLocaleDateString("en-US", { month: "short"});
      const day = this.date_time.toLocaleDateString("en-US", { day: "numeric"});
      return {month, day}
    }
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
    location_place_id: DataTypes.TEXT,
    location_name: DataTypes.TEXT,
    location_latitude: {
      type: DataTypes.REAL
    },
    location_longitude: {
      type: DataTypes.REAL
    },
    weather_temp_f: DataTypes.REAL,
    weather_condition: DataTypes.TEXT,
    weather_icon: DataTypes.TEXT,
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