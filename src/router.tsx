import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { SeniorDetailPage } from './pages/SeniorDetailPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/seniors/:seniorId', element: <SeniorDetailPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
