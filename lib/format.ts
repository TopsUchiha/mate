const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const dateTimeFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return '—'
  return dateFmt.format(new Date(value))
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return '—'
  return dateTimeFmt.format(new Date(value))
}

export function formatWeight(value: string | number | { toString(): string }) {
  const n = Number(value.toString())
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} kg`
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Value for <input type="datetime-local"> in the browser's local timezone. */
export function toDateTimeLocal(value: Date | string | null | undefined) {
  if (!value) return ''
  const d = new Date(value)
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

export function toDateInput(value: Date | string | null | undefined) {
  if (!value) return ''
  return new Date(value).toISOString().slice(0, 10)
}
