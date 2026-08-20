import { NextFunction, Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/responseFormatter";
import { CarouselSlide } from "../models/carousel";
import { StatusCodes } from "http-status-codes";

// ____________fetching  active slides sorted by order ___________________________
export async function getActiveSlides(req:Request, res:Response, next:NextFunction):Promise<void>{
    try {
        const slides = await CarouselSlide.find({isActive:true}).sort({order:1})
        successResponse(res, slides, "Active carousel slides fetched") 
    } catch (error) {
        next(error)
    }
}
// ______________________fetching  all slides (active + hidden________________________
export async function getAllslides(req:Request, res:Response, next:NextFunction):Promise<void>{
    try {
       const slides = await CarouselSlide.find().sort({order:1});
       successResponse(res, slides, "All carousel slides fetched successfully ") 
    } catch (error) {
        next(error)
    }
}
// __________________admin  creating new slide____________________________
export async function createSlide(req:Request, res:Response, next:NextFunction):Promise<void>{
    try {
      const{imageUrl, ctaLink, ctaText,order,isActive} =req.body;
      const slide = new CarouselSlide({
        imageUrl,
        ctaLink,
        ctaText,
        order: order ?? 0,
        isActive: isActive ?? true,
      })  
      await slide.save()
      successResponse(res, slide,"Carousel slide created successfully ", StatusCodes.CREATED)
    } catch (error) {
       next(error) 
    }
}
// _______________________admin updating existing slide_____________________________
export async function updateSlide(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const slide = await CarouselSlide.findByIdAndUpdate(req.params.id, req.body, {new:true})
        if(!slide){
            errorResponse(res, "Carousel slide not found", StatusCodes.NOT_FOUND)
            return
        }
        successResponse(res, slide, "carousel slide updated successfully")
    } catch (error) {
        next(error)
    }
    
}
// __________________admin deletin slide____________________________________
export async function deleteSlide(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slide = await CarouselSlide.findByIdAndDelete(req.params.id);
    if (!slide) {
      errorResponse(res, "Carousel slide not found", StatusCodes.NOT_FOUND);
      return;
    }
    successResponse(res, null, "Carousel slide deleted successfully");
  } catch (err) {
    next(err);
  }
}