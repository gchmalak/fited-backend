import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
import { successResponse } from "../utils/responseFormatter.js";

// _____________________dashboard stats______________________
export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const totalProducts = await Product.countDocuments();

    // order count by status
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const deliveredOrders = await Order.countDocuments({
      status: "delivered",
    });
    const cancelledOrders = await Order.countDocuments({
      status: "cancelled",
    });

    // revenue aggregation (delivered orders only)
    const revenueResult = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // orders created this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const ordersThisWeek = await Order.countDocuments({
      createdAt: { $gte: startOfWeek },
    });

    successResponse(res, {
      totalProducts,
      orders: {
        pending: pendingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        thisWeek: ordersThisWeek,
      },
      totalRevenue,
    });
  } catch (err) {
    next(err);
  }
}

// _____________________low stock report______________________
export async function getLowStockProducts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const LOW_STOCK_THRESHOLD = 5;

    const products = await Product.find({
      "variants.stock": { $lt: LOW_STOCK_THRESHOLD },
    }).select("name department category variants");

    successResponse(res, products);
  } catch (err) {
    next(err);
  }
}