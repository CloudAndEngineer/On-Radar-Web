import { mockCaregivers } from '../data/mockCaregivers'
import type { CaregiverSession } from '../types/auth'

const SESSION_KEY = 'on-radar-caregiver-session'

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function loginMockCaregiver(loginId: string, password: string): Promise<CaregiverSession> {
  // This client-side check is only for the disconnected demo. The backend must verify password_hash.
  const caregiver = mockCaregivers.find((record) => record.login_id === loginId.trim())
  if (!caregiver || `sha256:${await sha256(password)}` !== caregiver.password_hash) {
    throw new Error('아이디 또는 비밀번호를 확인해 주세요.')
  }

  const { password_hash: _passwordHash, ...session } = caregiver
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function getCaregiverSession(): CaregiverSession | null {
  const stored = sessionStorage.getItem(SESSION_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as CaregiverSession
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function logoutCaregiver() {
  sessionStorage.removeItem(SESSION_KEY)
}
