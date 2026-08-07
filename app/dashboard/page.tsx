import { Counter } from "./components/counter";
import { DashboardSummary } from "./components/dashboard-summary";

export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-8">
        <DashboardSummary />
      </div>
      <Counter></Counter>
    </section>
  )
}
