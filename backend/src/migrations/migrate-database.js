const environment = require('../utils/environment');
environment.init();
const sequelize = require('./migrate-connection-database');
const mysql = require('mysql2/promise');
const { readdirSync } = require('fs');
const { basename, join } = require('path');
const { Sequelize } = require('sequelize');

const config = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const createDatabaseIfNotExists = async () => {
  if (config.dialect == 'mysql') {
    const { host, port, username, password, database } = config;
    const connection = await mysql.createConnection({ host, port, user: username, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.close();
  } else {
    throw new Error(`Dialeto não suportado para criação de database: ${config.dialect}`);
  }
};
createDatabaseIfNotExists();

const modelsPath = join(__dirname, '..', 'models');
const models = readdirSync(modelsPath)
  .filter((file) => {
    return (
      file !== 'index.js' &&
      file.indexOf('.') !== 0 &&
      file !== basename(__filename) &&
      file.slice(-3) === '.js'
    );
  })
  .reduce((acc, file) => {
    const model = require(join(modelsPath, file));
    model.init(sequelize, Sequelize.DataTypes);
    return { ...acc, [model.name]: model };
  }, {});

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

sequelize
  .query('CREATE DATABASE IF NOT EXISTS gastro_master')
  .then(() => {
    console.log('Banco de dados criado com sucesso!');
  })
  .catch((error) => {
    console.log('Ocorreu um erro ao criar o banco de dados:', error);
  });

sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Todas as tabelas foram sincronizadas com sucesso!');
  })
  .catch((error) => {
    console.log('Ocorreu um erro ao sincronizar as tabelas:', error);
  });
