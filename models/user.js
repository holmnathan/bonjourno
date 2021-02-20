'use strict';
const bcrypt = require('bcrypt')
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
      this.belongsTo(models.image);
      this.hasMany(models.journal_entry, {as: "entries"});
    }
    
    // Compares entered password to hashed password
    validPassword(passwordTyped) {
      return bcrypt.compareSync(passwordTyped, this.password);
    };
    // remove the password before serializing
    toJSON() {
      let userData = this.get();
      delete userData.password;
      return userData;
    };
  };
  user.init({
    full_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    display_name: DataTypes.TEXT,
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[a-z0-9-]+$/i,
          msg: "Username may contain letters, numbers or hyphens."
        },
        not: {
          args: /^-.*$|^.+-$/i,
          msg: "Username must not begin or end with a hyphen."
        },
        len: {
          args: [5,64],
          msg: "Username must be between 5 and 64 characters in length."
        }
      }
    },
    birth_date: DataTypes.DATEONLY,
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
  });
  
  user.beforeCreate((pendingUser, options) => {
    if (pendingUser && pendingUser.password) {
      // hash the password
      let hash = bcrypt.hashSync(pendingUser.password, 12);
      // store the hash as the user's password
      pendingUser.password = hash;
      }
    }
  )
  
  return user;
};