import type { SeniorDetail, SeniorSummary } from '../types/api'

export const mockSeniors: SeniorSummary[] = [
  {
    seniorId: 1, name: '김순자', age: 81, addressDong: '성수1가2동', riskLevel: 'DANGER', score: 78,
    aiSummary: '최근 4일간 식사가 하루 1회로 줄고 아침 응답이 늦어졌어요. 방문 상담을 권장해요.',
    last3Days: { mealAvg: 1, worstCondition: 0, avgMorningRespondedAt: '10:10' },
    todayMissed: { morning: false, evening: true },
    openAlert: { alertId: 9, level: 'DANGER', stage: 'CAREGIVER' }, selfPhone: '010-0000-0001',
    guardianLabel: '딸', guardianPhone: '010-0000-0002',
  },
  {
    seniorId: 2, name: '박정호', age: 78, addressDong: '성수2가1동', riskLevel: 'DANGER', score: 74,
    aiSummary: '이틀 연속 체크 기록이 없어요. 평소 응답 시간과 차이가 있어 연락이 필요해요.',
    last3Days: { mealAvg: null, worstCondition: null, avgMorningRespondedAt: null },
    todayMissed: { morning: true, evening: true }, openAlert: { alertId: 10, level: 'EMERGENCY', stage: 'CAREGIVER' },
    selfPhone: '010-0000-0003', guardianLabel: '보호자 없음', guardianPhone: null,
  },
  {
    seniorId: 3, name: '이말순', age: 84, addressDong: '송정동', riskLevel: 'CAUTION', score: 56,
    aiSummary: '식사 횟수가 평소보다 조금 줄었어요. 며칠 더 살펴봐 주세요.',
    last3Days: { mealAvg: 2, worstCondition: 1, avgMorningRespondedAt: '08:20' }, todayMissed: { morning: false, evening: false },
    openAlert: null, selfPhone: '010-0000-0004', guardianLabel: '아들', guardianPhone: '010-0000-0005',
  },
  {
    seniorId: 4, name: '최영길', age: 76, addressDong: '응답동', riskLevel: 'CAUTION', score: 48,
    aiSummary: '아침 응답 시간이 평소보다 조금 늦어졌어요. 며칠 더 살펴봐 주세요.',
    last3Days: { mealAvg: 3, worstCondition: 2, avgMorningRespondedAt: '07:40' }, todayMissed: { morning: false, evening: false },
    openAlert: null, selfPhone: '010-0000-0006', guardianLabel: '딸', guardianPhone: '010-0000-0007',
  },
  {
    seniorId: 5, name: '정옥자', age: 88, addressDong: '성수1가1동', riskLevel: 'CAUTION', score: 42,
    aiSummary: '어제 몸 상태가 좋지 않다고 답하셨어요.',
    last3Days: { mealAvg: 2, worstCondition: 1, avgMorningRespondedAt: '07:30' }, todayMissed: { morning: false, evening: false },
    openAlert: null, selfPhone: '010-0000-0008', guardianLabel: '며느리', guardianPhone: '010-0000-0009',
  },
  {
    seniorId: 6, name: '한복례', age: 79, addressDong: '성수2가3동', riskLevel: 'NORMAL', score: 18,
    aiSummary: '평소 패턴과 비슷해요.',
    last3Days: { mealAvg: 3, worstCondition: 2, avgMorningRespondedAt: '07:10' }, todayMissed: { morning: false, evening: false },
    openAlert: null, selfPhone: '010-0000-0010', guardianLabel: '아들', guardianPhone: '010-0000-0011',
  },
]

const dayLabels = ['3일', '4일', '5일', '6일', '7일', '8일', '9일', '10일', '11일', '12일', '13일', '14일', '15일', '16일']
const mealCounts = [3, 3, 3, 2, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1]
const conditions = [2, 2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 0, 0, 0]
const wakeTimes: (string | null)[] = ['7:05', '7:10', '6:55', '7:00', '7:20', '7:05', '7:00', '7:30', '8:00', '8:20', '8:50', '9:30', null, null]

export const mockSeniorDetail: SeniorDetail = {
  ...mockSeniors[0],
  address: '서울 성동구 성수1가2동',
  honorific: '할머니',
  riskReasons: ['최근 4일간 식사가 하루 1회로 줄었어요', '아침 체크가 이틀 연속 미등록이에요', '몸 상태가 3일째 좋지 않아요'],
  immediateTriggers: ['MORNING_MISSED_2DAYS', 'BAD_CONDITION_3DAYS'],
  alertHistory: [
    { label: 'AI 위험 판정 (점수 78)', date: '11/16 19:30', status: 'DONE' },
    { label: '담당 복지사에게 알림', date: '11/16 19:31 · 확인 대기', status: 'WAITING' },
    { label: '보호자(딸)에게 알림', date: '2시간 내 미확인 시 자동 발송', status: 'UPCOMING' },
    { label: '동주민센터 연계', date: '다음 날 오전까지 미조치 시', status: 'UPCOMING' },
  ],
  timeline: [
    { eventId: 1, actor: '온 레이더', action: '위험 알림 생성', memo: '미응답·식사·컨디션 변화 감지', createdAt: '11/16 19:30' },
    { eventId: 2, actor: '이지은 복지사', action: '전화 확인 예정', memo: '오늘 저녁 연락 후 상태 확인', createdAt: '11/16 19:42' },
  ],
  pattern: dayLabels.map((date, index) => ({
    date,
    isBaseline: index < 7,
    mealCount: mealCounts[index],
    morningRespondedAt: wakeTimes[index],
    conditionScore: conditions[index],
  })),
}
