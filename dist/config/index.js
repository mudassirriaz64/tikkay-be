/// <reference types="node" />
import dotenv from 'dotenv';
dotenv.config();
export const config = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/tikkay-shikkay',
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
    JWT_COOKIE_EXPIRES_IN: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '30', 10),
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || '',
    GOOGLE_PLACE_ID: process.env.GOOGLE_PLACE_ID || '',
    BEHOLD_FEED_URL: process.env.BEHOLD_FEED_URL || '',
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN || '',
};
export const CORS_OPTIONS = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin)
            return callback(null, true);
        const allowedOrigins = (config.CLIENT_URL || '')
            .split(',')
            .map((url) => url.trim().replace(/\/$/, ''))
            .filter(Boolean);
        const isAllowed = allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.includes('localhost');
        if (isAllowed) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
};
export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};
//# sourceMappingURL=index.js.map