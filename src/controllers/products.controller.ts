import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product.js";
import { errorResponse, noContentResponse, paginatedResponse, successResponse } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
import { getPaginationSkip, getTotalPages } from "../utils/pagination.js";
import { DEPARTMENTS } from "../types/models/product.js";
import { getNextSequence } from "../utils/counter.js";
import { Category } from "../models/category.js";
// _______________createproduct funtion________________
export async function createProduct(
    req:Request,
    res:Response,
    next:NextFunction,
): Promise<void>{
    try {
      const seq = await getNextSequence("productId");
      const productId = `PRD-${String(seq).padStart(5,"0")}`
        const product = await Product.create({
     ...req.body,
     authorId: req.user!._id,
     productId
        })
        successResponse(res, product,"Product created successfully !", StatusCodes.CREATED,);
      
    } catch (err) {
        next(err)
    }
    
}
// ____________________getProducts function______________________________________
const ALLOWED_SORT_FIELDS = ["createdAt", "price", "averageRating"] as const;

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { page, limit, sortBy, sortOrder } = req.parsedQuery as {
      page: number;
      limit: number;
      sortBy: string;
      sortOrder: 1 | -1;
    };

    const skip = getPaginationSkip(page, limit);

    const { search, department, departments, categoryId } = req.query as Record<string, string | undefined>;
    const filter: Record<string, unknown> = {};

    if (search) {
      const regex = { $regex: search, $options: "i" };

      // find categories whose name matches the search text too
      const matchingCategories = await Category.find({ name: regex }).select("_id");
      const matchingCategoryIds = matchingCategories.map((c) => c._id);

      filter.$or = [
        { name: regex },
        { description: regex },
        { brand: regex },
        { productId: regex },
        ...(matchingCategoryIds.length > 0 ? [{ categoryId: { $in: matchingCategoryIds } }] : []),
      ];
    }

    if (departments) {
      const departmentList = departments.split(",");
      filter.department = { $in: departmentList };
    } else if (department) {
      filter.department = department;
    }

    if (categoryId) filter.categoryId = categoryId;

    const sortField = (ALLOWED_SORT_FIELDS as readonly string[]).includes(sortBy)
      ? sortBy
      : "createdAt";
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const totalCount = await Product.countDocuments(filter);
    const totalPages = getTotalPages(totalCount, limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("authorId", "-password")
      .populate("categoryId");

    paginatedResponse(res, products, {
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
}
// ________________getProdut function______________________________
export async function getProduct (
    req:Request ,
   res:Response ,
   next:NextFunction,
):Promise<void> {
    try {
        const {id} = req.params;
    const product = await Product.findById(
        id,
        
    ).populate("authorId", "-password")
    .populate("categoryId")
    
    if(!product){
        errorResponse(res,"Product not found " , StatusCodes.NOT_FOUND)
        return
    }
    successResponse(res, product)
    
    } catch (err) {
     next(err)   
    }
}
// ________________________updateProduct__________________________________

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("authorId", "-password");

    if (!product) {
      errorResponse(res, "Product not found", StatusCodes.NOT_FOUND);
      return;
    }

    successResponse(res, product, "Product updated successfully!");
  } catch (err) {
    next(err);
  }
}

// ____________________deleteProduct function______________________________________
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      errorResponse(res, "Product not found", StatusCodes.NOT_FOUND);
      return;
    }

    noContentResponse(res);
  } catch (err) {
    next(err);
  }
}
// ______________________________________________get filters_____________________________
export async function getFilters(req:Request, res:Response, next:NextFunction){
  try {
    successResponse(res, {departments:DEPARTMENTS})
  } catch (err) {
    next(err)
  }
}