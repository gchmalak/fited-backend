import { Router } from "express";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import { getActiveSlides, getAllslides, createSlide, updateSlide, deleteSlide, } from "../controllers/carousel.controller.js";
import { validateBodySchema } from "../middlewares/validation.js";
import { createSlideSchema, updateSlideSchema } from "../validation/carousel.js";
const carouselRouter = Router();
// Public route for landing page/hero
carouselRouter.get("/public", getActiveSlides);
// Admin-protected routes
carouselRouter.get("/", CheckAuth, isAdmin, getAllslides);
carouselRouter.post("/", CheckAuth, isAdmin, validateBodySchema(createSlideSchema), createSlide);
carouselRouter.put("/:id", CheckAuth, isAdmin, validateBodySchema(updateSlideSchema), updateSlide);
carouselRouter.delete("/:id", CheckAuth, isAdmin, deleteSlide);
export default carouselRouter;
