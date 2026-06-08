import { verifyPassword } from "@/lib/auth/password";
import { findUserByIdentifier } from "@/repositories/userRepository";
import { loginUserSchema } from "@/validations/auth";

type LoginErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "INTERNAL_ERROR";

export type LoginUserResult =
  | {
      ok: true;
      user: {
        id: string;
        email: string;
        username: string;
        role: "user" | "admin";
      };
    }
  | {
      ok: false;
      code: LoginErrorCode;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function authenticateUser(
  input: unknown,
): Promise<LoginUserResult> {
  const parsed = loginUserSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Invalid login input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { identifier, password } = parsed.data;

  try {
    const user = await findUserByIdentifier(identifier);

    if (!user) {
      return {
        ok: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email/username or password",
      };
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        ok: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email/username or password",
      };
    }

    return {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  } catch {
    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: "Failed to authenticate user",
    };
  }
}
