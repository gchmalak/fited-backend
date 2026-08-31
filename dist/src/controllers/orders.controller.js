import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { errorResponse, paginatedResponse, successResponse, } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
// _______________createOrder function________________
export async function createOrder(req, res, next) {
    try {
        const { fullName, phone, street, city, wilaya, postalCode, deliveryNotes, items, } = req.body;
        if (!items || items.length === 0) {
            errorResponse(res, "Your cart is empty", StatusCodes.BAD_REQUEST);
            return;
        }
        const orderItems = [];
        let totalPrice = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                errorResponse(res, "Product no longer exists", StatusCodes.BAD_REQUEST);
                return;
            }
            const variant = product.variants.find((v) => v._id?.toString() === item.variantId);
            if (!variant) {
                errorResponse(res, `Selected variant no longer exists for ${product.name}`, StatusCodes.BAD_REQUEST);
                return;
            }
            if (variant.stock < item.quantity) {
                errorResponse(res, `Not enough stock for ${product.name}`, StatusCodes.BAD_REQUEST);
                return;
            }
            const priceAtPurchase = product.price;
            orderItems.push({
                product: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                priceAtPurchase,
            });
            totalPrice += priceAtPurchase * item.quantity;
            // Decrement stock for purchased variant
            variant.stock -= item.quantity;
            await product.save();
        }
        const orderId = `FITTED-${Date.now()}`;
        const order = await Order.create({
            userId: req.user._id,
            orderId,
            items: orderItems,
            totalPrice,
            status: "pending",
            fullName,
            phone,
            street,
            city,
            wilaya,
            postalCode,
            deliveryNotes,
        });
        successResponse(res, order, "Order placed successfully!", StatusCodes.CREATED);
    }
    catch (err) {
        next(err);
    }
}
// _______________getMyOrders function________________
export async function getMyOrders(req, res, next) {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate({
            path: "items.product",
            select: "name images",
        });
        successResponse(res, orders);
    }
    catch (err) {
        next(err);
    }
}
// _______________getOrder function________________
export async function getOrder(req, res, next) {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate({
            path: "items.product",
            select: "name images",
        });
        if (!order) {
            errorResponse(res, "Order not found", StatusCodes.NOT_FOUND);
            return;
        }
        const isOwner = order.userId.toString() === req.user._id.toString();
        if (!isOwner && !req.user.isAdmin) {
            errorResponse(res, "Not authorized to view this order", StatusCodes.FORBIDDEN);
            return;
        }
        successResponse(res, order);
    }
    catch (err) {
        next(err);
    }
}
// _______________getAllOrders function (admin only)________________
export async function getAllOrders(req, res, next) {
    try {
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : undefined;
        const productName = typeof req.query.productName === "string"
            ? req.query.productName.trim()
            : undefined;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 20);
        const skip = (page - 1) * limit;
        const filter = {};
        // Search by Order ID
        if (search) {
            filter.orderId = {
                $regex: search,
                $options: "i",
            };
        }
        // Search orders containing a product with this name
        if (productName) {
            const products = await Product.find({
                name: {
                    $regex: productName,
                    $options: "i",
                },
            }).select("_id");
            const productIds = products.map((product) => product._id);
            // No products match the search
            if (productIds.length === 0) {
                paginatedResponse(res, [], {
                    totalCount: 0,
                    totalPages: 1,
                    currentPage: page,
                });
                return;
            }
            filter["items.product"] = {
                $in: productIds,
            };
        }
        const [orders, totalCount] = await Promise.all([
            Order.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("userId", "-password")
                .populate({
                path: "items.product",
                select: "name images",
            }),
            Order.countDocuments(filter),
        ]);
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));
        paginatedResponse(res, orders, {
            totalCount,
            totalPages,
            currentPage: page,
        });
    }
    catch (err) {
        next(err);
    }
}
// _______________updateOrderStatus function (admin only)________________
export async function updateOrderStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(id, { status }, {
            new: true,
            runValidators: true,
        }).populate({
            path: "items.product",
            select: "name images",
        });
        if (!order) {
            errorResponse(res, "Order not found", StatusCodes.NOT_FOUND);
            return;
        }
        successResponse(res, order, "Order status updated!");
    }
    catch (err) {
        next(err);
    }
}
