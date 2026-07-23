import type { PublicProperty } from '../types'

const BASE_URL = "https://api.lumbinirentals.kritishbhattarai.com.np"

export type ResponseType = {
    data: PublicProperty[]
    success: boolean
}

 // Helper to keep error handling consistent across all calls
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `Request failed with status ${res.status}`)
  }
  return res.json()
}

// GET /api/properties/admin
export async function getPublicProperties(): Promise<ResponseType> {
  const res = await fetch(`${BASE_URL}/api/properties`, { 
    cache: 'no-store'
  })
  return handleResponse<ResponseType>(res)
}


