import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError, json, parseJson, requireAdminApi } from '@/lib/api'
import { messagePatchSchema } from '@/lib/validation'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req, { mutation: true })
    const { id } = await params
    const { read } = await parseJson(req, messagePatchSchema, 1024)
    const message = await db.contactMessage.update({ where: { id }, data: { read } })
    return json({ message })
  } catch (error) {
    return handleApiError(error, 'update message')
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req, { mutation: true })
    const { id } = await params
    await db.contactMessage.delete({ where: { id } })
    return json({ ok: true })
  } catch (error) {
    return handleApiError(error, 'delete message')
  }
}
