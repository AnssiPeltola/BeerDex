"use server";

import { db } from "@/db";
import { beers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { eq } from "drizzle-orm";

export async function rejectBeer(formData: FormData) {
  const session = await requireAdmin();
  const adminId = session.user.id;
  const beerId = Number(formData.get("beerId"));

  if (!Number.isInteger(beerId)) {
    throw new Error("Invalid beer id");
  }

  await db
    .update(beers)
    .set({
      status: "rejected",
      verifiedAt: new Date(),
      verifiedByAdminId: adminId,
    })
    .where(eq(beers.id, beerId));
}
