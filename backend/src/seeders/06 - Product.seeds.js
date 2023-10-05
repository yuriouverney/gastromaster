/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line
    async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Product',
      [
        {
          id: 1,
          name: 'X-Salada',
          description: 'Pão, hambúrguer, queijo, alface e tomate',
          price: 10.0,
          image: 'files/images/hamburguer1.png',
          promotion: false,
          promotion_percent: null,
          category_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'X-Frango',
          description: 'Pão, hambúrguer de frango, queijo, alface e tomate',
          price: 9.2,
          image: 'files/images/hamburguer2.png',
          promotion: true,
          promotion_percent: 20,
          category_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Frango com Salada',
          description: 'Pão, hambúrguer de frango, alface e tomate',
          price: 10.0,
          image: 'files/images/hamburguer3.png',
          promotion: false,
          promotion_percent: null,
          category_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: 'Palmito',
          description: 'Deliciosa pizza de palmito com catupiry',
          price: 40.0,
          image: 'files/images/pizza1.png',
          promotion: false,
          promotion_percent: null,
          category_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 5,
          name: 'Marguerita',
          description: 'Deliciosa pizza de marguerita',
          price: 40.0,
          image: 'files/images/pizza2.png',
          promotion: false,
          promotion_percent: null,
          category_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 6,
          name: 'Mistureba',
          description: 'Deliciosa pizza de 8 sabores diferentes',
          price: 30.0,
          image: 'files/images/pizza3.png',
          promotion: true,
          promotion_percent: 10,
          category_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: 'Batata Frita',
          description: 'Deliciosa batata frita crocante',
          price: 7.0,
          image: 'files/images/batata.png',
          promotion: false,
          promotion_percent: null,
          category_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Product', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3],
      },
    });
  },
};
