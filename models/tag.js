'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.tag_color);
      this.belongsTo(models.user);
      this.belongsToMany(models.journal_entry, { through: "tags_journal_entries" });
    }
  };
  tag.init({
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tag_color_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    underscored: true,
    modelName: 'tag',
  });
  return tag;
};