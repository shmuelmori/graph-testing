type Summary = { totalUsers: number; activeUsers: number; newUsers30d: number; avgActivityMinutes: number }

export default function SummaryCards({ summary, loading }: { summary: Summary | null; loading: boolean }) {
  if (loading) return <div>Loading summary...</div>
  if (!summary) return <div>No summary available</div>

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Card title="Total Users">{summary.totalUsers}</Card>
      <Card title="Active Users">{summary.activeUsers}</Card>
      <Card title="New Users (range)">{summary.newUsers30d}</Card>
      <Card title="Avg Activity (min)">{summary.avgActivityMinutes}</Card>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6, minWidth: 160 }}>
      <div style={{ color: '#666', fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{children}</div>
    </div>
  )
}
