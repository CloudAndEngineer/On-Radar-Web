export type RiskLevel = 'DANGER' | 'CAUTION' | 'NORMAL'
export type AlertStage = 'CAUTION' | 'DANGER' | 'EMERGENCY'

export interface SeniorSummary {
  seniorId: number
  name: string
  age: number
  addressDong: string
  riskLevel: RiskLevel
  score: number
  aiSummary: string
  last3Days: {
    mealAvg: number | null
    worstCondition: number | null
    avgMorningRespondedAt: string | null
  }
  todayMissed: { morning: boolean; evening: boolean }
  openAlert: { alertId: number; level: AlertStage; stage: string } | null
  selfPhone?: string
  guardianLabel?: string
  guardianPhone?: string | null
}

export interface PatternDay {
  date: string
  isBaseline: boolean
  mealCount: number | null
  morningRespondedAt: string | null
  conditionScore: number | null
}

export type CareAction = 'CALLED' | 'CALL_NO_ANSWER' | 'CARE_REQUESTED' | 'VISIT_SCHEDULED' | 'RESOLVED' | 'NOTE'

export type ImmediateTrigger = 'MORNING_MISSED_2DAYS' | 'FULL_DAY_MISSED' | 'BAD_CONDITION_3DAYS' | 'HELP_BUTTON' | 'CRISIS_TALK'

export interface SeniorDetail extends SeniorSummary {
  address: string
  honorific: string
  riskReasons: string[]
  immediateTriggers: ImmediateTrigger[]
  alertHistory: { label: string; date: string; status: 'DONE' | 'WAITING' | 'UPCOMING' }[]
  timeline: { eventId: number; actor: string; action: string; memo: string; createdAt: string }[]
  pattern: PatternDay[]
}
