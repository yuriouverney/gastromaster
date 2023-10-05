/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line
    async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'User',
      [
        {
          id: 1,
          name: 'Adm',
          email: 'adm@adm.com',
          password: '$2b$10$dlIU8.c0TxxUX0sKya6UEO1/cI418qjpjB4ymxWG3fePIP14.sKiK',
          googleId: null,
          permission_id: 1,
          user_profile_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Gerente',
          email: 'gerente@gerente.com',
          password: '$2b$10$dlIU8.c0TxxUX0sKya6UEO1/cI418qjpjB4ymxWG3fePIP14.sKiK',
          googleId: null,
          permission_id: 2,
          user_profile_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Usuário',
          email: 'usuario@usuario.com',
          password: '$2b$10$dlIU8.c0TxxUX0sKya6UEO1/cI418qjpjB4ymxWG3fePIP14.sKiK',
          googleId: null,
          permission_id: 3,
          user_profile_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3],
      },
    });
  },
};
