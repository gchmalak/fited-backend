import { Router } from "express";
import { CheckAuth } from "../middlewares/auth";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/carts.controller";
import { validateBodySchema } from "../middlewares/validation";
import { addToCartSchema, updateCartItemSchema } from "../validation/carts";

const cartRouter = Router();

cartRouter.get("/", CheckAuth, getCart);
cartRouter.post("/", CheckAuth, validateBodySchema(addToCartSchema), addToCart);
cartRouter.put("/:itemId", CheckAuth, validateBodySchema(updateCartItemSchema), updateCartItem);
cartRouter.delete("/:itemId", CheckAuth, removeFromCart);

export default cartRouter;