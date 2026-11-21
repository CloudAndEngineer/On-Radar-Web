import type { MockCaregiverRecord } from '../types/auth'

// Demo-only SHA-256 fixture. Production authentication must verify the backend's password_hash.
export const mockCaregivers: MockCaregiverRecord[] = [
  {
    id: 1,
    login_id: 'demo',
    password_hash: 'sha256:2a97516c354b68848cdbd8f54a226a0a55b21ed138e207ad6c5cbb9c00aa5aea',
    name: '데모 복지사',
    center_name: 'OO노인복지관',
  },
]
