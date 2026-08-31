import { Router } from "express";
import multer from "multer";

import { CheckAuth, isAdmin, isOwner } from "../middlewares/auth.js";

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
  updateProfilePicture,
} from "../controllers/users.controller.js";

const userRouter = Router();

// _____________________Multer configuration______________________

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// _____________________Profile Picture______________________

// PUT /api/users/profile-picture
// Update logged-in user's profile picture

userRouter.put(
  "/profile-picture",
  CheckAuth,
  upload.single("avatar"),
  updateProfilePicture,
);

// _____________________Get All Users______________________

// GET /api/users - list all users (admin only, paginated)

userRouter.get(
  "/",
  CheckAuth,
  isAdmin,
  validateQuerySchema(paginationSchema),
  getAllUsers,
);

// _____________________Update User Role______________________

// PUT /api/users/:id/role - promote/demote a user (owner only)

userRouter.put(
  "/:id/role",
  CheckAuth,
  isOwner,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(updateUserRoleSchema),
  updateUserRole,
);

// _____________________Deactivate User______________________

// PUT /api/users/:id/deactivate - deactivate a user (owner only)

userRouter.put(
  "/:id/deactivate",
  CheckAuth,
  isOwner,
  validateParamsSchema(idParamsSchema),
  deactivateUser,
);

// _____________________Reactivate User______________________

// PUT /api/users/:id/reactivate - restore a deactivated user

userRouter.put(
  "/:id/reactivate",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  reactivateUser,
);



export default userRouter;