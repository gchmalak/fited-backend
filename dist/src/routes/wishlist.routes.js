import { Router } from "express";
import { CheckAuth } from "../middlewares/auth.js";
import { getWishlist, addToWishlist, removeFromWishlist, } from "../controllers/wishlist.controller.js";
const wishlistRouter = Router();
// Get logged-in user's wishlist
wishlistRouter.get("/", CheckAuth, getWishlist);
// Add product to wishlist
wishlistRouter.post("/:id", CheckAuth, addToWishlist);
// Remove product from wishlist
wishlistRouter.delete("/:id", CheckAuth, removeFromWishlist);
export default wishlistRouter;
