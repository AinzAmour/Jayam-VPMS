import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Configure reliable DNS servers to prevent Windows/ISP querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // fallback if DNS override not permitted
}

dotenv.config();

let memServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    if (uri.includes('<db_password>') || uri.includes('<password>')) {
      console.error("[DB Error]: MONGODB_URI contains the placeholder '<db_password>'. Please replace it with your actual MongoDB Atlas database password in your environment variables.");
    }

    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[DB] Connected to MongoDB Atlas at ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[DB] Could not connect to external MongoDB URI (${err.message}).`);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to connect to MongoDB Atlas in production: ${err.message}. Please check your database username, password, and IP whitelist (0.0.0.0/0).`);
      }
      console.warn('Falling back to local in-memory database for development...');
    }
  }

  // Fallback to in-memory Mongo for development/testing
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.3',
      },
    });
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
