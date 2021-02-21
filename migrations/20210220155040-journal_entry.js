'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("journal_entries", "location_value", "location_place_id");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("journal_entries", "location_place_id", "location_value");
  }
};
