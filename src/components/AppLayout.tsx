import { Activity, LogOut, Radar } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { getCaregiverSession, logoutCaregiver } from '../api/auth'

export function AppLayout({ children }: { children?: ReactNode }) {
  const navigate = useNavigate()
  const caregiver = getCaregiverSession()

  function handleLogout() {
    logoutCaregiver()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="온 레이더 대시보드 홈">
          <span className="brand-mark"><Radar size={25} strokeWidth={2.8} /></span>
          <span className="brand-name">온 레이더</span>
          <span className="organization">{caregiver?.center_name ?? 'OO노인복지관'}</span>
        </Link>
        <div className="topbar-meta"><span className="current-date">11월 16일(월) 19:40 기준</span><span className="user-pill">{caregiver?.name ?? '복지사'}</span><button className="logout-button" onClick={handleLogout} aria-label="로그아웃"><LogOut size={16} /><span>로그아웃</span></button></div>
      </header>
      <main className="main-content">{children ?? <Outlet />}</main>
      <footer className="footer"><Activity size={15} /> 어르신의 일상 변화를 함께 살펴요</footer>
    </div>
  )
}
