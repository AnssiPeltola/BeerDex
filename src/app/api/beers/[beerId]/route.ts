import { NextResponse } from "next/server";
import { getBeerDetails } from "@/repositories/beer.repository";

type RouteContext = {
  params: {
    beerId: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const beerId = Number.parseInt(params.beerId, 10);

    if (!Number.isInteger(beerId) || beerId < 1) {
      return NextResponse.json(
        { error: "Invalid beerId parameter" },
        { status: 400 },
      );
    }

    const beer = await getBeerDetails(beerId);

    if (!beer) {
      return NextResponse.json({ error: "Beer not found" }, { status: 404 });
    }

    return NextResponse.json(beer);
  } catch (error) {
    console.error("Beer details API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
