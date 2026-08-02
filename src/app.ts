import express from "express"
import authRouter from "./routes/auth.routes.js";
import helmet from "helmet";
import cors from "cors"
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/order.routes.js";

// server
const app = express();

// middlewares

app.set("trust proxy", true)

app.use(cors({
    credentials:true,
    origin:new RegExp(process.env.CORS_ORIGIN ||"http://localhost:5173")
}));
app.use(helmet());


   if (process.env.NODE_ENV === "development") app.use(morgan("dev"))
app.use(express.json({limit:"10mb"}));
   app.use(express.urlencoded({extended:true, limit:"10mb"}))

// routes
app.use("/api/auth", authRouter)

app.use("/api/products", productRouter);

app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/dashboard", dashboardRouter );
app.use("/api/users", userRouter);

// not found routes
// error routes
app.use(notFoundMiddleware)
 app.use(errorMiddleware)
export default app
