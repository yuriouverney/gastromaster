/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line
    async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Permission',
      [
        {
          id: 1,
          type: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          type: 'MANAGER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          type: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Permission', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3],
      },
    });
  },
};
