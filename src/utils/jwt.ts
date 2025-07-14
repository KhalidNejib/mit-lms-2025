// utils/jwt.ts (create this file for token helpers)
import jwt from 'jsonwebtoken';
import {config} from "../config/enviroment"

const JWT_SECRET = config.jwtSecret || 'secret';
const REFRESH_TOKEN_SECRET = config.jwtRefreshSecret || 'refreshsecret';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
