const baseUrl = (import.meta.env.VITE_CORE_API_URL ?? 'http://localhost:8080/api').replace(/\/$/, '')

function sessionToken(): string | undefined {
  try {
    const stored = sessionStorage.getItem('on-radar-caregiver-session')
    return stored ? (JSON.parse(stored) as { token?: string }).token : undefined
  } catch {
    return undefined
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = sessionToken()
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null) as { message?: string; code?: string } | null
    throw new Error(error?.message ?? `요청에 실패했습니다 (${response.status})`)
  }

  if (response.status === 204) return undefined as T
  const body = await response.text()
  return (body ? JSON.parse(body) : undefined) as T
}
