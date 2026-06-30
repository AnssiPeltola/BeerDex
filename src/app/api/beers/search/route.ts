import { NextResponse } from "next/server";
import { beerSearchSchema } from "@/validations/beer-search";
import { searchBeers } from "@/repositories/beer.repository";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Parse + validate query params
    const parsed = beerSearchSchema.safeParse({
      q: searchParams.get("q"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { q, page, limit } = parsed.data;

    // 2. Call repository (business logic layer)
    const result = await searchBeers({
      q,
      page,
      limit,
    });

    // 3. Return clean DTO response
    return NextResponse.json(result);
  } catch (error) {
    console.error("Beer search API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
