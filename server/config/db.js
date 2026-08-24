import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let memServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[DB] Connected to MongoDB Atlas/External at ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[DB] Could not connect to external MongoDB URI (${err.message}). Falling back to in-memory database.`);
    }
  }

  // Fallback to in-memory Mongo for seamless zero-setup execution
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memServer = await MongoMemoryServer.create();
    const memUri = memServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[DB] Connected to In-Memory MongoDB instance at ${memUri}`);
    return conn;
  } catch (error) {
    console.error(`[DB] Database connection error: ${error.message}`);
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memServer) {
    await memServer.stop();
  }
};
