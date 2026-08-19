"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let cachedConnection = null;
const connectDB = async () => {
    try {
        if (cachedConnection && mongoose_1.default.connection.readyState === 1) {
            return;
        }
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tikkay-shikkay';
        const conn = await mongoose_1.default.connect(mongoURI, {
            bufferCommands: false,
        });
        cachedConnection = conn;
        console.log(`\x1b[36m✓ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
        console.log(`\x1b[36m✓ Database: ${conn.connection.name}\x1b[0m`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error(`\x1b[31mMongoDB connection error: ${err}\x1b[0m`);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('\x1b[33mMongoDB disconnected\x1b[0m');
        });
    }
    catch (error) {
        console.error(`\x1b[31m✗ MongoDB connection failed: ${error.message}\x1b[0m`);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('\x1b[36m✓ MongoDB Disconnected\x1b[0m');
    }
    catch (error) {
        console.error(`\x1b[31m✗ MongoDB disconnect failed: ${error.message}\x1b[0m`);
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=db.js.map