import mongoose from "mongoose";
import { DB_NAME } from "../constant";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: DB_NAME,
    });
  } catch (err) {
    console.log("MongoDB connection error");
    process.exit(1);
  }
};
