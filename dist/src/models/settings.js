import { Schema, model } from "mongoose";
const settingsSchema = new Schema({
    defaultCare: {
        type: String,
        default: "Hand wash cold or dry clean. Do not tumble dry.",
    },
    defaultShipping: {
        type: String,
        default: "Standard delivery within 3-5 business days. Returns accepted within 14 days.",
    },
}, { timestamps: true });
export const Settings = model("Settings", settingsSchema);
