import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ApiError, handleApiError, json, requireAdminApi } from '@/lib/api'

type Ctx = { params: Promise<{ id: string }> }

/** Streams a stored document to authenticated admins only. */
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req)
    const { id } = await params
    const doc = await db.shipmentDocument.findUnique({
      where: { id },
      select: { fileName: true, fileType: true, fileSize: true, data: true },
    })
    if (!doc) throw new ApiError(404, 'Document not found')

    const download = req.nextUrl.searchParams.get('download') === '1'
    return new NextResponse(new Uint8Array(doc.data), {
      headers: {
        'Content-Type': doc.fileType,
        'Content-Length': String(doc.fileSize),
        'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${doc.fileName}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      },
    })
  } catch (error) {
    return handleApiError(error, 'get document')
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req, { mutation: true })
    const { id } = await params
    await db.shipmentDocument.delete({ where: { id } })
    return json({ ok: true })
  } catch (error) {
    return handleApiError(error, 'delete document')
  }
}
