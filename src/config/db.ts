import mongoose from "mongoose";
import { logger } from "./logger.js";

mongoose.set("debug", process.env.NODE_ENV === "development");
export async function connectDB(): Promise<typeof mongoose> {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        dbName: process.env.MONGODB_DB_NAME as string ,
        auth: {
          username: process.env.MONGODB_USERNAME as string ,
          password: process.env.MONGODB_PASSWORD as string ,
        },
      },
    );

    logger.info("MongoDB connected");
    console.log("MongoDB connected");

    return connection;
  } catch (err) {
    logger.error("MongoDB connection failed", {
      error: (err as Error).message,
    });
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}