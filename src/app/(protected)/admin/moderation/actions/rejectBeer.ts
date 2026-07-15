"use server";

import { db } from "@/db";
import { beers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { eq } from "drizzle-orm";
import { ModerationActionState } from "./moderationActionState";

export async function rejectBeer(
  _prevState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
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

  return {
    success: true,
    message: "Beer rejected successfully.",
    status: "rejected",
  };
}
