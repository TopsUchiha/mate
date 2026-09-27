import type { NextRequest } from 'next/server'
import { handleApiError, json, requireAdminApi } from '@/lib/api'
import { listMessages } from '@/lib/messages'
import { messageListQuerySchema } from '@/lib/validation'

export async function GET(req: NextRequest) {
  try {
    await requireAdminApi(req)
    const query = messageListQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams))
    return json(await listMessages(query))
  } catch (error) {
    return handleApiError(error, 'list messages')
  }
}
