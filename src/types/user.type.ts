import { Business } from './business.type'

export type User = {
  name: string
  firstName: string
  lastName: string
  email: string
  businesses: Array<Business>
}
