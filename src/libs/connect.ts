import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

//mongodb connect
const connectMongoDB = async () => {
  try {
    // if (connection.isConnected) {
    //   return;
    // }
    const url = process.env.MONGO_URI;

    const db = await mongoose.connect(url);
    connection.isConnected = db?.connections[0]?.readyState;
    console.log("connected to atlas mongodb");
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
  }
};

export default connectMongoDB;
