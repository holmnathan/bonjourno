'use strict';

const uid = require("uid-safe");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('journal_entries', {
      id: {
        allowNull: false,
        defaultValue: () => uid.sync(8),
        primaryKey: true,
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: "Untitled Journal Entry"
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      date_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      location_value: {
        type: Sequelize.TEXT
      },
      location_name: {
        type: Sequelize.TEXT
      },
      temperature_kelvin: {
        type: Sequelize.INTEGER
      },
      weather: {
        type: Sequelize.TEXT
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      user_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('journal_entries');
  }
};