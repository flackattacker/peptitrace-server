const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('Current directory:', __dirname);
console.log('Env file path:', path.resolve(__dirname, '.env'));
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const dropDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully.');
  } catch (error) {
    console.error('Error dropping database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

dropDatabase(); 