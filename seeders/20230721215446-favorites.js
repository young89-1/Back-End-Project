'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 

     await queryInterface.bulkInsert('favorites', [{
     user_id: 5,
     podcast_id: '3648ca3b8df443a496f608830b4795bc'
     }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
