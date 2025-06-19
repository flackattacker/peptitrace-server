const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set in environment variables');
      console.error('Please set DATABASE_URL in your .env file');
      console.error('Example: DATABASE_URL=mongodb://localhost:27017/peptitrace');
      throw new Error('DATABASE_URL is not configured');
    }

    console.log('Database URL being used:', process.env.DATABASE_URL);
    
    // Add connection options for better stability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      keepAlive: true, // Keep the connection alive
      keepAliveInitialDelay: 300000, // Keep alive for 5 minutes
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 5, // Minimum number of connections in the pool
      retryWrites: true, // Retry write operations if they fail
      retryReads: true, // Retry read operations if they fail
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      heartbeatFrequencyMS: 10000, // Check server status every 10 seconds
    };

    const conn = await mongoose.connect(process.env.DATABASE_URL, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Error handling after initial connection
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`);
      // Attempt to reconnect on error
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      // Attempt to reconnect on disconnect
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.info('MongoDB reconnected');
    });

    return true;

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Error details:', error);
    console.error('Make sure MongoDB is running or check your DATABASE_URL in .env file');
    
    // In development, warn but don't crash - allow server to start
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Running in development mode without database connection');
      console.warn('⚠️  Some features may not work properly');
      return false;
    }
    
    // In production, crash if no database
    process.exit(1);
  }
};

module.exports = { connectDB };