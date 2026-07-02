import Link from "next/link";

const tabs = [
  { key: "beers", label: "Beers", href: "/admin/moderation?tab=beers" },
  {
    key: "breweries",
    label: "Breweries",
    href: "/admin/moderation?tab=breweries",
  },
  {
    key: "styles",
    label: "Beer Styles",
    href: "/admin/moderation?tab=styles",
  },
] as const;

type ModerationTabsProps = {
  activeTab: string;
};

export function ModerationTabs({ activeTab }: ModerationTabsProps) {
  return (
    <div className="border-b border-slate-200">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={
                isActive
                  ? "rounded-t-lg border border-b-0 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
                  : "rounded-t-lg border border-transparent px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900"
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
