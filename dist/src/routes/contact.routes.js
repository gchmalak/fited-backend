import { Router } from "express";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import { validateBodySchema, validateParamsSchema } from "../middlewares/validation.js";
import { idParamsSchema } from "../validation/utils.js";
import { createContactMessageSchema, replySchema } from "../validation/contact.js";
import { createContactMessage, getAllContactMessages, markAsRead, replyToContactMessage } from "../controllers/contact.controller.js";
const contactRouter = Router();
contactRouter
    .route("/")
    .post(validateBodySchema(createContactMessageSchema), createContactMessage)
    .get(CheckAuth, isAdmin, getAllContactMessages);
contactRouter.put("/:id/read", CheckAuth, isAdmin, validateParamsSchema(idParamsSchema), markAsRead);
contactRouter.post("/:id/reply", CheckAuth, isAdmin, validateParamsSchema(idParamsSchema), validateBodySchema(replySchema), replyToContactMessage);
export default contactRouter;
