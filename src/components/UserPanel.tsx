import { useEffect, useState } from 'react'
import mockApi from '../services/mockApi'
import type { User } from '../types'

export default function UserPanel({ userId, onClose }: { userId: string | null; onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!userId) return
    let mounted = true
    // fetchUserById returns unknown via default export types; cast to User | undefined
    // @ts-expect-error allow potential undefined
    mockApi.fetchUserById(userId).then((u: User | undefined) => { if (mounted) setUser(u ?? null) })
    return () => { mounted = false }
  }, [userId])

  if (!userId) return null
  if (!user) return <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 360, background: '#fff', borderLeft: '1px solid #ddd', padding: 12 }}>Loading...</div>

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 360, background: '#fff', borderLeft: '1px solid #ddd', padding: 12, overflow: 'auto' }}>
      <button onClick={onClose}>Close</button>
      <h3>{user.name}</h3>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Country:</strong> {user.country}</div>
      <div><strong>Subscription:</strong> {user.subscription}</div>
      <div><strong>Status:</strong> {user.status}</div>
      <div><strong>Registered:</strong> {new Date(user.registrationDate).toLocaleString()}</div>
      <div style={{ marginTop: 12 }}>
        <h4>Recent Logins</h4>
        <ul>
          {user.loginHistory.slice(0, 10).map((d: string, i: number) => <li key={i}>{new Date(d).toLocaleString()}</li>)}
        </ul>
      </div>
    </div>
  )
}
