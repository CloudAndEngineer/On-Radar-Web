import { mockSeniorDetail, mockSeniors } from '../data/mockData'
import type { ImmediateTrigger, PatternDay, SeniorDetail, SeniorSummary } from '../types/api'
import { apiRequest } from './client'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

// ---- Core 응답 모양 (todak-core WebController) ----
interface CoreReason { item: string; baseline: unknown; recent: unknown; contribution: number }
interface CoreDetail {
  seniorId: number
  name: string
  honorific: string
  age: number
  addressDong: string | null
  riskLevel: SeniorSummary['riskLevel']
  score: number
  aiSummary: string | null
  reasons: CoreReason[]
  immediateTriggers: string[]
  openAlert: SeniorSummary['openAlert']
}
interface CoreTimeline { eventId: number; actorType: string; actorName: string | null; action: string; memo: string | null; createdAt: string | null }

const ITEM_LABEL: Record<string, string> = { NO_RESPONSE: '체크 놓침', WAKE_TIME: '아침 응답', CONDITION: '몸 상태', MEAL: '식사' }
const STAGE_LABEL: Record<string, string> = { SENIOR: '어르신 재알림', CAREGIVER: '담당 복지사', CENTER: '동주민센터' }

function reasonText(r: CoreReason): string {
  const label = ITEM_LABEL[r.item] ?? r.item
  const fmt = (v: unknown) => (typeof v === 'number' ? Math.round(v * 10) / 10 : String(v ?? '-'))
  return `${label} ${fmt(r.baseline)} → ${fmt(r.recent)} (+${Math.round(r.contribution * 10) / 10})`
}

function hhmm(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function coreDetail(seniorId: string): Promise<SeniorDetail> {
  const [detail, pattern, timeline, list] = await Promise.all([
    apiRequest<CoreDetail>(`/seniors/${seniorId}`),
    apiRequest<{ days: PatternDay[] }>(`/seniors/${seniorId}/pattern?days=14`).catch(() => ({ days: [] })),
    apiRequest<CoreTimeline[]>(`/seniors/${seniorId}/timeline`).catch(() => []),
    apiRequest<SeniorSummary[]>('/caregivers/me/seniors').catch(() => []),
  ])
  const row = list.find((s) => String(s.seniorId) === String(seniorId))
  return {
    ...(row ?? {}),
    seniorId: detail.seniorId,
    name: detail.name,
    age: detail.age,
    addressDong: detail.addressDong ?? '',
    riskLevel: detail.riskLevel,
    score: detail.score,
    aiSummary: detail.aiSummary ?? '',
    last3Days: row?.last3Days ?? { mealAvg: null, worstCondition: null, avgMorningRespondedAt: null },
    todayMissed: row?.todayMissed ?? { morning: false, evening: false },
    openAlert: detail.openAlert,
    address: detail.addressDong ?? '',
    honorific: detail.honorific,
    riskReasons: (detail.reasons ?? []).filter((r) => r.contribution > 0).map(reasonText),
    immediateTriggers: (detail.immediateTriggers ?? []) as ImmediateTrigger[],
    alertHistory: detail.openAlert
      ? [{ label: `${detail.openAlert.level} 알림 · ${STAGE_LABEL[detail.openAlert.stage] ?? detail.openAlert.stage}`, date: '진행 중', status: 'WAITING' }]
      : [],
    timeline: timeline.map((t) => ({
      eventId: t.eventId,
      actor: t.actorName ?? t.actorType,
      action: t.action,
      memo: t.memo ?? '',
      createdAt: hhmm(t.createdAt),
    })),
    pattern: pattern.days ?? [],
  }
}

export const seniorApi = {
  list: (): Promise<SeniorSummary[]> => useMock
    ? Promise.resolve(mockSeniors)
    : apiRequest<SeniorSummary[]>('/caregivers/me/seniors'),
  detail: (seniorId: string): Promise<SeniorDetail> => useMock
    ? Promise.resolve({ ...mockSeniorDetail, seniorId: Number(seniorId) || mockSeniorDetail.seniorId })
    : coreDetail(seniorId),
}
