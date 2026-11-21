import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireCaregiver } from './components/RequireCaregiver'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { SeniorDetailPage } from './pages/SeniorDetailPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireCaregiver />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/seniors/:seniorId', element: <SeniorDetailPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
