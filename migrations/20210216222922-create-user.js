'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      full_name: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      display_name: {
        type: Sequelize.TEXT
      },
      birth_date: {
        type: Sequelize.DATEONLY
      },
      email: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      image_id: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};