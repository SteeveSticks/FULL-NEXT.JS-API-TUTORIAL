import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  // Check if it'salredy connected we don't want to connect it again
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Alredy connected");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting..");
    return;
  }

  try {
    mongoose.connect(MONGODB_URL!, {
      dbName: "next14restapi",
      bufferCommands: true,
    });
    console.log("Connected");
  } catch (error: any) {
    console.log("Error :", error);
    throw new Error("Error :", error);
  }
};

export default connectDB;
