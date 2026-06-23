import { getBeerStyles } from "@/repositories/beer-style.repository";
import { db } from "@/db";
import { beerStyles } from "@/db/schema";
import { sql } from "drizzle-orm";
import { createBeerStyleSchema } from "@/validations/beer-style";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const styles = await getBeerStyles();

    return Response.json(styles);
  } catch {
    return Response.json(
      { error: "Failed to load beer styles" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const parsed = createBeerStyleSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name } = parsed.data;

    const cleanName = name.trim().toLowerCase();

    // duplicate check (case-insensitive)
    const existing = await db
      .select()
      .from(beerStyles)
      .where(sql`lower(${beerStyles.name}) = ${cleanName}`)
      .limit(1);

    if (existing.length > 0) {
      return Response.json(
        { error: "Beer style already exists" },
        { status: 409 },
      );
    }

    const [created] = await db
      .insert(beerStyles)
      .values({
        name: name.trim(),
        status: "pending",
        createdByUserId: session.user.id,
      })
      .returning({
        id: beerStyles.id,
        name: beerStyles.name,
        status: beerStyles.status,
      });

    return Response.json(created);
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
