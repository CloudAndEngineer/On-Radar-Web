import { useState, type FormEvent } from 'react'
import { ArrowRight, Radar } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getCaregiverSession, loginMockCaregiver } from '../api/auth'

interface LoginLocationState {
  from?: string
}

export function LoginPage() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const session = getCaregiverSession()

  if (session) return <Navigate to="/" replace />

  const from = (location.state as LoginLocationState | null)?.from ?? '/'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await loginMockCaregiver(loginId, password)
      navigate(from, { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : '로그인하지 못했어요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <header className="login-brand-row">
        <Link to="/login" className="brand" aria-label="온 레이더 로그인">
          <span className="brand-mark"><Radar size={28} strokeWidth={2.8} /></span>
          <span className="brand-name">온 레이더</span>
        </Link>
        <span className="organization">복지관 관리자</span>
      </header>
      <section className="login-card">
        <div className="login-heading">
          <span className="login-icon"><Radar size={27} /></span>
          <p className="eyebrow">CARE STAFF</p>
          <h1>복지사 로그인</h1>
          <p>담당 어르신의 오늘 상태를 확인해 주세요.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-id">아이디</label>
          <input id="login-id" name="username" autoComplete="username" value={loginId} onChange={(event) => setLoginId(event.target.value)} placeholder="아이디를 입력하세요" required />
          <label htmlFor="login-password">비밀번호</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호를 입력하세요" required />
          {error ? <p className="login-error" role="alert">{error}</p> : null}
          <button className="button button-primary login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중…' : '로그인'} <ArrowRight size={19} />
          </button>
        </form>
        <p className="demo-hint">시연 계정 <strong>demo</strong> · 비밀번호 <strong>demo</strong></p>
      </section>
      <p className="login-footnote">온 레이더 · 어르신의 일상 변화를 함께 살펴요</p>
    </main>
  )
}
