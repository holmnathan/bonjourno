'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("users", [
      {
      full_name: "José Richards",
      email: "jose@richards.com",
      username: "jose-rich",
      birth_date: "2000-05-01",
      password: "12345",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      full_name: "Jillian Smith",
      display_name: "Jill",
      email: "jill@smith.com",
      username: "jollyjill",
      birth_date: "1971-06-30",
      password: "12345",
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete("users", null, {});
  }
};
