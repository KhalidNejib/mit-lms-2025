import dotenv from 'dotenv';

dotenv.config();

interface Config {
  EMAIL_PASS: string;
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  mongoUri: string;

  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;

  frontendUrl: string;
  clientUrl: string;

  // Email / SMTP settings
  emailHost: string;
  emailPort: number;
  emailUser: string;
  emailPassword: string;
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
  'CLIENT_URL',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
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
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN!,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,

  frontendUrl: process.env.FRONTEND_URL!,
  clientUrl: process.env.CLIENT_URL!,

  emailHost: process.env.EMAIL_HOST!,
  emailPort: parseInt(process.env.EMAIL_PORT!, 10),
  emailUser: process.env.EMAIL_USER!,
  emailPassword: process.env.EMAIL_PASS!,
  EMAIL_PASS: ''
};
