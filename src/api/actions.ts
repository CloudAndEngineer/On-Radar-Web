import { apiRequest } from './client'
import type { CareAction } from '../types/api'

export interface CreateActionRequest {
  action: CareAction
  memo: string
  alertId?: number
}

export interface CreateActionResponse {
  eventId: number
  createdAt: string
}

export function createSeniorAction(seniorId: number, body: CreateActionRequest) {
  return apiRequest<CreateActionResponse>(`/seniors/${seniorId}/actions`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function acknowledgeAlert(alertId: number) {
  return apiRequest<void>(`/alerts/${alertId}/ack`, { method: 'PATCH' })
}
