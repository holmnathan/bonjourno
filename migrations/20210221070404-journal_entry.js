'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("journal_entries", "temperature_kelvin", "temperature_fahreneheit");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("journal_entries", "temperature_fahreneheit", "temperature_kelvin");
  }
};