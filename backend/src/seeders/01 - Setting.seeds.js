/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line
    async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Setting',
      [
        {
          id: 1,
          name: 'Gastrô Master',
          email: 'gastromasterautomatic@gmail.com',
          phone: '(31) 93333-3333',
          address: 'Rua Alberto Pasqualini, 1111',
          description:
            'Este é o melhor restaurante da cidade! Todos os produtos são desenvolvidos com os mais altos padrões de qualidade e higiene.',
          short_description: 'O melhor restaurante da cidade!',
          banner: 'files/images/banner.jpg',
          logo: 'files/images/logo.png',
          about_image: 'files/images/about.png',
          opening_hour: JSON.stringify({
            'Segunda-feira': '08:00 - 23:00',
            'Terca-feira': '08:00 - 23:00',
            'Quarta-feira': '08:00 - 23:00',
            'Quinta-feira': '08:00 - 23:00',
            'Sexta-feira': '08:00 - 23:00',
            Sabado: '08:00 - 23:00',
            Domingo: 'Fechado',
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Setting', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3],
      },
    });
  },
};
