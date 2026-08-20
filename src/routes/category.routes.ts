import { Router } from "express";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import { validateBodySchema, validateParamsSchema } from "../middlewares/validation.js";
import { idParamsSchema } from "../validation/utils.js";
import { createCategorySchema, updateCategorySchema } from "../validation/categories.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .get(getCategories)   // public — no middleware, shoppers need to browse by category
  .post(CheckAuth, isAdmin, validateBodySchema(createCategorySchema),createCategory); // CheckAuth, isAdmin, validateBodySchema(createCategorySchema)

categoryRouter
  .route("/:id")
  .put(CheckAuth,isAdmin,validateParamsSchema(idParamsSchema),validateBodySchema(updateCategorySchema),updateCategory)     // CheckAuth, isAdmin, validateParamsSchema(idParamsSchema), validateBodySchema(updateCategorySchema)
  .delete(CheckAuth,isAdmin,validateParamsSchema(idParamsSchema),deleteCategory); // CheckAuth, isAdmin, validateParamsSchema(idParamsSchema)

export default categoryRouter;