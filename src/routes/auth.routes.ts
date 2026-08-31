import { Router } from "express";
import { CheckAuth } from "../middlewares/auth.js";
import { changePassword, checkUser, forgotPassword, login, register, resetPassword } from "../controllers/auth.controller.js";
import { validateBodySchema } from "../middlewares/validation.js";
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registrationSchema, resetPasswordSchema} from "../validation/users.js";
import { updateProfilePicture } from "../controllers/users.controller.js";

  const authRouter = Router();

  authRouter.get("/", CheckAuth, checkUser);
  authRouter.post("/register", validateBodySchema(registrationSchema),register)
  authRouter.post("/login", validateBodySchema(loginSchema), login)
  authRouter.put(
  "/password",
  CheckAuth,
  validateBodySchema(changePasswordSchema),
  changePassword,
);
authRouter.post(
  "/forgot-password",
  validateBodySchema(forgotPasswordSchema),
  forgotPassword,
);
authRouter.post(
  "/reset-password",
  validateBodySchema(resetPasswordSchema),
  resetPassword,
);
authRouter.put(
  "/profile-picture",
  CheckAuth,
  updateProfilePicture,
);
  export default authRouter;