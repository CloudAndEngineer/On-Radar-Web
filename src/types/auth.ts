export interface CaregiverSession {
  id: number
  login_id: string
  name: string
  center_name: string
}

export interface MockCaregiverRecord extends CaregiverSession {
  password_hash: string
}
