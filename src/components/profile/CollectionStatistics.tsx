type Props = {
  uniqueBreweries: number;
  uniqueCountries: number;
  uniqueStyles: number;
  averageAbv: number | null;
  strongestBeerAbv: number | null;
  weakestBeerAbv: number | null;
};

function formatAbv(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

export default function CollectionStatistics({
  uniqueBreweries,
  uniqueCountries,
  uniqueStyles,
  averageAbv,
  strongestBeerAbv,
  weakestBeerAbv,
}: Props) {
  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Collection Statistics
        </h2>

        <p className="text-sm text-slate-500">
          Insights from your collected beers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatItem label="Unique breweries" value={uniqueBreweries} />
        <StatItem label="Unique countries" value={uniqueCountries} />
        <StatItem label="Unique styles" value={uniqueStyles} />
        <StatItem label="Average ABV" value={formatAbv(averageAbv)} />
        <StatItem label="Strongest beer" value={formatAbv(strongestBeerAbv)} />
        <StatItem label="Weakest beer" value={formatAbv(weakestBeerAbv)} />
      </div>
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
