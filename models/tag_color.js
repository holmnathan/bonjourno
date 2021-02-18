'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag_color extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.tag, { foreignKey: "color_id" });
    }
  };
  tag_color.init({
    name: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: [0, 20]
    }
  }
  }, {
    sequelize,
    modelName: 'tag_color',
    underscored: true,
  });
  return tag_color;
};