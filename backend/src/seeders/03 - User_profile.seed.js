/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line
      async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'UserProfile',
      [
        {
          id: 1,
          address: 'Rua do Adm',
          phone: '33333-3333',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          address: 'Rua do Gerente',
          phone: '33333-3333',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          address: 'Rua do Usuário',
          phone: '33333-3333',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserProfile', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3],
      },
    });
  },
};
