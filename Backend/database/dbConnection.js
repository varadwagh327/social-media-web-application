import mongoose from 'mongoose';
import config from '../config/index.js';

/**
 * MongoDB Database Connection
 * Handles connection pooling, retry logic, and error handling
 */
export const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(config.database.uri, {
      ...config.database.options,
    });

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    console.log(`📊 Database: ${connection.connection.name}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    return connection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      dbConnection();
    }, 5000);
  }
};

/**
 * Disconnect from database
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};

/**
 * Health check function
 */
export const checkDBHealth = async () => {
  try {
    const admin = mongoose.connection.db.admin();
    const status = await admin.ping();
    return status;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return null;
  }
};