require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function testMigration() {
  try {
    console.log('🔍 Testing migration setup...');
    
    // Test if we can connect
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test if SequelizeMeta table exists
    try {
      const result = await sequelize.query("SELECT * FROM \"SequelizeMeta\" LIMIT 1");
      console.log('✅ SequelizeMeta table exists');
    } catch (error) {
      console.log('⚠️ SequelizeMeta table does not exist (this is normal for new databases)');
    }
    
    // Test if we can create a simple table
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS test_migration (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Can create tables');
      
      // Clean up test table
      await sequelize.query('DROP TABLE IF EXISTS test_migration');
      console.log('✅ Can drop tables');
      
    } catch (error) {
      console.error('❌ Cannot create tables:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Migration test failed:');
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testMigration(); 