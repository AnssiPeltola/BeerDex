"use server";

import { db } from "@/db";
import { beerStyles } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function rejectBeerStyle(formData: FormData) {
  const session = await requireAdmin();
  const adminId = session.user.id;
  const styleId = Number(formData.get("styleId"));

  if (!Number.isInteger(styleId)) {
    throw new Error("Invalid style id");
  }

  await db
    .update(beerStyles)
    .set({
      status: "rejected",
      verifiedAt: new Date(),
      verifiedByAdminId: adminId,
    })
    .where(eq(beerStyles.id, styleId));

  redirect("/admin/moderation?tab=styles&toast=style-rejected");
}
