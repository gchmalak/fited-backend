import crypto from "crypto";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse, } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";
// _______________________LOGIN_________________________________________________________________
export async function login(req, res, next) {
    const { password, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            errorResponse(res, "Invalid email or password", StatusCodes.UNAUTHORIZED);
            return;
        }
        const valid = await user.comparePassword(password);
        if (!valid) {
            errorResponse(res, "Invalid email or password", StatusCodes.UNAUTHORIZED);
            return;
        }
        if (!user.isActive) {
            errorResponse(res, "Your account has been deactivated", StatusCodes.FORBIDDEN);
            return;
        }
        // Information stored inside the JWT
        const userInfo = {
            id: user._id.toString(),
            role: user.role,
        };
        const token = jwt.sign(userInfo, process.env.AUTH_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY || "7d",
        });
        // User information sent to the frontend
        // Password is intentionally NOT included
        const userObj = {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            role: user.role,
            isActive: user.isActive,
        };
        successResponse(res, userObj, "Login successful", StatusCodes.OK, token);
    }
    catch (error) {
        next(error);
    }
}
// _______________________REGISTER_________________________________________________________________
export async function register(req, res, next) {
    const { username, email, password, phoneNumber, avatarUrl, bio, } = req.body;
    try {
        const createdUser = new User({
            username,
            email,
            password,
            phoneNumber,
            avatarUrl,
            bio,
            role: "user",
        });
        await createdUser.save();
        // Information stored inside the JWT
        const userInfo = {
            id: createdUser._id.toString(),
            role: createdUser.role,
        };
        const token = jwt.sign(userInfo, process.env.AUTH_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY || "7d",
        });
        // User information sent to the frontend
        const userObj = {
            _id: createdUser._id.toString(),
            username: createdUser.username,
            email: createdUser.email,
            phoneNumber: createdUser.phoneNumber,
            avatarUrl: createdUser.avatarUrl,
            bio: createdUser.bio,
            role: createdUser.role,
            isActive: createdUser.isActive,
        };
        successResponse(res, userObj, "Registration successful", StatusCodes.CREATED, token);
    }
    catch (error) {
        next(error);
    }
}
// ___________________CHECKUSER_________________________________________________________________
export async function checkUser(req, res, next) {
    const user = req.user;
    try {
        if (!user) {
            throw new Error("User not found");
        }
        successResponse(res, user, "User is authenticated");
    }
    catch (error) {
        next(error);
    }
}
// _______________________CHANGE PASSWORD (logged in)_________________________________
export async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
            return;
        }
        const valid = await user.comparePassword(currentPassword);
        if (!valid) {
            errorResponse(res, "Current password is incorrect", StatusCodes.UNAUTHORIZED);
            return;
        }
        user.password = newPassword;
        await user.save();
        successResponse(res, null, "Password changed successfully");
    }
    catch (error) {
        next(error);
    }
}
// _______________________FORGOT PASSWORD (request reset email)_________________________________
export async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        // Don't reveal whether an account exists
        if (!user) {
            successResponse(res, null, "If that email exists, a reset link has been sent.");
            return;
        }
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");
        // Use update instead of save so unrelated required
        // fields such as phoneNumber are not revalidated.
        await User.findByIdAndUpdate(user._id, {
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
        });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;
        await sendEmail({
            to: user.email,
            subject: "Reset your FITD password",
            html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Reset your password</h2>

          <p>
            We received a request to reset your FITD account password.
            Click the button below to choose a new one.
            This link expires in 1 hour.
          </p>

          <a
            href="${resetLink}"
            style="
              display:inline-block;
              margin-top:16px;
              padding:12px 24px;
              background:#B89B5E;
              color:#fff;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:24px;color:#666;font-size:13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
        });
        successResponse(res, null, "If that email exists, a reset link has been sent.");
    }
    catch (error) {
        next(error);
    }
}
// _______________________RESET PASSWORD (using emailed token)_________________________________
export async function resetPassword(req, res, next) {
    try {
        const { token, newPassword } = req.body;
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await User.findOne({
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            errorResponse(res, "Reset link is invalid or has expired", StatusCodes.BAD_REQUEST);
            return;
        }
        // Hash the new password manually because we are using
        // findByIdAndUpdate instead of user.save().
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            // Invalidate the reset token after successful reset
            $unset: {
                resetPasswordTokenHash: 1,
                resetPasswordExpires: 1,
            },
        });
        successResponse(res, null, "Password reset successfully. You can now log in.");
    }
    catch (error) {
        next(error);
    }
}
