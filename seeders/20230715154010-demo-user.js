'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'example@example.com',
      username: 'jd123',
      password: 'abcdefg123',
      created_at: new Date()
    }]);
  },
  async down (queryInterface, Sequelize) {
    // /**
    //  * Add commands to revert seed here.
    return queryInterface.bulkDelete('Users', null, {});
    //  */
  }
};
