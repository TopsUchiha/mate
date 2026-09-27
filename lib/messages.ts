import 'server-only'
import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { PAGE_SIZE } from '@/lib/constants'

export async function listMessages({ q, filter, page }: { q: string; filter: 'all' | 'unread' | 'read'; page: number }) {
  const where: Prisma.ContactMessageWhereInput = {
    ...(filter === 'unread' ? { read: false } : filter === 'read' ? { read: true } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { subject: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  }
  const [items, total] = await db.$transaction([
    db.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.contactMessage.count({ where }),
  ])
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) }
}
