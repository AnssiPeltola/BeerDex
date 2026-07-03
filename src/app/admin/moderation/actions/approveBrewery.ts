"use server";

import { db } from "@/db";
import { breweries } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { eq } from "drizzle-orm";

export async function approveBrewery(formData: FormData) {
  const session = await requireAdmin();
  const adminId = session.user.id;
  const breweryId = Number(formData.get("breweryId"));
  const name = String(formData.get("name") ?? "");
  const countryId = Number(formData.get("countryId"));

  if (!Number.isInteger(breweryId)) {
    throw new Error("Invalid brewery id");
  }

  if (!Number.isInteger(countryId)) {
    throw new Error("Invalid country id");
  }

  await db
    .update(breweries)
    .set({
      name,
      countryId,
      status: "approved",
      verifiedAt: new Date(),
      verifiedByAdminId: adminId,
    })
    .where(eq(breweries.id, breweryId));
}
