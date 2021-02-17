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
      // define association here
      this.belongsTo(models.user);
      // this.belongsTo(models.image);
      this.belongsToMany(models.tag, { through: "tags_journal_entries" });
    }
  };
  journal_entry.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: uid.sync(8)
    },
    user_id: DataTypes.INTEGER,
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const title = this.getDataValue("title");
        return title === null ? "Untitled Journal Entry" : title;
      }
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
    temperature_kelvin: DataTypes.SMALLINT,
    weather: DataTypes.TEXT,
    image_id: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    underscored: true,
    modelName: 'journal_entry',
  });
  return journal_entry;
};