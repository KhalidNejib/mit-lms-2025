import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  mongoUri: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  frontendUrl: string;
  emailUser: string;
  emailPassword: string;
  clientUrl: string;
}

const required = [
  'PORT',
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'FRONTEND_URL',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'CLIENT_URL'
];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

export const config: Config = {
  port: parseInt(process.env.PORT!, 10),
  nodeEnv: process.env.NODE_ENV! as 'development' | 'production' | 'test',
  mongoUri: process.env.MONGODB_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!, // ✅ FIXED
  jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
  frontendUrl: process.env.FRONTEND_URL!,
  emailUser: process.env.EMAIL_USER!,
  emailPassword: process.env.EMAIL_PASSWORD!,
  clientUrl: process.env.CLIENT_URL!,
};
