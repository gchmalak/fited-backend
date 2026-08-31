import { Router } from "express";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import { validateBodySchema } from "../middlewares/validation.js";
import { updateEditorialSchema } from "../validation/editorial.js";
import { getEditorials, updateEditorial } from "../controllers/editorial.controller.js";
const editorialRouter = Router();
editorialRouter.get("/", getEditorials);
editorialRouter.put("/:slot", CheckAuth, isAdmin, validateBodySchema(updateEditorialSchema), updateEditorial);
export default editorialRouter;
