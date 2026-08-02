import { Router } from "express";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  validateBodySchema,
  validateParamsSchema,
  validateQuerySchema,
} from "../middlewares/validation.js";
import { idParamsSchema, paginationSchema } from "../validation/utils.js";
import { updateUserRoleSchema } from "../validation/users.js";
import {
  getAllUsers,
  updateUserRole,
  deactivateUser,
  reactivateUser,
} from "../controllers/users.controller.js";

const userRouter = Router();

// GET /api/users - list all users (admin only, paginated)
userRouter.get(
  "/",
  CheckAuth,
  isAdmin,
  validateQuerySchema(paginationSchema),
  getAllUsers,
);

// PUT /api/users/:id/role - promote/demote a user (admin only)
userRouter.put(
  "/:id/role",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(updateUserRoleSchema),
  updateUserRole,
);

// PUT /api/users/:id/deactivate - ban/deactivate a user (admin only)
userRouter.put(
  "/:id/deactivate",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  deactivateUser,
);

// PUT /api/users/:id/reactivate - restore a deactivated user (admin only)
userRouter.put(
  "/:id/reactivate",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  reactivateUser,
);

export default userRouter;