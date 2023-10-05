/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line
    async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Coupon',
      [
        {
          id: 1,
          value: 10.0,
          order_min_value: 10.0,
          code: 'PUC10',
          active: true,
          expiration_date: '2023-12-31',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          value: 15.0,
          order_min_value: 20.0,
          code: 'PUC15',
          active: false,
          expiration_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Coupon', {
      id: {
        [Sequelize.Op.in]: [1, 2],
      },
    });
  },
};
