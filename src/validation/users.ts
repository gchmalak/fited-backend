import z from "zod";

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
export const loginSchema = z.object({
    email:z.email("Email must be valid").trim().toLowerCase(),
    password:z.string().regex(passwordRegex, "Password isn't strong enough"),

})


export const userSchema = loginSchema.extend({
    username:z.string()
    .min(3,"Username must have at least 3 characters")
    .max(50, "Username must have at most 50 characters")
    .trim(),
    avatarUrl:z
    .url("Avatar must be a valid url")
    .optional()
    .transform((val)=>val ?? undefined),
    bio:z
    .string()
    .max(300,"Bio must be at most 300 characters long")
    .optional()
    .transform((val) =>  val ?? undefined)
    // i need to add phone number
})

export const registrationSchema = userSchema.extend({
    role: z.enum(["admin","user"]),
    adminCode:z.string().min(6,"Admin code must at least be 6 characters long").optional()
})
export const updateUserRoleSchema = z.object({
  role: z.enum(["admin", "user"]),
});

// _____________change password____________________________________________
// ______________modify password___________________________________________
