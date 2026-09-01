import { Router } from "express";

import { CheckAuth, isAdmin } from "../middlewares/auth.js";

import {
  validateBodySchema,
  validateParamsSchema,
} from "../middlewares/validation.js";

import { idParamsSchema } from "../validation/utils.js";

import {
  createContactMessageSchema,
  replySchema,
} from "../validation/contact.js";

import {
  createContactMessage,
  getAllContactMessages,
  markAsRead,
  replyToContactMessage,
  getMyContactMessages,
  customerReplyToContactMessage,
} from "../controllers/contact.controller.js";

const contactRouter = Router();



//  Customer - Create a new conversation



contactRouter.post(
  "/",
  validateBodySchema(createContactMessageSchema),
  createContactMessage,
);



//  Admin / Owner - Get all conversations



contactRouter.get(
  "/",
  CheckAuth,
  isAdmin,
  getAllContactMessages,
);



//  Customer - Get their conversations



contactRouter.get(
  "/my",
  CheckAuth,
  getMyContactMessages,
);



// Admin / Owner - Mark conversation as read



contactRouter.put(
  "/:id/read",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  markAsRead,
);



//  Admin / Owner - Reply



contactRouter.post(
  "/:id/reply",
  CheckAuth,
  isAdmin,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(replySchema),
  replyToContactMessage,
);

//  Customer : Continue conversation


contactRouter.post(
  "/:id/customer-reply",
  CheckAuth,
  validateParamsSchema(idParamsSchema),
  validateBodySchema(replySchema),
  customerReplyToContactMessage,
);

export default contactRouter;