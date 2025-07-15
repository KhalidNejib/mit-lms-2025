// src/database.ts
import mongoose from 'mongoose';
import { config } from "./enviroment";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB connected');
    
    // Optional: graceful shutdown
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  console.log('⏳ Gracefully shutting down MongoDB connection...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
};