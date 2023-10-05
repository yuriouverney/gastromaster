const { readdirSync } = require('fs');
const { basename, join } = require('path');
const { Sequelize } = require('sequelize');

const sequelize = require('../db/database');

const models = readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename(__filename) && file.slice(-3) === '.js';
  })
  .reduce((acc, file) => {
    const model = require(join(__dirname, file));
    model.init(sequelize, Sequelize.DataTypes);
    return { ...acc, [model.name]: model };
  }, {});

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});
