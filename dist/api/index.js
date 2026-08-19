"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = __importDefault(require("../src/app"));
const db_1 = require("../src/config/db");
async function handler(req, res) {
    const origin = req.headers.origin;
    // Dynamically reflect origin for trusted Vercel and local deployments
    if (origin &&
        (origin.endsWith('.vercel.app') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    else {
        res.setHeader('Access-Control-Allow-Origin', 'https://tikkay-shikkay.vercel.app');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie, Set-Cookie');
    // Intercept and resolve preflight immediately with HTTP OK (204)
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    try {
        await (0, db_1.connectDB)();
    }
    catch (err) {
        console.error('MongoDB connection error in serverless handler:', err?.message, err?.stack || err);
        return res.status(503).json({
            success: false,
            message: 'Service temporarily unavailable - database connection failed',
        });
    }
    return (0, app_1.default)(req, res);
}
//# sourceMappingURL=index.js.map