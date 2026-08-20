import { NextFunction, Request, Response } from "express";
import { Category } from "../models/category.js";
import { errorResponse, noContentResponse, successResponse } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
// ________________ create category_________________________________________________________________________
export async function createCategory(req:Request , res:Response, next:NextFunction):Promise<void> {
    try {
      const category = await Category.create(req.body)
      successResponse(res, category,"category created successfully", StatusCodes.CREATED)
    } catch (error) {
        next(error)
    }
    
}
// ____________________get categories______________________________________
export async function getCategories(req:Request,res:Response,next:NextFunction):Promise<void> {
    try {
        const categories = await Category.find();
        successResponse(res,categories)
    } catch (error) {
        next(error)
    }
    
}
// ___________________update category__________________________________________________
export async function updateCategory(req:Request,res:Response,next:NextFunction):Promise<void> {
try {
    const {id}=req.params
    const category = await Category.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,

    })
    if(!category){
        errorResponse(res,"Category not found",StatusCodes.NOT_FOUND)
        return
    }
    successResponse(res,category,"Category updated successfully ")

} catch (error) {
    next(error)
}    
}
// _____________________________________________________
export async function deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      errorResponse(res, "Category not found", StatusCodes.NOT_FOUND);
      return;
    }
    noContentResponse(res);
  } catch (error) {
    next(error);
  }
}
// ____________________________________________________________________
