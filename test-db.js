require('dotenv').config();
const { sequelize } = require('./models');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');

        // Check if tables exist
        const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log('📋 Available tables:', tables.map(t => t.table_name));

        // Try to query clubinfo if it exists
        if (tables.some(t => t.table_name === 'clubinfo')) {
            const clubs = await sequelize.query('SELECT * FROM clubinfo LIMIT 2');
            console.log('✅ Sample clubs:', clubs[0]);
        } else {
            console.log('❌ clubinfo table does not exist yet!');
        }

        await sequelize.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testConnection();