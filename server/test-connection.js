require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testConnection() {
  console.log('🔍 Testing Google Cloud SQL connection...');
  console.log('Target:', `${process.env.DB_HOST}:${process.env.DB_PORT}`);
  
  // Test 1: Basic network connectivity
  console.log('\n📡 Test 1: Network connectivity...');
  const net = require('net');
  
  const testSocket = new net.Socket();
  const connectionTimeout = 10000; // 10 seconds
  
  const networkTest = new Promise((resolve) => {
    testSocket.setTimeout(connectionTimeout);
    
    testSocket.on('connect', () => {
      console.log('✅ Network connection successful!');
      testSocket.destroy();
      resolve(true);
    });
    
    testSocket.on('timeout', () => {
      console.log('❌ Network connection timeout');
      testSocket.destroy();
      resolve(false);
    });
    
    testSocket.on('error', (error) => {
      console.log('❌ Network connection failed:', error.message);
      resolve(false);
    });
  });
  
  testSocket.connect(process.env.DB_PORT, process.env.DB_HOST);
  
  const networkResult = await networkTest;
  
  if (!networkResult) {
    console.log('\n💡 Network connectivity issues detected. Possible causes:');
    console.log('1. Google Cloud SQL instance is not running');
    console.log('2. Firewall blocking the connection');
    console.log('3. Instance is not configured for external connections');
    console.log('4. IP address is not whitelisted');
    console.log('5. Instance is in a private VPC');
    
    console.log('\n🔧 Solutions:');
    console.log('1. Check if the instance is running in Google Cloud Console');
    console.log('2. Verify the instance allows external connections');
    console.log('3. Add your IP to the authorized networks');
    console.log('4. Use Cloud SQL Proxy for secure connections');
    
    return;
  }
  
  // Test 2: Database connection
  console.log('\n🗄️ Test 2: Database connection...');
  
  const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 1,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
  
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test 3: Basic query
    console.log('\n🔍 Test 3: Basic query...');
    const result = await sequelize.query('SELECT version() as version');
    console.log('✅ Query successful!');
    console.log('PostgreSQL version:', result[0][0].version);
    
  } catch (error) {
    console.log('❌ Database connection failed:');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    
    if (error.code === '28P01') {
      console.log('\n💡 Authentication failed. Check:');
      console.log('1. Username and password are correct');
      console.log('2. User exists in the database');
      console.log('3. User has proper permissions');
    }
    
    if (error.code === '3D000') {
      console.log('\n💡 Database does not exist. Create it:');
      console.log('CREATE DATABASE ecommerce_db;');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Connection refused. Check:');
      console.log('1. Instance is running');
      console.log('2. Port 5432 is open');
      console.log('3. Firewall rules allow connections');
    }
    
  } finally {
    await sequelize.close();
  }
  
  // Test 4: Check your public IP
  console.log('\n🌐 Test 4: Your public IP...');
  try {
    const https = require('https');
    const ipCheck = new Promise((resolve, reject) => {
      https.get('https://api.ipify.org?format=json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const ip = JSON.parse(data).ip;
            resolve(ip);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
    
    const yourIP = await ipCheck;
    console.log('Your public IP:', yourIP);
    console.log('💡 Make sure this IP is in the authorized networks in Google Cloud SQL');
    
  } catch (error) {
    console.log('Could not determine your public IP');
  }
}

testConnection().catch(console.error); 