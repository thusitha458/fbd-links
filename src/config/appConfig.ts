import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  playStoreUrl: process.env.PLAY_STORE_URL,
  appStoreUrl: process.env.APP_STORE_URL,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    dialect: 'mysql' as Dialect,
  },
};

export default config;
