import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ApiError, handleApiError, json, requireAdminApi } from '@/lib/api'
import { UPLOAD_MAX_BYTES } from '@/lib/constants'
import { validateUpload } from '@/lib/uploads'

type Ctx = { params: Promise<{ id: string }> }

const MAX_DOCUMENTS_PER_SHIPMENT = 25

export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req, { mutation: true })
    const { id } = await params

    const length = Number(req.headers.get('content-length') ?? 0)
    if (length > UPLOAD_MAX_BYTES + 64 * 1024) throw new ApiError(413, 'Files must be 5 MB or smaller.')

    const shipment = await db.shipment.findUnique({
      where: { id },
      select: { id: true, _count: { select: { documents: true } } },
    })
    if (!shipment) throw new ApiError(404, 'Shipment not found')
    if (shipment._count.documents >= MAX_DOCUMENTS_PER_SHIPMENT) {
      throw new ApiError(400, `A shipment can have at most ${MAX_DOCUMENTS_PER_SHIPMENT} documents.`)
    }

    const form = await req.formData().catch(() => null)
    const file = form?.get('file')
    if (!(file instanceof File)) throw new ApiError(400, 'Please choose a file to upload.')

    const { buffer, mime, fileName, size } = await validateUpload(file)

    const document = await db.$transaction(async (tx) => {
      const created = await tx.shipmentDocument.create({
        data: { shipmentId: id, fileName, fileType: mime, fileSize: size, data: buffer, fileUrl: '' },
        select: { id: true },
      })
      return tx.shipmentDocument.update({
        where: { id: created.id },
        data: { fileUrl: `/api/documents/${created.id}` },
        select: { id: true, fileName: true, fileUrl: true, fileType: true, fileSize: true, createdAt: true },
      })
    })
    return json({ document }, 201)
  } catch (error) {
    return handleApiError(error, 'upload document')
  }
}
