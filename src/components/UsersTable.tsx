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
    let active = true

    const loadUsers = async () => {
      if (!active) return
      setLoading(true)
      const r = await mockApi.fetchUsers({ q, page, pageSize })
      if (!active) return
      setItems(r.items as User[])
      setTotal(r.total)
      setLoading(false)
    }

    void loadUsers()
    return () => { active = false }
  }, [q, page, pageSize])

  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ position: 'relative' }}>
      <div className="controls">
        <input
          className="control-input"
          placeholder="Search by name, email, id"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
        <label htmlFor="page-size">Page size:</label>
        <select
          id="page-size"
          className="control-select"
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state">Loading users...</div>
      ) : (
        <>
          <div className="table-panel">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
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
                  <tr
                    key={u.id}
                    className={selected === u.id ? 'selected' : ''}
                    onClick={() => setSelected(u.id)}
                  >
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.country}</td>
                    <td>{u.subscription}</td>
                    <td>
                      <span className={`badge badge--${u.status}`}>{u.status}</span>
                    </td>
                    <td>{new Date(u.registrationDate).toLocaleDateString()}</td>
                    <td>{new Date(u.lastLogin).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <div className="pagination-meta">Showing {items.length} of {total}</div>
            <div className="pagination-actions">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              <span>Page {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>Next</button>
            </div>
          </div>
        </>
      )}

      <UserPanel userId={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
