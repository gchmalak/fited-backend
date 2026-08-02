import { Router } from "express";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  validateBodySchema,
  validateParamsSchema,
} from "../middlewares/validation.js";
import { idParamsSchema } from "../validation/utils.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validation/orders.js";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orders.controller.js";

const orderRouter = Router();

orderRouter
  .route("/")
  .get(CheckAuth, getMyOrders)
  .post(CheckAuth, validateBodySchema(createOrderSchema), createOrder);

orderRouter.get("/all", CheckAuth, isAdmin, getAllOrders);

orderRouter
  .route("/:id")
  .get(CheckAuth, validateParamsSchema(idParamsSchema), getOrder)
  .put(
    CheckAuth,
    isAdmin,
    validateParamsSchema(idParamsSchema),
    validateBodySchema(updateOrderStatusSchema),
    updateOrderStatus,
  );

export default orderRouter;