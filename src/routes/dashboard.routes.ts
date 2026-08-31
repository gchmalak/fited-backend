import { Router } from "express";
import { CheckAuth, isAdmin, isOwner } from "../middlewares/auth.js";
import {
  getDashboardStats,
  getLowStockProducts,
} from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/stats", CheckAuth, isAdmin, getDashboardStats);
dashboardRouter.get("/low-stock", CheckAuth, isOwner, getLowStockProducts);

export default dashboardRouter;