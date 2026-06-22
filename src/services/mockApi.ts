import type { User, TimeRange } from '../types'

function rand(from: number, to: number) {
  return Math.floor(Math.random() * (to - from + 1)) + from
}

const COUNTRIES = ['US', 'CA', 'GB', 'DE', 'FR', 'IN', 'BR', 'AU']
const SUBSCRIPTIONS = ['free', 'pro', 'enterprise']
const STATUSES = ['active', 'inactive', 'suspended']

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function generateUsers(count = 250) {
  const users: User[] = []
  for (let i = 1; i <= count; i++) {
    const country = COUNTRIES[rand(0, COUNTRIES.length - 1)]
    const subscription = SUBSCRIPTIONS[rand(0, SUBSCRIPTIONS.length - 1)]
    const status = Math.random() < 0.8 ? 'active' : STATUSES[rand(1, STATUSES.length - 1)]
    const registeredDays = rand(1, 365 * 2)
    const lastLoginDays = Math.random() < 0.9 ? rand(0, registeredDays) : registeredDays + rand(1, 120)
    const avgActivityMin = rand(2, 120)

    users.push({
      id: `u-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      country,
      subscription,
      status,
      registrationDate: daysAgo(registeredDays),
      lastLogin: daysAgo(lastLoginDays),
      avgActivityMinutes: avgActivityMin,
      devices: ['web', Math.random() < 0.5 ? 'mobile' : ''],
      loginHistory: Array.from({ length: rand(1, 10) }).map(() => daysAgo(rand(0, registeredDays))),
    })
  }
  return users
}

const USERS = generateUsers()

export type Summary = {
  totalUsers: number
  activeUsers: number
  newUsers30d: number
  avgActivityMinutes: number
}

export function fetchUsers({
  q,
  country,
  status,
  subscription,
  page = 1,
  pageSize = 20,
}: {
  q?: string
  country?: string
  status?: string
  subscription?: string
  page?: number
  pageSize?: number
}) {
  return new Promise<{ items: User[]; total: number }>((resolve) => {
    setTimeout(() => {
      let items = USERS.slice()
      if (q) {
        const qq = q.toLowerCase()
        items = items.filter(u => u.name.toLowerCase().includes(qq) || u.email.toLowerCase().includes(qq) || u.id.includes(qq))
      }
      if (country) items = items.filter(u => u.country === country)
      if (status) items = items.filter(u => u.status === status)
      if (subscription) items = items.filter(u => u.subscription === subscription)
      const total = items.length
      const start = (page - 1) * pageSize
      const paged = items.slice(start, start + pageSize)
      resolve({ items: paged, total })
    }, 300)
  })
}

export function fetchSummary(range: TimeRange = '30d'): Promise<Summary> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalUsers = USERS.length
      const activeUsers = USERS.filter(u => u.status === 'active').length
      const cutoff = (() => {
        const d = new Date()
        if (range === '7d') d.setDate(d.getDate() - 7)
        if (range === '30d') d.setDate(d.getDate() - 30)
        if (range === '90d') d.setDate(d.getDate() - 90)
        if (range === '1y') d.setFullYear(d.getFullYear() - 1)
        return d
      })()
      const newUsers30d = USERS.filter(u => new Date(u.registrationDate) >= cutoff).length
      const avgActivityMinutes = Math.round(USERS.reduce((s, u) => s + u.avgActivityMinutes, 0) / USERS.length)
      resolve({ totalUsers, activeUsers, newUsers30d, avgActivityMinutes })
    }, 200)
  })
}

export function fetchChartData() {
  // Minimal chart-ready aggregates
  return new Promise(resolve => {
    setTimeout(() => {
      const countries = {} as Record<string, number>
      const bySub = {} as Record<string, number>
      const registrations: { date: string; count: number }[] = []
      for (const u of USERS) {
        countries[u.country] = (countries[u.country] || 0) + 1
        bySub[u.subscription] = (bySub[u.subscription] || 0) + 1
      }
      // registrations over 30 days
      for (let i = 30; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().slice(0, 10)
        registrations.push({ date: key, count: USERS.filter(u => u.registrationDate.slice(0,10) === key).length })
      }
      resolve({ countries, bySub, registrations })
    }, 200)
  })
}

export default {
  fetchUsers,
  fetchSummary,
  fetchChartData,
  fetchUserById: (id: string) => new Promise(resolve => {
    setTimeout(() => {
      const user = USERS.find(u => u.id === id)
      resolve(user)
    }, 150)
  }),
}
