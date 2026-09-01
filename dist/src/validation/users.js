import z from "zod";
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
// Algerian phone number
// Accepts:
// 0555123456
// 0555 12 34 56
// 0555-12-34-56
// +213555123456
// +213 555 12 34 56
// 00213555123456
const algerianPhoneRegex = /^(?:(?:\+213|00213)[5-7]\d{8}|0[5-7]\d{8})$/;
export const loginSchema = z.object({
    email: z
        .email("Email must be valid")
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .regex(passwordRegex, "Password isn't strong enough"),
});
export const userSchema = loginSchema.extend({
    username: z
        .string()
        .min(3, "Username must have at least 3 characters")
        .max(50, "Username must have at most 50 characters")
        .trim(),
    phoneNumber: z
        .string()
        .trim()
        .transform((value) => value.replace(/[\s-]/g, ""))
        .refine((value) => algerianPhoneRegex.test(value), "Please enter a valid Algerian phone number")
        .transform((value) => {
        if (value.startsWith("0")) {
            return `+213${value.slice(1)}`;
        }
        if (value.startsWith("00213")) {
            return `+213${value.slice(5)}`;
        }
        return value;
    }),
    avatarUrl: z
        .url("Avatar must be a valid url")
        .optional()
        .transform((val) => val ?? undefined),
    bio: z
        .string()
        .max(300, "Bio must be at most 300 characters long")
        .optional()
        .transform((val) => val ?? undefined),
});
export const registrationSchema = userSchema;
export const updateUserRoleSchema = z.object({
    role: z.enum(["admin", "user"]),
});
// _____________ change password ____________________________________________
export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),
    newPassword: z
        .string()
        .regex(passwordRegex, "New password isn't strong enough"),
});
// ______________ modify password ___________________________________________
export const forgotPasswordSchema = z.object({
    email: z
        .email("Email must be valid")
        .trim()
        .toLowerCase(),
});
export const resetPasswordSchema = z.object({
    token: z
        .string()
        .min(1, "Token is required"),
    newPassword: z
        .string()
        .regex(passwordRegex, "New password isn't strong enough"),
});
