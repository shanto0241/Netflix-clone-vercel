import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
  } catch (error) {
    console.error("Error connecting to MONGODB: " + error.message);
    process.exit(1); // 1 means there was an error, 0 means success
  }
};
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error disconnecting from MONGODB: " + error.message);
  }
};
