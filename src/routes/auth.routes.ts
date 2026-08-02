import { Router } from "express";
import { CheckAuth } from "../middlewares/auth.js";
import { checkUser, login, register } from "../controllers/auth.controller.js";
import { validateBodySchema } from "../middlewares/validation.js";
import { loginSchema, registrationSchema} from "../validation/users.js";

  const authRouter = Router();

  authRouter.get("/", CheckAuth, checkUser);
  authRouter.post("/register", validateBodySchema(registrationSchema),register)
  authRouter.post("/login", validateBodySchema(loginSchema), login)
  export default authRouter;