const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecommerce_db',
  username: process.env.DB_USER || 'username',
  password: process.env.DB_PASSWORD || 'password',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// For Sequelize CLI
module.exports = {
  development: {
    host: '34.63.40.75',
    port: 5432,
    database: 'ecommerce_db',
    username: 'ecommerce_user',
    password: '8779700241',
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    host: '34.63.40.75',
    port: 5432,
    database: 'ecommerce_db',
    username: 'ecommerce_user',
    password: '8779700241',
    dialect: 'postgres',
    logging: false
  },
  production: {
    host: '34.63.40.75',
    port: 5432,
    database: 'ecommerce_db',
    username: 'ecommerce_user',
    password: '8779700241',
    dialect: 'postgres',
    logging: false
  }
};

module.exports.sequelize = sequelize;
