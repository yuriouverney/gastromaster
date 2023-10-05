/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line
    async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Category',
      [
        {
          id: 1,
          name: 'Hamburgueres',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Pizzas',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Acompanhamentos',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Category', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3],
      },
    });
  },
};
