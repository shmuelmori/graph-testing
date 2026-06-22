export type TimeRange = '7d' | '30d' | '90d' | '1y'

export type User = {
  id: string
  name: string
  email: string
  country: string
  subscription: string
  status: string
  registrationDate: string
  lastLogin: string
  avgActivityMinutes: number
  devices: string[]
  loginHistory: string[]
}
