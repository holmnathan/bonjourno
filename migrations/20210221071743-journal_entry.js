'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("journal_entries", "temperature_fahreneheit", "weather_temp_f");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("journal_entries", "weather_temp_f", "temperature_fahreneheit");
  }
};
