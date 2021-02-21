'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("journal_entries", "location_longitude", Sequelize.FLOAT(10,6));
    await queryInterface.addColumn("journal_entries", "location_latitude", Sequelize.FLOAT(10,6));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("journal_entries", "location_longitude");
    await queryInterface.removeColumn("journal_entries", "location_latitude");
  }
};
