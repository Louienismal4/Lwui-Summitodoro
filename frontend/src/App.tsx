import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CurtainProvider } from '@/components/layout/CurtainProvider'
import { useCurtainNavigate } from '@/hooks/useCurtain'
import { LandingPage } from './pages/LandingPage'
import { AboutPage } from './pages/AboutPage'
import { ChangelogPage } from './pages/ChangelogPage'
import { HikePage } from './pages/HikePage'

function AppRoutes() {
  const curtainNavigate = useCurtainNavigate()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onStartExpedition={() => curtainNavigate('/hike')}
            onNavigateAbout={() => curtainNavigate('/about')}
            onNavigateChangelog={() => curtainNavigate('/changelog')}
          />
        }
      />
      <Route path="/hike" element={<HikePage />} />
      <Route
        path="/about"
        element={
          <AboutPage
            onStartExpedition={() => curtainNavigate('/hike')}
            onNavigateHome={() => curtainNavigate('/')}
            onNavigateChangelog={() => curtainNavigate('/changelog')}
          />
        }
      />
      <Route
        path="/changelog"
        element={
          <ChangelogPage
            onStartExpedition={() => curtainNavigate('/hike')}
            onNavigateHome={() => curtainNavigate('/')}
            onNavigateAbout={() => curtainNavigate('/about')}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <CurtainProvider>
        <AppRoutes />
      </CurtainProvider>
    </BrowserRouter>
  )
}

export default App
