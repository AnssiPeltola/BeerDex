import { hashPassword } from "@/lib/auth/password";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "@/repositories/userRepository";
import { registerUserSchema } from "@/validations/auth";

type RegisterErrorCode =
  | "VALIDATION_ERROR"
  | "EMAIL_IN_USE"
  | "USERNAME_IN_USE"
  | "INTERNAL_ERROR";

export type RegisterUserResult =
  | { ok: true; userId: string }
  | {
      ok: false;
      code: RegisterErrorCode;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function registerUser(
  input: unknown,
): Promise<RegisterUserResult> {
  const parsed = registerUserSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Invalid registration input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, username, password } = parsed.data;

  try {
    const existingByEmail = await findUserByEmail(email);

    if (existingByEmail) {
      return {
        ok: false,
        code: "EMAIL_IN_USE",
        message: "Email is already in use",
      };
    }

    const existingByUsername = await findUserByUsername(username);

    if (existingByUsername) {
      return {
        ok: false,
        code: "USERNAME_IN_USE",
        message: "Username is already in use",
      };
    }

    const passwordHash = await hashPassword(password);

    const createdUser = await createUser({
      email,
      username,
      passwordHash,
    });

    if (!createdUser) {
      return {
        ok: false,
        code: "INTERNAL_ERROR",
        message: "Failed to register user",
      };
    }

    return {
      ok: true,
      userId: createdUser.id,
    };
  } catch {
    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: "Failed to register user",
    };
  }
}
