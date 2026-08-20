import { Model, Types } from "mongoose";

export interface ICarouselSlide{
    _id?:Types.ObjectId;
    imageUrl:string;
    ctaText: string;//call to action text 
    ctaLink: string; //the call to action button :explore collection 
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

}
export type CarouselSlideDocument = ICarouselSlide & Document ;
export type CarouselSlideModel = Model<CarouselSlideDocument>