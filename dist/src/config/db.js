import mongoose from "mongoose";
import { logger } from "./logger.js";
mongoose.set("debug", process.env.NODE_ENV === "development");
export async function connectDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME,
            auth: {
                username: process.env.MONGODB_USERNAME,
                password: process.env.MONGODB_PASSWORD,
            },
        });
        logger.info("MongoDB connected");
        console.log("MongoDB connected");
        return connection;
    }
    catch (err) {
        logger.error("MongoDB connection failed", {
            error: err.message,
        });
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}
