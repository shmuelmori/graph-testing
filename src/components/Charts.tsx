import { useEffect, useState } from 'react'
import mockApi from '../services/mockApi'

type ChartData = { registrations: { date: string; count: number }[]; countries: Record<string, number>; bySub: Record<string, number> }

export default function Charts() {
  const [data, setData] = useState<ChartData | null>(null)

  useEffect(() => {
    mockApi.fetchChartData().then(d => setData(d as ChartData))
  }, [])

  if (!data) return <div>Loading charts...</div>

  return (
    <div className="charts-row">
      <section className="chart-panel">
        <h3>Registrations (30d)</h3>
        <MiniBarChart data={data.registrations} />
      </section>

      <section className="chart-panel">
        <h3>By Country</h3>
        <ul className="chart-list">
          {Object.entries(data.countries as Record<string, number>).map(([k, v]) => (
            <li key={k}><span>{k}</span><strong>{v}</strong></li>
          ))}
        </ul>
      </section>

      <section className="chart-panel">
        <h3>By Subscription</h3>
        <ul className="chart-list">
          {Object.entries(data.bySub as Record<string, number>).map(([k, v]) => (
            <li key={k}><span>{k}</span><strong>{v}</strong></li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'end', height: 112, paddingLeft: 4 }}>
      {data.map(d => (
        <div
          key={d.date}
          title={`${d.date}: ${d.count}`}
          style={{
            flex: 1,
            minWidth: 6,
            height: `${(d.count / max) * 100}%`,
            background: 'linear-gradient(180deg, #60a5fa, #1d4ed8)',
            borderRadius: 999,
          }}
        />
      ))}
    </div>
  )
}
