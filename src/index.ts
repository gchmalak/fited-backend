

import "dotenv/config";

import app from "./app.js";



import { connectDB } from "./config/db.js";
import { logger } from "./config/logger.js";

const PORT = process.env.PORT || 3333;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});