'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tags_journal_entries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tags_journal_entries.init({
    journal_entry_id: DataTypes.STRING,
    tag_id: DataTypes.INTEGER
  }, {
    sequelize,
    underscored: true,
    modelName: 'tags_journal_entries',
  });
  return tags_journal_entries;
};