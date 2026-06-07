import { registerUser } from "@/actions/auth/register";

// API route: Handles POST /api/auth/register — parses JSON, delegates to
// `registerUser`, and returns mapped HTTP status codes and JSON responses.

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        code: "INVALID_JSON",
        message: "Request body must be valid JSON",
      },
      { status: 400 },
    );
  }

  const result = await registerUser(payload);

  if (result.ok) {
    return Response.json(
      {
        ok: true,
        userId: result.userId,
      },
      { status: 201 },
    );
  }

  const statusByCode = {
    VALIDATION_ERROR: 400,
    EMAIL_IN_USE: 409,
    USERNAME_IN_USE: 409,
    INTERNAL_ERROR: 500,
  } as const;

  return Response.json(result, {
    status: statusByCode[result.code],
  });
}
