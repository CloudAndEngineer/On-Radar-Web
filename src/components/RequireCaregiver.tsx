import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getCaregiverSession } from '../api/auth'
import { AppLayout } from './AppLayout'

export function RequireCaregiver() {
  const location = useLocation()
  if (!getCaregiverSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <AppLayout><Outlet /></AppLayout>
}
