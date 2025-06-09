import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

const connectMongoDB = async () => {
  try {
    if (connection.isConnected) return;

    const url = process.env.MONGO_URI;
    if (!url) throw new Error('MONGO_URI not defined');

    mongoose.set('bufferCommands', false); // Optional: fail fast if not connected

    const db = await mongoose.connect(url, {
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('Connected to Atlas MongoDB');
  } catch (error: any) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

export default connectMongoDB;
