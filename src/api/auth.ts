import { mockCaregivers } from '../data/mockCaregivers'
import type { CaregiverSession } from '../types/auth'
import { apiRequest } from './client'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

const SESSION_KEY = 'on-radar-caregiver-session'

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

interface CoreLoginResponse {
  token: string
  caregiverId: number
  name: string
  centerName: string | null
}

export async function loginMockCaregiver(loginId: string, password: string): Promise<CaregiverSession> {
  if (!useMock) {
    // Core API 로그인 (비밀번호는 서버가 BCrypt로 확인)
    const res = await apiRequest<CoreLoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ loginId: loginId.trim(), password }),
    }).catch((error: unknown) => {
      // fetch 자체가 실패(TypeError) = 서버에 닿지 못함 (CORS 차단·주소 오류·서버 깨어나는 중)
      if (error instanceof TypeError) {
        throw new Error('서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.')
      }
      // 그 밖에는 서버가 돌려준 이유를 그대로 보여 줌 (401 이면 Core 가 비밀번호 오류 문구를 보냄)
      throw error instanceof Error ? error : new Error('로그인에 실패했어요.')
    })
    const session: CaregiverSession = {
      id: res.caregiverId,
      login_id: loginId.trim(),
      name: res.name,
      center_name: res.centerName ?? '',
      token: res.token,
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  }

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
