'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.image);
      this.hasMany(models.journal_entry);
      this.hasMany(models.tag);
    }
  };
  user.init({
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        is: {
          // Matches: A-Z, a-z, 0-9 and "-"
          args: /^[a-z0-9-]+$/i,
          msg: "Usernames may contain only letters, numbers and hyphens."
        },
        not: {
          // Matches: starts or ends with a "-"
          args: /^-.+$|^.+-$/i,
          msg: "Usernames may not begin or end with a hyphen."
        },
        len: {
          args: [5, 64],
          msg: "Username must be more than 5 characters." 
        }
      },
      set(val) {
        this.setDataValue('username', val.toLowerCase());
      }
    },
    full_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    display_name: {
      type: DataTypes.TEXT,
      get() {
        // Display name defaults to first word in “full_name“ if no user input.
        const display_name = this.getDataValue("display_name");
        const full_name = this.getDataValue("full_name");
        const name = full_name.split(" ");
        
        return display_name === null ? name[0] : display_name;
      }
    },
    birth_date: DataTypes.DATEONLY,
    email: {
      isEmail: true,
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_id: DataTypes.STRING
  }, {
    sequelize,
    underscored: true,
    modelName: 'user',
  });
  return user;
};