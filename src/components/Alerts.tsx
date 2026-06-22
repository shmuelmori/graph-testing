import { useEffect, useState } from 'react'
import mockApi from '../services/mockApi'

type Summary = { totalUsers: number; activeUsers: number; newUsers30d: number; avgActivityMinutes: number }
type ChartData = { registrations: { date: string; count: number }[]; countries: Record<string, number>; bySub: Record<string, number> }

export default function Alerts() {
  const [alerts, setAlerts] = useState<string[] | null>(null)

  useEffect(() => {
    Promise.all([mockApi.fetchSummary('30d'), mockApi.fetchChartData() as Promise<ChartData>]).then(([summary, charts]) => {
      const a: string[] = []
      const s = summary as Summary
      const c = charts as ChartData

      const manyInactive = (s.totalUsers - s.activeUsers) > s.totalUsers * 0.2
      if (manyInactive) a.push('Many users inactive (>20% of total) — check retention')

      const regs = c.registrations
      const avg = regs.reduce((s, r) => s + r.count, 0) / regs.length
      const last = regs[regs.length - 1]?.count ?? 0
      if (last > avg * 2) a.push('Spike in signups detected (today > 2x average)')

      if (s.activeUsers < s.newUsers30d) a.push('Active users lower than recent new users — investigate')

      setAlerts(a)
    })
  }, [])

  if (!alerts) return <div>Checking alerts...</div>
  if (alerts.length === 0) return <div>No alerts</div>
  return (
    <div className="alerts-panel">
      <h3>Alerts</h3>
      <ul>
        {alerts.map((a, i) => <li className="alert-item" key={i}>{a}</li>)}
      </ul>
    </div>
  )
}
