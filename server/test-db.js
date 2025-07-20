require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Environment variables:');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test if tables exist
    const tables = await sequelize.showAllSchemas();
    console.log('📋 Available schemas:', tables.map(t => t.name));
    
    // Test if we can query
    const result = await sequelize.query('SELECT NOW() as current_time');
    console.log('⏰ Current database time:', result[0][0].current_time);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Detail:', error.detail);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check if PostgreSQL is running');
      console.log('2. Verify database credentials in .env file');
      console.log('3. Check if database exists');
    }
    
    if (error.code === '28P01') {
      console.log('\n💡 Authentication failed. Check:');
      console.log('1. Database username and password');
      console.log('2. User permissions');
    }
    
    if (error.code === '3D000') {
      console.log('\n💡 Database does not exist. Create it first:');
      console.log('CREATE DATABASE ecommerce_db;');
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testDatabase(); 