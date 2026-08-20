import { Router } from "express";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  validateBodySchema,
  validateParamsSchema,
  validateQuerySchema,
} from "../middlewares/validation.js";
import {
  idParamsSchema,
  paginationSchema,
  sortSchema,
} from "../validation/utils.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validation/products.js";
import {
  createProduct,
  deleteProduct,
  getFilters,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";

const productRouter = Router();

productRouter
  .route("/")
  .get(validateQuerySchema(paginationSchema.and(sortSchema)), getProducts)
  .post(
    CheckAuth,
    isAdmin,
    validateBodySchema(createProductSchema),
    createProduct,
  );

  productRouter.get("/filters",getFilters)
productRouter
  .route("/:id")
  .get(validateParamsSchema(idParamsSchema), getProduct)
  .put(
    CheckAuth,
    isAdmin,
    validateParamsSchema(idParamsSchema),
    validateBodySchema(updateProductSchema),
    updateProduct,
  )
  .delete(
    CheckAuth,
    isAdmin,
    validateParamsSchema(idParamsSchema),
    deleteProduct,
  );
export default productRouter;