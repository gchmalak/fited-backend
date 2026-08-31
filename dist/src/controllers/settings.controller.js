import { Settings } from "../models/settings.js";
import { successResponse } from "../utils/responseFormatter.js";
export async function getSettings(req, res, next) {
    try {
        // Find existing settings or create the single default record
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        successResponse(res, settings);
    }
    catch (err) {
        next(err);
    }
}
export async function updateSettings(req, res, next) {
    try {
        const settings = await Settings.findOneAndUpdate({}, req.body, {
            new: true,
            upsert: true,
            runValidators: true,
        });
        successResponse(res, settings, "Settings updated successfully!");
    }
    catch (err) {
        next(err);
    }
}
