import { Document } from "mongoose";

export interface IEditorial {
  slot: "editorial-1" | "editorial-2";
  image1Url: string;
  image2Url?: string;
  heading: string;
  subheading?: string;
  discoverHref?: string;
}

export type EditorialDocument = Document & IEditorial;