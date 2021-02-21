'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {},
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("journal_entries", "weather_icon");
    
    await queryInterface.renameColumn("journal_entries", "weather_condition", "weather");
  }
};
