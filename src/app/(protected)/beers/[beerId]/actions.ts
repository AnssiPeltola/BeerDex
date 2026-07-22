"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import {
  getUserBeerRating,
  updateUserBeerRating,
} from "@/repositories/beer.repository";

export async function setBeerRating(beerId: number, rating: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Ensure the user owns this beer before allowing a rating
  const existingRating = await getUserBeerRating(session.user.id, beerId);

  if (existingRating === undefined) {
    throw new Error("Beer is not in user collection");
  }

  await updateUserBeerRating(session.user.id, beerId, rating);

  // Refresh this beer page so the new rating and average rating update
  revalidatePath(`/beers/${beerId}`);
}
