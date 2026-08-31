import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.js";
import { errorResponse, paginatedResponse, successResponse, } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
import { getPaginationSkip, getTotalPages } from "../utils/pagination.js";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// _____________________getAllUsers______________________
export async function getAllUsers(req, res, next) {
    try {
        const { page, limit } = req.parsedQuery;
        const skip = getPaginationSkip(page, limit);
        const { role, search } = req.query;
        const filter = {};
        if (role === "admin" || role === "user") {
            filter.role = role;
        }
        if (search) {
            const regex = { $regex: search, $options: "i" };
            filter.$or = [{ username: regex }, { email: regex }];
        }
        const totalCount = await User.countDocuments(filter);
        const totalPages = getTotalPages(totalCount, limit);
        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        paginatedResponse(res, users, {
            totalCount,
            totalPages,
            currentPage: page,
        });
    }
    catch (err) {
        next(err);
    }
}
// _____________________updateUserRole______________________
export async function updateUserRole(req, res, next) {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select("-password");
        if (!user) {
            errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
            return;
        }
        successResponse(res, user, "User role updated!");
    }
    catch (err) {
        next(err);
    }
}
// _____________________deactivateUser______________________
export async function deactivateUser(req, res, next) {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true, runValidators: true }).select("-password");
        if (!user) {
            errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
            return;
        }
        successResponse(res, user, "User deactivated!");
    }
    catch (err) {
        next(err);
    }
}
// _____________________reactivateUser______________________
export async function reactivateUser(req, res, next) {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { isActive: true }, { new: true, runValidators: true }).select("-password");
        if (!user) {
            errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
            return;
        }
        successResponse(res, user, "User reactivated!");
    }
    catch (err) {
        next(err);
    }
}
// _______________________UPDATE PROFILE PICTURE_________________________________
export async function updateProfilePicture(req, res, next) {
    try {
        const { avatarUrl } = req.body;
        if (!avatarUrl) {
            errorResponse(res, "Profile picture URL is required", StatusCodes.BAD_REQUEST);
            return;
        }
        const user = await User.findByIdAndUpdate(req.user._id, { avatarUrl }, { new: true, runValidators: true }).select("-password");
        if (!user) {
            errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
            return;
        }
        successResponse(res, user, "Profile picture updated successfully");
    }
    catch (error) {
        next(error);
    }
}
