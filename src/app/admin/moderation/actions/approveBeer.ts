"use server";

import { db } from "@/db";
import { beers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { eq } from "drizzle-orm";

function getNullableString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  return value;
}

function getNullableInt(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? null : parsed;
}

export async function approveBeer(formData: FormData) {
  const session = await requireAdmin();
  const adminId = session.user.id;
  const beerId = Number(formData.get("beerId"));

  if (!Number.isInteger(beerId)) {
    throw new Error("Invalid beer id");
  }

  const name = String(formData.get("name") ?? "");
  const abv = getNullableString(formData, "abv");
  const ibu = getNullableInt(formData, "ibu");
  const ebu = getNullableInt(formData, "ebu");
  const ebc = getNullableInt(formData, "ebc");
  const volumeMl = getNullableInt(formData, "volumeMl");
  const eanBarcode = getNullableString(formData, "eanBarcode");

  await db
    .update(beers)
    .set({
      name,
      abv,
      ibu,
      ebu,
      ebc,
      volumeMl,
      eanBarcode,
      status: "approved",
      verifiedAt: new Date(),
      verifiedByAdminId: adminId,
    })
    .where(eq(beers.id, beerId));
}
