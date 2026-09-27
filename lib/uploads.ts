import 'server-only'
import { fileTypeFromBuffer } from 'file-type'
import { UPLOAD_ALLOWED_MIME, UPLOAD_MAX_BYTES } from '@/lib/constants'
import { ApiError } from '@/lib/api'

const EXTENSIONS: Record<(typeof UPLOAD_ALLOWED_MIME)[number], string[]> = {
  'application/pdf': ['pdf'],
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/webp': ['webp'],
}

export function sanitizeFileName(name: string) {
  const base = name.split(/[\\/]/).pop() ?? 'file'
  const cleaned = base
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 120)
  return cleaned || 'file'
}

/**
 * Validates an uploaded file by size, declared extension AND its actual magic bytes.
 * Browser-supplied MIME types are never trusted on their own.
 */
export async function validateUpload(file: File) {
  if (file.size === 0) throw new ApiError(400, 'The file is empty.')
  if (file.size > UPLOAD_MAX_BYTES) throw new ApiError(413, 'Files must be 5 MB or smaller.')

  const buffer = Buffer.from(await file.arrayBuffer())
  const detected = await fileTypeFromBuffer(buffer)
  const mime = detected?.mime as (typeof UPLOAD_ALLOWED_MIME)[number] | undefined

  if (!mime || !UPLOAD_ALLOWED_MIME.includes(mime)) {
    throw new ApiError(415, 'Only PDF, PNG, JPEG and WEBP files are allowed.')
  }

  const fileName = sanitizeFileName(file.name)
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  if (!EXTENSIONS[mime].includes(ext)) {
    throw new ApiError(415, 'The file extension does not match its contents.')
  }

  return { buffer, mime, fileName, size: file.size }
}
