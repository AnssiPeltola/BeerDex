import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserBeerCollection } from "@/repositories/beer.repository";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");

    const page = pageParam ? Number.parseInt(pageParam, 10) : DEFAULT_PAGE;

    if (Number.isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter" },
        { status: 400 },
      );
    }

    const result = await getUserBeerCollection(
      session.user.id,
      page,
      DEFAULT_PAGE_SIZE,
    );

    const totalPages = Math.max(
      1,
      Math.ceil(result.totalItems / DEFAULT_PAGE_SIZE),
    );

    return NextResponse.json({
      items: result.items,
      pagination: {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        totalItems: result.totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Beer collection API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
