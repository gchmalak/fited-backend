import { Router } from "express";
import multer from "multer";
import { handleFileUpload } from "../controllers/upload.controller.js";
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    }
});
const uploadRouter = Router();
uploadRouter.post("/", upload.single("image"), handleFileUpload);
export default uploadRouter;
