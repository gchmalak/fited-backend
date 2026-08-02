import { NextFunction, Request, Response } from "express";
import { Cart } from "../models/cart.js";
import {
  errorResponse,
  successResponse,
} from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";

// _______________getCart function________________
export async function getCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let cart = await Cart.findOne({ userId: req.user!._id }).populate(
      "cartItems.product",
    );

    if (!cart) {
      cart = await Cart.create({
        userId: req.user!._id,
        cartItems: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    successResponse(res, cart);
  } catch (err) {
    next(err);
  }
}

// _______________addToCart function________________
export async function addToCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { productId, variantId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user!._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user!._id,
        cartItems: [],
        totalItems: 0,
        totalPrice: 0,
      });
    }

    const existingItem = cart.cartItems.find(
      (item) =>
        item.product.toString() === productId &&
        item.variantId === variantId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.cartItems.push({ product: productId, variantId, quantity } as any);
    }

    // recalculate totals
    cart.totalItems = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    // Note: totalPrice needs product prices 

    await cart.save();

    successResponse(res, cart, "Item added to cart!");
  } catch (err) {
    next(err);
  }
}

// _______________removeFromCart function________________
export async function removeFromCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId: req.user!._id });

    if (!cart) {
      errorResponse(res, "Cart not found", StatusCodes.NOT_FOUND);
      return;
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item._id?.toString() !== itemId,
    ) as any;

    cart.totalItems = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    await cart.save();

    successResponse(res, cart, "Item removed from cart!");
  } catch (err) {
    next(err);
  }
}

// _______________updateCartItem function________________
export async function updateCartItem(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user!._id });

    if (!cart) {
      errorResponse(res, "Cart not found", StatusCodes.NOT_FOUND);
      return;
    }

    const item = cart.cartItems.find((i) => i._id?.toString() === itemId);

    if (!item) {
      errorResponse(res, "Item not found in cart", StatusCodes.NOT_FOUND);
      return;
    }

    item.quantity = quantity;

    cart.totalItems = cart.cartItems.reduce(
      (sum, i) => sum + i.quantity,
      0,
    );

    await cart.save();

    successResponse(res, cart, "Cart item updated!");
  } catch (err) {
    next(err);
  }
}