import React, { useState } from 'react'
import { supabase } from '../supabase'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [form, setForm] = useState({ email: '', password: '', fullName: '', agencyName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          agency_name: form.agencyName || 'Kingdom Business Services'
        }
      }
    })
    if (error) setError(error.message)
    else setMessage('Check your email to confirm your account, then log in.')
    setLoading(false)
  }

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(form.email)
    if (error) setError(error.message)
    else setMessage('Password reset link sent to your email.')
    setLoading(false)
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.bg} />
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.crown}>👑</div>
          <div style={styles.brandName}>Kingdom Dial Tracker</div>
          <div style={styles.brandSub}>Track. Gamify. Dominate.</div>
        </div>

        {/* Card */}
        <div style={styles.card}>
          {/* Tabs */}
          {mode !== 'reset' && (
            <div style={styles.tabs}>
              <button
                style={{ ...styles.tabBtn, ...(mode === 'login' ? styles.tabActive : {}) }}
                onClick={() => { setMode('login'); setError(''); setMessage('') }}
              >Log In</button>
              <button
                style={{ ...styles.tabBtn, ...(mode === 'signup' ? styles.tabActive : {}) }}
                onClick={() => { setMode('signup'); setError(''); setMessage('') }}
              >Sign Up</button>
            </div>
          )}

          {mode === 'reset' && (
            <div style={{ marginBottom: 20 }}>
              <button onClick={() => { setMode('login'); setError(''); setMessage('') }} style={styles.backBtn}>
                ← Back to Login
              </button>
              <h2 style={{ ...styles.formTitle, marginTop: 8 }}>Reset Password</h2>
            </div>
          )}

          {error && <div style={styles.errorBox}>{error}</div>}
          {message && <div style={styles.successBox}>{message}</div>}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input type="email" placeholder="you@example.com" required
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input type="password" placeholder="••••••••" required
                  value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
              <button type="submit" className="btn btn-gold btn-lg" disabled={loading}
                style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Signing in...' : 'Enter the Kingdom →'}
              </button>
              <button type="button" onClick={() => { setMode('reset'); setError(''); setMessage('') }}
                style={styles.forgotBtn}>
                Forgot password?
              </button>
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name *</label>
                <input type="text" placeholder="Victor Benlice" required
                  value={form.fullName} onChange={e => set('fullName', e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Agency Name</label>
                <input type="text" placeholder="Kingdom Business Services"
                  value={form.agencyName} onChange={e => set('agencyName', e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email *</label>
                <input type="email" placeholder="you@example.com" required
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password *</label>
                <input type="password" placeholder="Min 6 characters" required minLength={6}
                  value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
              <button type="submit" className="btn btn-gold btn-lg" disabled={loading}
                style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Creating account...' : 'Create Agent Profile →'}
              </button>
            </form>
          )}

          {/* Reset Form */}
          {mode === 'reset' && (
            <form onSubmit={handleReset} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input type="email" placeholder="you@example.com" required
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <button type="submit" className="btn btn-gold btn-lg" disabled={loading}
                style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <div style={styles.footer}>
          Kingdom Business Services · Built for producers
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', padding: '20px'
  },
  bg: {
    position: 'fixed', inset: 0, zIndex: 0,
    background: 'radial-gradient(ellipse at 20% 50%, rgba(240,180,41,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.03) 0%, transparent 50%)',
    pointerEvents: 'none'
  },
  container: {
    width: '100%', maxWidth: 420, position: 'relative', zIndex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24
  },
  logoWrap: { textAlign: 'center' },
  crown: { fontSize: 48, lineHeight: 1, marginBottom: 8 },
  brandName: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: '0.06em',
    color: '#F0B429', lineHeight: 1
  },
  brandSub: { fontSize: 13, color: '#6A6460', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' },
  card: {
    width: '100%', background: '#111111', border: '1px solid #1E1E1E',
    borderRadius: 16, padding: 28
  },
  tabs: { display: 'flex', gap: 0, background: '#1A1A1A', borderRadius: 8, padding: 4, marginBottom: 24 },
  tabBtn: {
    flex: 1, padding: '8px 0', border: 'none', background: 'transparent',
    color: '#6A6460', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    borderRadius: 6, transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif"
  },
  tabActive: { background: '#F0B429', color: '#000' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  formTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F0B429' },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 11, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 },
  errorBox: {
    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#EF4444', marginBottom: 16
  },
  successBox: {
    background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#22C55E', marginBottom: 16
  },
  forgotBtn: {
    background: 'none', border: 'none', color: '#6A6460', fontSize: 12, cursor: 'pointer',
    textAlign: 'center', padding: '4px 0', fontFamily: "'DM Sans', sans-serif",
    textDecoration: 'underline'
  },
  backBtn: {
    background: 'none', border: 'none', color: '#A09A90', fontSize: 13, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", padding: 0
  },
  footer: { fontSize: 12, color: '#3A3632', textAlign: 'center' }
}
