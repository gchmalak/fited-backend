import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
console.log("Cloudinary env check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "exists" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "exists" : "MISSING",
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function handleFileUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No image file provided" });
      return;
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "fitted_store",
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
      message: "Image uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
}