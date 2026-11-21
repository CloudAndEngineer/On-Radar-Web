import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarPlus, Check, Phone, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { seniorApi } from '../api/seniors'
import { RiskBadge } from '../components/RiskBadge'
import type { ImmediateTrigger } from '../types/api'

const triggerLabels: Record<ImmediateTrigger, string> = {
  MORNING_MISSED_2DAYS: '아침 체크 이틀 연속 미등록',
  FULL_DAY_MISSED: '하루 종일 미등록',
  BAD_CONDITION_3DAYS: '몸 상태 나쁨 3일 연속',
  HELP_BUTTON: '도와주세요 버튼',
  CRISIS_TALK: '위기 표현 감지',
}

export function SeniorDetailPage() {
  const { seniorId = '' } = useParams()
  const { data: senior, isLoading, isError } = useQuery({ queryKey: ['senior', seniorId], queryFn: () => seniorApi.detail(seniorId) })

  if (isLoading) return <div className="empty-state">어르신 정보를 불러오고 있어요.</div>
  if (isError || !senior) return <div className="empty-state error-state">어르신 정보를 불러오지 못했어요. <Link to="/">대시보드로 돌아가기</Link></div>

  const chartData = senior.pattern.map((day) => ({ ...day, label: day.date, meal: day.mealCount }))

  return <>
    <Link to="/" className="back-link"><ArrowLeft size={20} /> 대상자 목록</Link>
    <section className="senior-hero">
      <div className="senior-identity"><RiskBadge level={senior.riskLevel} /><div><h1>{senior.name} 어르신</h1><p>{senior.age}세 · {senior.addressDong} · 혼자 거주 · 보호자 {senior.guardianLabel}</p></div></div>
      <div className="hero-actions">{senior.selfPhone ? <a className="button button-primary" href={`tel:${senior.selfPhone}`}><Phone size={19} /> 전화하기</a> : <button className="button button-primary" disabled><Phone size={19} /> 전화번호 없음</button>}<button className="button button-outline" onClick={() => window.alert('방문 일정 기록은 API 연결 후 사용할 수 있어요.')}><CalendarPlus size={18} /> 방문 일정 잡기</button><button className="button button-plain" onClick={() => window.alert('연락 완료 처리는 API 연결 후 사용할 수 있어요.')}><Check size={18} /> 연락 완료 처리</button></div>
    </section>

    <div className="detail-grid">
      <div className="detail-main">
        <section className="panel ai-panel"><div className="section-title"><Sparkles size={20} /><h2>AI 요약</h2></div><p className="ai-summary">{senior.aiSummary} 서서히 나빠지는 패턴이라 방문 상담을 권장해요.</p><div className="reason-chips">{senior.riskReasons.map((reason) => <span className="reason-chip" key={reason}>{reason}</span>)}{senior.immediateTriggers.map((trigger) => <span className="reason-chip trigger-chip" key={trigger}>{triggerLabels[trigger]}</span>)}</div></section>
        <section className="panel pattern-panel"><div className="panel-heading"><div><h2>최근 2주 생활 패턴</h2><p className="muted">첫 7일 기준선과 최근 기록을 비교해요.</p></div><div className="chart-legend"><span><i className="legend-swatch baseline" />기준 기간</span><span><i className="legend-swatch recent" />최근</span></div></div>
          <div className="chart-block"><h3>밥 (하루 횟수)</h3><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 18, right: 8, left: -24, bottom: 0 }}><CartesianGrid vertical={false} stroke="#f0eeeb" /><XAxis dataKey="label" axisLine={false} tickLine={false} /><YAxis domain={[0, 4]} allowDecimals={false} axisLine={false} tickLine={false} /><Tooltip /><ReferenceLine y={3} stroke="#706d69" strokeDasharray="5 5" /><Bar dataKey="meal" radius={[5, 5, 0, 0]}>{chartData.map((day) => <Cell key={day.label} fill={day.isBaseline ? '#d5d0c8' : '#c9410b'} />)}</Bar></BarChart></ResponsiveContainer></div></div>
          <div className="chart-block"><h3>아침 응답 시각</h3><div className="daily-grid">{chartData.map((day) => <span className={`daily-pill time-pill ${day.isBaseline ? '' : 'late'}`} key={day.label}>{day.morningRespondedAt ?? '미응답'}</span>)}</div></div>
          <div className="chart-block"><h3>몸 상태</h3><div className="daily-grid">{chartData.map((day) => <span className={`daily-pill condition-${day.conditionScore ?? 'none'}`} key={day.label}>{day.conditionScore === 2 ? '좋음' : day.conditionScore === 1 ? '보통' : day.conditionScore === 0 ? '나쁨' : '미응답'}</span>)}</div></div>
        </section>
        <section className="panel timeline-panel"><div className="panel-heading"><div><h2>공유 타임라인</h2><p className="muted">가족·복지관의 확인과 조치를 기록해요.</p></div><button className="button button-outline" onClick={() => window.alert('타임라인 기록은 API 연결 후 사용할 수 있어요.')}>기록 추가</button></div>
          <ol className="timeline-list">{senior.timeline.map((event) => <li key={event.eventId}><span className="timeline-dot" /><div><div className="timeline-event-title">{event.action}<time>{event.createdAt}</time></div><p>{event.actor} · {event.memo}</p></div></li>)}</ol>
        </section>
      </div>
      <aside className="detail-aside"><section className="panel score-panel"><h2>위험 점수</h2><div className="score"><strong>{senior.score}</strong><span>/ 100</span></div><div className="score-meter"><span style={{ width: `${senior.score}%` }} /></div><div className="score-scale"><span>정상 0–39</span><span>주의 40–69</span><span>위험 70+</span></div></section>
        <section className="panel alert-panel"><h2>알림 진행</h2><ol className="alert-list">{senior.alertHistory.map((alert) => <li key={alert.label}><span className={`alert-dot alert-${alert.status.toLowerCase()}`} /><div><strong>{alert.label}</strong><p>{alert.date}</p></div></li>)}</ol></section></aside>
    </div>
  </>
}
