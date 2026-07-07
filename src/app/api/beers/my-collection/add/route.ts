import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addBeerToUserCollection } from "@/repositories/beer.repository";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const beerId = Number((body as { beerId?: unknown }).beerId);

    if (!Number.isInteger(beerId) || beerId < 1) {
      return NextResponse.json({ error: "Invalid beerId" }, { status: 400 });
    }

    const result = await addBeerToUserCollection(session.user.id, beerId);

    if (result.status === "not_found") {
      return NextResponse.json({ error: "Beer not found" }, { status: 404 });
    }

    if (result.status === "already_exists") {
      return NextResponse.json(
        { error: "Beer already exists in collection" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        collectionEntry: result.entry,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add beer to collection API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
