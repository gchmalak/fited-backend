import { model, Schema } from "mongoose";
import { ICarouselSlide } from "../types/models/carousel.js";

const carouselSlideSchema=new Schema<ICarouselSlide>(
   { imageUrl:{type:String, required:true},
     ctaLink:{type:String, default:"/shop"},
     ctaText:{type:String, required:true},
     order:{type:Number, default:0},
     isActive:{type:Boolean, default:true} 
},{timestamps:true}
)
export const CarouselSlide = model<ICarouselSlide>("CarouselSlide", carouselSlideSchema);