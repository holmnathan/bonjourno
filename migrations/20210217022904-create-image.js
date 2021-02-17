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
      image_source_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "image_sources",
          key: "id"
        }
      },
      source_value: {
        allowNull: false,
        type: Sequelize.TEXT
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