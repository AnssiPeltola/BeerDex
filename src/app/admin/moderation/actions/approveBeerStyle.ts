"use server";

import { db } from "@/db";
import { beerStyles } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { eq } from "drizzle-orm";

export async function approveBeerStyle(formData: FormData) {
  const session = await requireAdmin();
  const adminId = session.user.id;
  const styleId = Number(formData.get("styleId"));
  const name = String(formData.get("name") ?? "");

  if (!Number.isInteger(styleId)) {
    throw new Error("Invalid style id");
  }

  await db
    .update(beerStyles)
    .set({
      name,
      status: "approved",
      verifiedAt: new Date(),
      verifiedByAdminId: adminId,
    })
    .where(eq(beerStyles.id, styleId));
}
