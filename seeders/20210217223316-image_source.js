'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("image_sources", [
      {
        name: "cloudinary",
        url: "https://res.cloudinary.com/",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "unsplash",
        url: "https://images.unsplash.com/",
        created_at: new Date(),
        updated_at: new Date()
      }
   ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("image_sources", null, {});
  }
};