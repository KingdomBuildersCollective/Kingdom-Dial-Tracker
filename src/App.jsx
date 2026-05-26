import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { useStore } from './hooks/useStore'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import SessionPage from './pages/SessionPage'
import SalesBoard from './pages/SalesBoard'
import Worksheet from './pages/Worksheet'
import Nav from './components/Nav'
import { XPToast, AchievementBanner } from './components/Notifications'
import './styles.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const store = useStore(user)

  if (authLoading || (user && store.loading)) {
    return (
      <div style={loadingStyles.wrap}>
        <div style={loadingStyles.crown}>👑</div>
        <div style={loadingStyles.text}>Kingdom Dial Tracker</div>
        <div style={loadingStyles.sub}>Loading your kingdom...</div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <div>
      <Nav
        profile={store.profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSignOut={store.signOut}
      />

      {/* Global notifications */}
      {store.toast && <XPToast message={store.toast} />}
      {store.achievement && (
        <AchievementBanner
          data={store.achievement}
          onDismiss={() => {}}
        />
      )}

      {/* Pages */}
      {activeTab === 'dashboard' && (
        <Dashboard store={store} onGoToSession={() => setActiveTab('session')} />
      )}
      {activeTab === 'session' && (
        <SessionPage store={store} />
      )}
      {activeTab === 'clients' && (
        <SalesBoard store={store} onNewClient={() => setActiveTab('worksheet')} />
      )}
      {activeTab === 'worksheet' && (
        <Worksheet store={store} onSaved={() => setActiveTab('clients')} />
      )}
    </div>
  )
}

const loadingStyles = {
  wrap: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 8, background: '#0A0A0A'
  },
  crown: { fontSize: 52, animation: 'pulse 2s ease infinite' },
  text: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F0B429',
    letterSpacing: '0.06em'
  },
  sub: { fontSize: 13, color: '#6A6460', letterSpacing: '0.06em', textTransform: 'uppercase' }
}
