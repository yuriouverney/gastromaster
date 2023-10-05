'use strict';
const dotenv = require('dotenv');
const fs = require('fs');

class Environment {
  init() {
    if (process.env.NODE_ENV === 'undefined') {
      process.env.NODE_ENV = 'development';
    }
    this.envPath = `${process.cwd()}/.env.${process.env.NODE_ENV}`;
    this.checkNodeEnv();
    dotenv.config({
      path: this.envPath,
    });
  }

  checkNodeEnv() {
    if (!fs.existsSync(this.envPath)) {
      throw new Error(`File not found ${this.envPath}`);
    }
  }
}

module.exports = new Environment();
