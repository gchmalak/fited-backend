import { NextFunction, Request, Response } from "express";

import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import {
  errorResponse,
  successResponse,
} from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";

// _______________createOrder function________________
export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { address,items } = req.body;


    if (items.length === 0) {
      errorResponse(res, "Your cart is empty", StatusCodes.BAD_REQUEST);
      return;
    }

    // Build order items with real, server-side prices
    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        errorResponse(
          res,
          `Product no longer exists`,
          StatusCodes.BAD_REQUEST,
        );
        return;
      }

      const variant = product.variants.find(
        (v) => v._id?.toString() === item.variantId,
      );

      if (!variant) {
        errorResponse(
          res,
          `Selected variant no longer exists for ${product.name}`,
          StatusCodes.BAD_REQUEST,
        );
        return;
      }

      if (variant.stock < item.quantity) {
        errorResponse(
          res,
          `Not enough stock for ${product.name}`,
          StatusCodes.BAD_REQUEST,
        );
        return;
      }

      const priceAtPurchase = product.price;

      orderItems.push({
        product: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtPurchase,
      });

      totalPrice += priceAtPurchase * item.quantity;

      // decrement stock for the purchased variant
      variant.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: req.user!._id,
      items: orderItems,
      totalPrice,
      status: "pending",
      address,
    });

 

    successResponse(res, order, "Order placed successfully!", StatusCodes.CREATED);
  } catch (err) {
    next(err);
  }
}

// _______________getMyOrders function________________
export async function getMyOrders(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orders = await Order.find({ userId: req.user!._id }).sort({
      createdAt: -1,
    });

    successResponse(res, orders);
  } catch (err) {
    next(err);
  }
}

// _______________getOrder function________________
export async function getOrder(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      errorResponse(res, "Order not found", StatusCodes.NOT_FOUND);
      return;
    }

    // only the order's owner or an admin can view it
    const isOwner = order.userId.toString() === req.user!._id.toString();
    if (!isOwner && !req.user!.isAdmin) {
      errorResponse(res, "Not authorized to view this order", StatusCodes.FORBIDDEN);
      return;
    }

    successResponse(res, order);
  } catch (err) {
    next(err);
  }
}

// _______________getAllOrders function (admin only)________________
export async function getAllOrders(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate(
      "userId",
      "-password",
    );

    successResponse(res, orders);
  } catch (err) {
    next(err);
  }
}

// _______________updateOrderStatus function (admin only)________________
export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      
      { status },
      { new: true, runValidators: true },
    );

    if (!order) {
      errorResponse(res, "Order not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, order, "Order status updated!");
  } catch (err) {
    next(err);
  }
}