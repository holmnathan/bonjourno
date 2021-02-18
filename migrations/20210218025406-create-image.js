'use strict';
const uid = require("uid-safe");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('images', {
      id: {
        allowNull: false,
        defaultValue: () => uid.sync(8),
        primaryKey: true,
        type: Sequelize.STRING
      },
      asset_id: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      source_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('images');
  }
};