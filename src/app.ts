import express from "express";
import authRouter from "./routes/auth.routes.js";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import productRouter from "./routes/product.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";
import carouselRouter from "./routes/carousel.routes.js"; // <-- Carousel router
import uploadRouter from "./routes/upload.routes.js";     // <-- Upload router
import editorialRouter from "./routes/editorial.routes.js";
import newsletterRouter from "./routes/newsletter.routes.js";
import contactRouter from "./routes/contact.routes.js";
import { categoryRouter } from "./routes/category.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";

// server
const app = express();

// middlewares
app.set("trust proxy", true);

app.use(
  cors({
    credentials: true,
    origin: new RegExp(process.env.CORS_ORIGIN || "http://localhost:3000"),
  })
);
app.use(helmet());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/carousel", carouselRouter); // <-- Registered endpoint
app.use("/api/upload", uploadRouter);     // <-- Registered endpoint
app.use("/api/editorial", editorialRouter);

app.use("/api/newsletter", newsletterRouter);
app.use("/api/contact", contactRouter);
app.use("/api/wishlist", wishlistRouter);
// not found routes & error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;