import { NextFunction, Request, Response } from "express";
import { ContactMessage } from "../models/contact.js";
import {
  errorResponse,
  successResponse,
} from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../utils/email.js";

export async function createContactMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      isRead: false,

      // First message in the conversation
      messages: [
        {
          sender: "customer",
          message,
          createdAt: new Date(),
        },
      ],
    });

    successResponse(
      res,
      contactMessage,
      "Message sent! We'll get back to you soon.",
      StatusCodes.CREATED,
    );
  } catch (err) {
    next(err);
  }
}

export async function getAllContactMessages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const messages = await ContactMessage.find().sort({
      updatedAt: -1,
    });

    successResponse(res, messages);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );

    if (!message) {
      errorResponse(
        res,
        "Message not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    successResponse(res, message, "Marked as read");
  } catch (err) {
    next(err);
  }
}

export async function replyToContactMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const contactMessage = await ContactMessage.findById(id);

    if (!contactMessage) {
      errorResponse(
        res,
        "Message not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    // Get the original customer message
    const originalMessage =
      contactMessage.messages.find(
        (msg) => msg.sender === "customer",
      )?.message ?? "";

    // Send the admin reply by email
    await sendEmail({
      to: contactMessage.email,
      subject: `Re: ${contactMessage.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>${reply.replace(/\n/g, "<br>")}</p>

          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />

          <p style="color: #888; font-size: 12px;">
            In reply to your message:
          </p>

          <p style="color: #666; font-size: 13px;">
            "${originalMessage}"
          </p>
        </div>
      `,
    });

    // Add the admin reply to the existing conversation
    contactMessage.messages.push({
      sender: "admin",
      message: reply.trim(),
      createdAt: new Date(),
    });

    // Conversation is considered read after admin replies
    contactMessage.isRead = true;

    await contactMessage.save();

    successResponse(
      res,
      contactMessage,
      "Reply sent!",
    );
  } catch (err) {
    next(err);
  }
}
// _________________________________________________
export async function getMyContactMessages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const email = req.user?.email;

    if (!email) {
      errorResponse(
        res,
        "User email not found",
        StatusCodes.UNAUTHORIZED,
      );
      return;
    }

    const messages = await ContactMessage.find({
      email: email.toLowerCase(),
    }).sort({
      updatedAt: -1,
    });

    successResponse(res, messages);
  } catch (err) {
    next(err);
  }
}
// __________________________________________________________
export async function customerReplyToContactMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const email = req.user?.email;

    if (!email) {
      errorResponse(
        res,
        "User email not found",
        StatusCodes.UNAUTHORIZED,
      );
      return;
    }

    const contactMessage = await ContactMessage.findById(id);

    if (!contactMessage) {
      errorResponse(
        res,
        "Conversation not found",
        StatusCodes.NOT_FOUND,
      );
      return;
    }

    // Make sure this conversation belongs to the logged-in customer
    if (contactMessage.email.toLowerCase() !== email.toLowerCase()) {
      errorResponse(
        res,
        "You are not allowed to reply to this conversation",
        StatusCodes.FORBIDDEN,
      );
      return;
    }

    // Add customer reply to the existing conversation
    contactMessage.messages.push({
      sender: "customer",
      message: reply.trim(),
      createdAt: new Date(),
    });

    // Admin needs to see this as unread
    contactMessage.isRead = false;

    await contactMessage.save();

    successResponse(
      res,
      contactMessage,
      "Reply sent!",
    );
  } catch (err) {
    next(err);
  }
}