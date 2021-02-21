'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("journal_entries", "weather_temp_f", Sequelize.REAL);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("journal_entries", "weather_temp_f", Sequelize.INTEGER);
  }
};
