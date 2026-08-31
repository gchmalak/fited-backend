import { model, Schema } from "mongoose";
const carouselSlideSchema = new Schema({ imageUrl: { type: String, required: true },
    ctaLink: { type: String, default: "/shop" },
    ctaText: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
export const CarouselSlide = model("CarouselSlide", carouselSlideSchema);
