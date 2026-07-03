"use server";

import { db } from "@/db";
import { beerImages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { eq } from "drizzle-orm";

export async function rejectBeerImage(formData: FormData) {
  const session = await requireAdmin();
  const adminId = session.user.id;
  const imageId = Number(formData.get("imageId"));

  if (!Number.isInteger(imageId)) {
    throw new Error("Invalid image id");
  }

  await db
    .update(beerImages)
    .set({
      status: "rejected",
      verifiedAt: new Date(),
      verifiedByAdminId: adminId,
    })
    .where(eq(beerImages.id, imageId));
}
