import { NextFunction, Request, Response } from "express";
import { NewsletterSubscriber } from "../models/newsletter.js";
import { errorResponse, successResponse } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../utils/email.js";

export async function subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;

    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      errorResponse(res, "This email is already subscribed", StatusCodes.CONFLICT);
      return;
    }

    const subscriber = await NewsletterSubscriber.create({ email });
    successResponse(res, subscriber, "Subscribed successfully!", StatusCodes.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function getAllSubscribers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    successResponse(res, subscribers);
  } catch (err) {
    next(err);
  }
}


export async function sendBroadcast(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { subject, message } = req.body;

    const subscribers = await NewsletterSubscriber.find();

    if (subscribers.length === 0) {
      errorResponse(res, "No subscribers to send to", StatusCodes.BAD_REQUEST);
      return;
    }

    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        sendEmail({
          to: sub.email,
          subject,
          html: `<div>${message.replace(/\n/g, "<br>")}</div>`,
        }),
      ),
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    successResponse(res, { sent, failed, total: subscribers.length }, "Broadcast sent!");
  } catch (err) {
    next(err);
  }
}