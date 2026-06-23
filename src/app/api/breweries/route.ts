import { db } from "@/db";
import { breweries } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getBreweriesByCountry } from "@/repositories/brewery.repository";
import { createBrewerySchema } from "@/validations/brewery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const countryIdParam = searchParams.get("countryId");

  if (!countryIdParam) {
    return Response.json({ error: "countryId is required" }, { status: 400 });
  }

  const countryId = Number(countryIdParam);

  if (Number.isNaN(countryId)) {
    return Response.json({ error: "Invalid countryId" }, { status: 400 });
  }

  const breweries = await getBreweriesByCountry(countryId);

  // DTO mapping (future-proof layer)
  const result = breweries.map((b) => ({
    id: b.id,
    name: b.name,
    status: b.status,
  }));

  return Response.json(result);
}

// Insert new brewery into database
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const parsed = createBrewerySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, countryId } = parsed.data;

    const cleanName = name.trim().toLowerCase();

    // duplicate check (case-insensitive)
    const existing = await db
      .select()
      .from(breweries)
      .where(
        and(
          sql`lower(${breweries.name}) = ${cleanName}`,
          eq(breweries.countryId, countryId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return Response.json(
        { error: "Brewery already exists" },
        { status: 409 },
      );
    }

    const [created] = await db
      .insert(breweries)
      .values({
        name: name.trim(),
        countryId,
        status: "pending",
        createdByUserId: session.user.id,
      })
      .returning({
        id: breweries.id,
        name: breweries.name,
        status: breweries.status,
      });

    return Response.json(created);
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
