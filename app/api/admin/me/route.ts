import type { NextRequest } from 'next/server'
import { handleApiError, json, requireAdminApi } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdminApi(req)
    return json({ admin })
  } catch (error) {
    return handleApiError(error, 'admin me')
  }
}
