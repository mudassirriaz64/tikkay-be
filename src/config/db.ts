import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tikkay-shikkay';

    const conn = await mongoose.connect(mongoURI);
    console.log(`\x1b[36m✓ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    console.log(`\x1b[36m✓ Database: ${conn.connection.name}\x1b[0m`);

    mongoose.connection.on('error', (err: Error) => {
      console.error(`\x1b[31mMongoDB connection error: ${err}\x1b[0m`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('\x1b[33mMongoDB disconnected\x1b[0m');
    });
  } catch (error) {
    console.error(`\x1b[31m✗ MongoDB connection failed: ${(error as Error).message}\x1b[0m`);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('\x1b[36m✓ MongoDB Disconnected\x1b[0m');
  } catch (error) {
    console.error(`\x1b[31m✗ MongoDB disconnect failed: ${(error as Error).message}\x1b[0m`);
  }
};
