"use server";

import { db } from "@/db";
import { breweries } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function rejectBrewery(formData: FormData) {
  const session = await requireAdmin();
  const adminId = session.user.id;
  const breweryId = Number(formData.get("breweryId"));

  if (!Number.isInteger(breweryId)) {
    throw new Error("Invalid brewery id");
  }

  await db
    .update(breweries)
    .set({
      status: "rejected",
      verifiedAt: new Date(),
      verifiedByAdminId: adminId,
    })
    .where(eq(breweries.id, breweryId));

  redirect("/admin/moderation?tab=breweries&toast=brewery-rejected");
}
