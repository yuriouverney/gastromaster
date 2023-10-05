const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API para aplicação Gastro Master',
      version: '1.0.0',
      description: 'Esta é a API RESTful para a aplicação Gastro Master',
    },
    servers: [
      {
        url: '/app',
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/controllers/*.js'], // Path to your controllers files
};

const specs = swaggerJSDoc(options);

module.exports = specs;
