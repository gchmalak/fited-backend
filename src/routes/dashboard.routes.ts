import { Router } from "express";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  getDashboardStats,
  getLowStockProducts,
} from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/stats", CheckAuth, isAdmin, getDashboardStats);
dashboardRouter.get("/low-stock", CheckAuth, isAdmin, getLowStockProducts);

export default dashboardRouter;