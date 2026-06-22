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
    <div style={{ padding: 16 }}>
      <h1>User Analytics Dashboard</h1>
      <div style={{ marginBottom: 12 }}>
        <label>Time Range: </label>
        <select value={range} onChange={e => setRange(e.target.value as TimeRange)}>
          <option value="7d">7d</option>
          <option value="30d">30d</option>
          <option value="90d">90d</option>
          <option value="1y">1y</option>
        </select>
      </div>

      <SummaryCards summary={summary} loading={!summary} />
      <Charts />
      <Alerts />

      <section style={{ marginTop: 24 }}>
        <h2>Users</h2>
        <UsersTable />
      </section>
    </div>
  )
}
