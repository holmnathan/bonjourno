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
      this.belongsTo(models.user);
      this.belongsTo(models.tag_color, { foreignKey: "color_id", as: "color" });
      // this.belongsToMany(models.journal_entry, { through: "journal_entries_tags" });
    }
  };
  tag.init({
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: [0, 64]
      }
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    color_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tag',
    underscored: true,
  });
  return tag;
};