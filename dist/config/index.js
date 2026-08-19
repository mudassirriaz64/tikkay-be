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
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, SSR)
        if (!origin)
            return callback(null, true);
        const clientUrls = (config.CLIENT_URL || '')
            .split(',')
            .map((url) => url.trim().replace(/\/$/, ''))
            .filter(Boolean);
        const isAllowed = clientUrls.includes(origin) ||
            origin === 'https://tikkay-shikkay.vercel.app' ||
            origin.endsWith('.vercel.app') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1');
        if (isAllowed) {
            return callback(null, true);
        }
        // Instead of throwing an error which crashes preflights with 500/no headers, reject gracefully
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cookie',
        'Set-Cookie',
    ],
    exposedHeaders: ['Set-Cookie', 'Content-Range', 'X-Content-Range'],
    optionsSuccessStatus: 204,
    preflightContinue: false,
};
export const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
};
//# sourceMappingURL=index.js.map