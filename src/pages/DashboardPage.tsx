import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, CheckCircle2, Clock3, Search, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { seniorApi } from '../api/seniors'
import { RiskBadge } from '../components/RiskBadge'
import type { RiskLevel, SeniorSummary } from '../types/api'

const riskOrder: Record<RiskLevel, number> = { DANGER: 0, CAUTION: 1, NORMAL: 2 }

export function DashboardPage() {
  const [search, setSearch] = useState('')
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'MISSED' | 'ALL'>('ALL')
  const { data: seniors = [], isLoading, isError, error } = useQuery({ queryKey: ['seniors'], queryFn: seniorApi.list })

  const counts = useMemo(() => ({
    DANGER: seniors.filter((senior) => senior.riskLevel === 'DANGER').length,
    CAUTION: seniors.filter((senior) => senior.riskLevel === 'CAUTION').length,
    NORMAL: seniors.filter((senior) => senior.riskLevel === 'NORMAL').length,
    MISSED: seniors.filter((senior) => senior.todayMissed.morning || senior.todayMissed.evening).length,
  }), [seniors])

  const filteredSeniors = useMemo(() => seniors
    .filter((senior) => selectedRisk === 'ALL'
      || (selectedRisk === 'MISSED' ? senior.todayMissed.morning || senior.todayMissed.evening : senior.riskLevel === selectedRisk))
    .filter((senior) => senior.name.includes(search.trim()))
    .sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel] || b.score - a.score), [seniors, search, selectedRisk])

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">복지사 대시보드</p>
        <h1>담당 어르신 {seniors.length}명</h1>
        <p className="page-subtitle">AI가 평소 생활 패턴과 비교해 위험한 분부터 보여드려요.</p>
      </div>

      <section className="summary-grid" aria-label="대상자 현황">
        <SummaryCard label="위험" value={counts.DANGER} tone="danger" icon={<TriangleAlert />} active={selectedRisk === 'DANGER'} onClick={() => setSelectedRisk(selectedRisk === 'DANGER' ? 'ALL' : 'DANGER')} />
        <SummaryCard label="주의" value={counts.CAUTION} tone="caution" icon={<AlertCircle />} active={selectedRisk === 'CAUTION'} onClick={() => setSelectedRisk(selectedRisk === 'CAUTION' ? 'ALL' : 'CAUTION')} />
        <SummaryCard label="정상" value={counts.NORMAL} tone="normal" icon={<CheckCircle2 />} active={selectedRisk === 'NORMAL'} onClick={() => setSelectedRisk(selectedRisk === 'NORMAL' ? 'ALL' : 'NORMAL')} />
        <SummaryCard label="오늘 미등록" value={counts.MISSED} tone="neutral" icon={<Clock3 />} active={selectedRisk === 'MISSED'} onClick={() => setSelectedRisk(selectedRisk === 'MISSED' ? 'ALL' : 'MISSED')} />
      </section>

      <section className="panel table-panel">
        <div className="panel-heading table-heading">
          <div><h2>위험도 순 대상자</h2><p className="muted">상태 변화가 큰 분을 먼저 확인해 주세요.</p></div>
          <label className="search-box"><Search size={19} /><span className="sr-only">이름 검색</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="이름으로 찾기" /></label>
        </div>
        {isLoading ? <div className="empty-state">대상자 정보를 불러오고 있어요.</div> : null}
        {isError ? <div className="empty-state error-state">대상자 목록을 불러오지 못했어요. {(error as Error).message}</div> : null}
        {!isLoading && !isError && filteredSeniors.length === 0 ? <div className="empty-state">검색 조건에 맞는 어르신이 없습니다.</div> : null}
        {!isLoading && !isError && filteredSeniors.length > 0 ? <div className="table-scroll"><table className="senior-table">
          <thead><tr><th>상태</th><th>어르신</th><th>최근 3일 (평소 대비)</th><th>AI 요약</th><th>연락처 · 조치</th></tr></thead>
          <tbody>{filteredSeniors.map((senior) => <SeniorRow key={senior.seniorId} senior={senior} />)}</tbody>
        </table></div> : null}
      </section>
    </>
  )
}

function SummaryCard({ label, value, tone, icon, active, onClick }: { label: string; value: number; tone: string; icon: ReactNode; active: boolean; onClick: () => void }) {
  return <button className={`summary-card tone-${tone}${active ? ' is-active' : ''}`} onClick={onClick} aria-pressed={active}>
    <span className="summary-label">{icon}<span>{label}</span></span><span className="summary-value">{value}<small>명</small></span>
  </button>
}

function SeniorRow({ senior }: { senior: SeniorSummary }) {
  const { last3Days } = senior
  const trend = [
    last3Days.mealAvg === null ? '밥 기록 없음' : `밥 ${last3Days.mealAvg}회${last3Days.mealAvg < 3 ? ' ↓ (평소 3회)' : ''}`,
    last3Days.worstCondition === null ? '몸 상태 기록 없음' : `몸 상태 ${last3Days.worstCondition === 0 ? '안 좋아요' : last3Days.worstCondition === 1 ? '그저 그래요' : '좋아요'}`,
    last3Days.avgMorningRespondedAt === null ? '아침 응답 기록 없음' : `아침 응답 평균 ${last3Days.avgMorningRespondedAt}`,
  ]

  return <tr className={senior.riskLevel === 'DANGER' ? 'row-danger' : ''}>
    <td><RiskBadge level={senior.riskLevel} /></td>
    <td><div className="person-name">{senior.name}</div><div className="muted">{senior.age}세 · {senior.addressDong}</div></td>
    <td><div className="trend-lines">{trend.map((line) => <span key={line}>{line}</span>)}</div></td>
    <td className="summary-cell">{senior.aiSummary}</td>
    <td><div className="contact-lines">{senior.selfPhone ? <span>☎ 본인 <strong>{senior.selfPhone}</strong></span> : null}<span>{senior.guardianPhone ? `${senior.guardianLabel ?? '보호자'} ${senior.guardianPhone}` : senior.guardianLabel ?? '연락처 확인 필요'}</span></div><Link className={`button button-small ${senior.riskLevel === 'DANGER' ? 'button-primary' : 'button-outline'}`} to={`/seniors/${senior.seniorId}`}>상세 · 연락 기록</Link></td>
  </tr>
}
