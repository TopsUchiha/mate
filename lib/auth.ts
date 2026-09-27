import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { db } from '@/lib/db'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session-token'

export type AdminSession = { id: string; email: string }

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const store = await cookies()
  const payload = await verifySessionToken(store.get(SESSION_COOKIE)?.value)
  if (!payload) return null
  const admin = await db.admin.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true },
  })
  return admin
})

export async function requireAdminPage(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')
  return session
}
