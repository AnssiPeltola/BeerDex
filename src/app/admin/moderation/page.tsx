import { BeerModeration } from "./components/BeerModeration";
import { BeerStyleModeration } from "./components/BeerStyleModeration";
import { BreweryModeration } from "./components/BreweryModeration";
import { ModerationTabs } from "./components/ModerationTabs";

const validTabs = ["beers", "breweries", "styles"] as const;

type TabKey = (typeof validTabs)[number];

function getActiveTab(tab: string | undefined): TabKey {
  if (tab && validTabs.includes(tab as TabKey)) {
    return tab as TabKey;
  }

  return "beers";
}

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = getActiveTab(tab);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Moderation
        </h1>
        <p className="text-sm text-slate-600">Review pending content</p>
      </header>

      <ModerationTabs activeTab={activeTab} />

      {activeTab === "beers" && <BeerModeration />}
      {activeTab === "breweries" && <BreweryModeration />}
      {activeTab === "styles" && <BeerStyleModeration />}
    </div>
  );
}
