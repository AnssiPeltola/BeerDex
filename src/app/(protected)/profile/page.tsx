import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserBeerCollectionPreview,
  getApprovedBeerCount,
  getUserBeerCount,
} from "@/repositories/beer.repository";
import BeerCollectionPreview from "@/components/profile/BeerCollectionPreview";
import BeerCollectionProgress from "@/components/profile/BeerCollectionProgress";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return null;
  }

  const beers = await getUserBeerCollectionPreview(session.user.id);
  const collected = await getUserBeerCount(session.user.id);
  const total = await getApprovedBeerCount();

  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)] backdrop-blur sm:p-12">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
        Profile
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        My Profile
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Manage your account information, reviews, favorites and settings.
      </p>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Username {session.user.username} <br />
        User email {session.user.email} <br />
        User ID {session.user.id} <br />
        User role {session.user.role}
      </p>

      <BeerCollectionProgress collected={collected} total={total} />

      <BeerCollectionPreview beers={beers} />
    </section>
  );
}
