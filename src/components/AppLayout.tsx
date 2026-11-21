import { Activity, Radar } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="온 레이더 대시보드 홈">
          <span className="brand-mark"><Radar size={25} strokeWidth={2.8} /></span>
          <span className="brand-name">온 레이더</span>
          <span className="organization">OO노인복지관</span>
        </Link>
        <div className="topbar-meta"><span className="current-date">11월 16일(월) 19:40 기준</span><span className="user-pill">이지은 복지사</span></div>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer className="footer"><Activity size={15} /> 어르신의 일상 변화를 함께 살펴요</footer>
    </div>
  )
}
