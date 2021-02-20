'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class journal_entries_tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  journal_entries_tags.init({
    journal_entry_id: DataTypes.STRING,
    tag_id: DataTypes.INTEGER
  }, {
    sequelize,
    underscored: true,
    modelName: 'journal_entries_tags',
  });
  return journal_entries_tags;
};