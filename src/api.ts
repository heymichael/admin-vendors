import { agentFetch } from '@haderach/shared-ui'

export interface UserSummary {
  email: string
  firstName: string
  lastName: string
  roles: string[]
  allowedDepartments: string[]
  allowedVendorIds: string[]
  deniedVendorIds: string[]
}

export interface Vendor {
  id: string
  name: string
  department?: string
}

export async function fetchUsers(
  getIdToken: () => Promise<string>,
): Promise<UserSummary[]> {
  const res = await agentFetch('/users', getIdToken)
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
  return res.json()
}

export async function fetchVendors(
  getIdToken: () => Promise<string>,
): Promise<Vendor[]> {
  const res = await agentFetch('/vendors', getIdToken)
  if (!res.ok) throw new Error(`Failed to fetch vendors: ${res.status}`)
  return res.json()
}

export async function updateUserAccess(
  email: string,
  fields: {
    allowedDepartments: string[]
    allowedVendorIds: string[]
    deniedVendorIds: string[]
  },
  getIdToken: () => Promise<string>,
): Promise<UserSummary> {
  const res = await agentFetch(`/users/${encodeURIComponent(email)}`, getIdToken, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `Update failed: ${res.status}`)
  }
  return res.json()
}
