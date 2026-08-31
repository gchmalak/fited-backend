import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { User } from "../models/user.js";
import { Product } from "../models/product.js";
import {
  errorResponse,
  successResponse,
} from "../utils/responseFormatter.js";

// GET /api/wishlist
// Get the logged-in user's wishlist
export async function getWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await User.findById(req.user?._id)
      .select("wishlist")
      .populate("wishlist");

    if (!user) {
      errorResponse(
        res,
        "User not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    successResponse(
      res,
      user.wishlist,
      "Wishlist retrieved successfully",
      StatusCodes.OK,
    );
  } catch (error) {
    next(error);
  }
}

// POST /api/wishlist/:id
// Add a product to the logged-in user's wishlist
export async function addToWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    // Make sure id is a single string
    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      errorResponse(
        res,
        "Invalid product ID",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Check that the product exists
    const product = await Product.findById(id);

    if (!product) {
      errorResponse(
        res,
        "Product not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    // Add product to wishlist
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $addToSet: {
          wishlist: product._id,
        },
      },
      {
        new: true,
      },
    ).populate("wishlist");

    if (!user) {
      errorResponse(
        res,
        "User not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    successResponse(
      res,
      user.wishlist,
      "Product added to wishlist",
      StatusCodes.OK,
    );
  } catch (error) {
    next(error);
  }
}

// DELETE /api/wishlist/:id
// Remove a product from the logged-in user's wishlist
export async function removeFromWishlist(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    // Make sure id is a single string
    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      errorResponse(
        res,
        "Invalid product ID",
        StatusCodes.BAD_REQUEST,
      );
      return;
    }

    // Remove product from wishlist
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $pull: {
          wishlist: id,
        },
      },
      {
        new: true,
      },
    ).populate("wishlist");

    if (!user) {
      errorResponse(
        res,
        "User not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    successResponse(
      res,
      user.wishlist,
      "Product removed from wishlist",
      StatusCodes.OK,
    );
  } catch (error) {
    next(error);
  }
}