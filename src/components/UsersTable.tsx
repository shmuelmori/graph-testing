import { useEffect, useState } from 'react'
import mockApi from '../services/mockApi'
import UserPanel from './UserPanel'
import type { User } from '../types'

export default function UsersTable() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [items, setItems] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    mockApi.fetchUsers({ q, page, pageSize }).then(r => {
      setItems(r.items as User[])
      setTotal(r.total)
      setLoading(false)
    })
  }, [q, page, pageSize])

  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input placeholder="Search by name, email, id" value={q} onChange={e => setQ(e.target.value)} />
        <label>Page size:</label>
        <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {loading ? <div>Loading users...</div> : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Subscription</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {items.map(u => (
                <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(u.id)}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.country}</td>
                  <td>{u.subscription}</td>
                  <td>{u.status}</td>
                  <td>{new Date(u.registrationDate).toLocaleDateString()}</td>
                  <td>{new Date(u.lastLogin).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <div>Showing {items.length} of {total}</div>
            <div>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              <span style={{ margin: '0 8px' }}>Page {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>Next</button>
            </div>
          </div>
        </>
      )}

      <UserPanel userId={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
