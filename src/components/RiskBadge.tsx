import type { RiskLevel } from '../types/api'

const labels: Record<RiskLevel, string> = { DANGER: '위험', CAUTION: '주의', NORMAL: '정상' }

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`risk-badge risk-${level.toLowerCase()}`}>{labels[level]}</span>
}
