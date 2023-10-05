const environment = require('../utils/environment');
environment.init();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: console.log, // log queries
  logQueryParameters: true, // log query parameters
  benchmark: true, // log query execution time
});

module.exports = sequelize;
