import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  playStoreUrl: process.env.PLAY_STORE_URL,
  appStoreUrl: process.env.APP_STORE_URL,
};

export default config;
