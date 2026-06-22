import { useEffect, useState } from 'react'
import mockApi from '../services/mockApi'
import type { Summary } from '../services/mockApi'
import SummaryCards from '../components/SummaryCards'
import UsersTable from '../components/UsersTable'
import Charts from '../components/Charts'
import Alerts from '../components/Alerts'
import type { TimeRange } from '../types'

export default function Dashboard() {
  const [range, setRange] = useState<TimeRange>('30d')
  const [summary, setSummary] = useState<Summary | null>(null)

  useEffect(() => {
    let mounted = true
    mockApi.fetchSummary(range).then(s => { if (mounted) setSummary(s as Summary) })
    return () => { mounted = false }
  }, [range])

  return (
    <main className="dashboard-frame">
      <header className="dashboard-header">
        <div>
          <h1>User Analytics Dashboard</h1>
          <p className="dashboard-subtitle">A clear overview of user growth, activity, and retention in one place.</p>
        </div>
        <div className="dashboard-tools">
          <label htmlFor="range-select">Time range</label>
          <select
            id="range-select"
            value={range}
            onChange={e => setRange(e.target.value as TimeRange)}
          >
            <option value="7d">7d</option>
            <option value="30d">30d</option>
            <option value="90d">90d</option>
            <option value="1y">1y</option>
          </select>
        </div>
      </header>

      <section className="dashboard-panel">
        <SummaryCards summary={summary} loading={!summary} />
        <Charts />
        <Alerts />
      </section>

      <section className="dashboard-panel" style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
          <h2>Users</h2>
          <span className="metric-pill">Live user table</span>
        </div>
        <UsersTable />
      </section>
    </main>
  )
}
