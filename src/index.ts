/// <reference types="node" />
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
import { config } from './config';

const PORT = config.PORT;

process.on('uncaughtException', (err: Error) => {
  console.log('\x1b[31mUNCAUGHT EXCEPTION! Shutting down...\x1b[0m');
  console.error(err.name, err.message);
  process.exit(1);
});

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('\x1b[35m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[35m║           🥩 TIKKAY SHIKKAY - API SERVER 🥩                  ║\x1b[0m');
    console.log('\x1b[35m╚══════════════════════════════════════════════════════════════╝\x1b[0m');
    console.log('');
    console.log(`  \x1b[36m➜  Local:\x1b[0m    http://localhost:${PORT}`);
    console.log(`  \x1b[36m➜  API:\x1b[0m      http://localhost:${PORT}/api/v1`);
    console.log(`  \x1b[36m➜  Health:\x1b[0m   http://localhost:${PORT}/api/v1/health`);
    console.log(`  \x1b[36m➜  Env:\x1b[0m      ${config.NODE_ENV}`);
    console.log('');
  });

  process.on('unhandledRejection', (err: Error) => {
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
