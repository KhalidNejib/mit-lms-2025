"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
// src/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const enviroment_1 = require("./enviroment");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(enviroment_1.config.mongoUri);
        console.log('✅ MongoDB connected');
        // Optional: graceful shutdown
        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const gracefulShutdown = async () => {
    console.log('⏳ Gracefully shutting down MongoDB connection...');
    await mongoose_1.default.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
};
