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
    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
      <div style={{ flex: 1 }}>
        <h3>Registrations (30d)</h3>
        <MiniBarChart data={data.registrations} />
      </div>
      <div style={{ width: 240 }}>
        <h3>By Country</h3>
        <ul>
          {Object.entries(data.countries as Record<string, number>).map(([k, v]) => <li key={k}>{k}: {v as number}</li>)}
        </ul>
      </div>
      <div style={{ width: 240 }}>
        <h3>By Subscription</h3>
        <ul>
          {Object.entries(data.bySub as Record<string, number>).map(([k, v]) => <li key={k}>{k}: {v as number}</li>)}
        </ul>
      </div>
    </div>
  )
}

function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'end', height: 80 }}>
      {data.map(d => (
        <div key={d.date} title={`${d.date}: ${d.count}`} style={{ width: 6, height: `${(d.count / max) * 100}%`, background: '#3b82f6' }}></div>
      ))}
    </div>
  )
}
