"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = [
    'PORT',
    'NODE_ENV',
    'MONGODB_URI',
    'JWT_SECRET',
    //'JWT_REFRESH_SECRET',
    //'JWT_EXPIRES_IN',
    //'JWT_REFRESH_EXPIRES_IN',
    // 'FRONTEND_URL',
    // 'EMAIL_USER',
    // 'EMAIL_PASSWORD',
    // 'CLIENT_URL'
];
required.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
});
exports.config = {
    port: parseInt(process.env.PORT, 10),
    nodeEnv: process.env.NODE_ENV,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    //jwtRefreshSecret:process.env.JWT_REFRESH_SECRETE!,
    //jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
    //jwtRefreshExpiresIn:process.env.JWT_REFRESH_EXPIRES_IN!,
    //frontendUrl: process.env.FRONTEND_URL!,
    //emailUser:process.env.EMAIL_USER!,
    //emailPassword:process.env.EMAIL_PASSWORD!,
    clientUrl: process.env.CLIENT_URL,
};
