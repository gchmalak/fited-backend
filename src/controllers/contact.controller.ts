import { NextFunction, Request, Response } from "express";
import { ContactMessage } from "../models/contact.js";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../utils/email.js";

export async function createContactMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const message = await ContactMessage.create(req.body);
    successResponse(res, message, "Message sent! We'll get back to you soon.", StatusCodes.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function getAllContactMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    successResponse(res, messages);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!message) {
      errorResponse(res, "Message not found", StatusCodes.NOT_FOUND);
      return;
    }
    successResponse(res, message, "Marked as read");
  } catch (err) {
    next(err);
  }
}


export async function replyToContactMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const message = await ContactMessage.findById(id);
    if (!message) {
      errorResponse(res, "Message not found", StatusCodes.NOT_FOUND);
      return;
    }

    await sendEmail({
      to: message.email,
      subject: `Re: ${message.subject}`,
      html: `<p>${reply.replace(/\n/g, "<br>")}</p><hr><p style="color:#888;font-size:12px;">In reply to your message: "${message.message}"</p>`,
    });

    message.reply = reply;
    message.repliedAt = new Date();
    message.isRead = true;
    await message.save();

    successResponse(res, message, "Reply sent!");
  } catch (err) {
    next(err);
  }
}