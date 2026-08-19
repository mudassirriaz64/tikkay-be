"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const config_1 = require("./config");
const PORT = config_1.config.PORT;
process.on('uncaughtException', (err) => {
    console.log('\x1b[31mUNCAUGHT EXCEPTION! Shutting down...\x1b[0m');
    console.error(err.name, err.message);
    process.exit(1);
});
(0, db_1.connectDB)().then(() => {
    const server = app_1.default.listen(PORT, () => {
        console.log('');
        console.log('\x1b[35m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
        console.log('\x1b[35m║           🥩 TIKKAY SHIKKAY - API SERVER 🥩                  ║\x1b[0m');
        console.log('\x1b[35m╚══════════════════════════════════════════════════════════════╝\x1b[0m');
        console.log('');
        console.log(`  \x1b[36m➜  Local:\x1b[0m    http://localhost:${PORT}`);
        console.log(`  \x1b[36m➜  API:\x1b[0m      http://localhost:${PORT}/api/v1`);
        console.log(`  \x1b[36m➜  Health:\x1b[0m   http://localhost:${PORT}/api/v1/health`);
        console.log(`  \x1b[36m➜  Env:\x1b[0m      ${config_1.config.NODE_ENV}`);
        console.log('');
    });
    process.on('unhandledRejection', (err) => {
        console.log('\x1b[31mUNHANDLED REJECTION! Shutting down...\x1b[0m');
        console.error(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });
    process.on('SIGTERM', () => {
        console.log('\x1b[33mSIGTERM received, shutting down gracefully...\x1b[0m');
        server.close(() => {
            console.log('\x1b[36mProcess terminated\x1b[0m');
        });
    });
});
//# sourceMappingURL=index.js.map