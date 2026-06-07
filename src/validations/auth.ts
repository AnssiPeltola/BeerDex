import { z } from "zod";

// Zod Validations for registering new account. Check email, username and password with these options

export const registerUserSchema = z.object({
  email: z.email().trim().toLowerCase(),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
