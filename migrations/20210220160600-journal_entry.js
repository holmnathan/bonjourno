'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("journal_entries", "location_coordinates", {
      type: Sequelize.GEOMETRY('POINT')
    }
  );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("journal_entries", "location_coordinates");
  }
};
