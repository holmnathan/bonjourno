'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("journal_entries", "location_longitude", Sequelize.REAL(10,6));
    await queryInterface.changeColumn("journal_entries", "location_latitude", Sequelize.REAL(10,6));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("journal_entries", "location_longitude", Sequelize.FLOAT);
    await queryInterface.changeColumn("journal_entries", "location_latitude", Sequelize.FLOAT);
  }
};
