export class ClientApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Record<string, string[] | undefined>,
  ) {
    super(message)
  }
}

export async function apiFetch<T = unknown>(url: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init
  const res = await fetch(url, {
    ...rest,
    credentials: 'same-origin',
    headers: json !== undefined ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ClientApiError(data?.error ?? 'Something went wrong. Please try again.', res.status, data?.details)
  }
  return data as T
}
