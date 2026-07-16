type Props = {
  collected: number;
  total: number;
};

export default function BeerCollectionProgress({ collected, total }: Props) {
  const percentage = total === 0 ? 0 : Math.round((collected / total) * 100);

  const remaining = Math.max(total - collected, 0);

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Beer Collection</h2>

      <p className="mt-2 text-sm text-slate-500">
        {collected} of {total} beers collected
      </p>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span>{percentage}% complete</span>
        <span>{remaining} remaining</span>
      </div>
    </section>
  );
}
