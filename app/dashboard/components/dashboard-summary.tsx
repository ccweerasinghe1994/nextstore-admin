async function getSummary() {
  // simulate an API call
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    products: 24,
    orders: 182,
    revenue: 15340,
  };
}

export async function DashboardSummary() {
  const summary = await getSummary();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SummaryCard label="Products" value={summary.products} />
      <SummaryCard label="Orders" value={summary.orders} />
      <SummaryCard
        label="Revenue"
        value={`$${summary.revenue.toLocaleString()}`}
      />
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  value: string | number;
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <article className="rounded-lg border border-border bg-surface p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </article>
  );
}
