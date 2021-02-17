'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tags_journal_entries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      journal_entry_id: {
        type: Sequelize.STRING,
        references: {
          model: "journal_entries", // 'Movies' would also work
          key: 'id'
        }
      },
      tag_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "tags", // 'Movies' would also work
          key: 'id'
        }
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
    await queryInterface.dropTable('tags_journal_entries');
  }
};