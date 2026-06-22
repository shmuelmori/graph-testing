type Summary = { totalUsers: number; activeUsers: number; newUsers30d: number; avgActivityMinutes: number }

export default function SummaryCards({ summary, loading }: { summary: Summary | null; loading: boolean }) {
  if (loading) return <div>Loading summary...</div>
  if (!summary) return <div>No summary available</div>

  return (
    <div className="summary-grid">
      <Card title="Total Users" value={summary.totalUsers} />
      <Card title="Active Users" value={summary.activeUsers} />
      <Card title="New Users (30d)" value={summary.newUsers30d} />
      <Card title="Avg Activity" value={`${summary.avgActivityMinutes} min`} />
    </div>
  )
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
    </div>
  )
}
