import { mockSeniorDetail, mockSeniors } from '../data/mockData'
import type { SeniorDetail, SeniorSummary } from '../types/api'
import { apiRequest } from './client'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export const seniorApi = {
  list: (): Promise<SeniorSummary[]> => useMock
    ? Promise.resolve(mockSeniors)
    : apiRequest<SeniorSummary[]>('/caregivers/me/seniors'),
  detail: (seniorId: string): Promise<SeniorDetail> => useMock
    ? Promise.resolve({ ...mockSeniorDetail, seniorId: Number(seniorId) || mockSeniorDetail.seniorId })
    : apiRequest<SeniorDetail>(`/seniors/${seniorId}`),
}
