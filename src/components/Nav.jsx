import React from 'react'

const TABS = ['dashboard', 'session', 'clients', 'worksheet']
const TAB_LABELS = { dashboard: '🏠 Dashboard', session: '📞 Dial Session', clients: '💼 Sales Board', worksheet: '📋 Worksheet' }

export default function Nav({ profile, activeTab, onTabChange, onSignOut }) {
  const xpPct = profile ? Math.min(100, ((profile.xp || 0) / (profile.xp_needed || 500)) * 100) : 0
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AG'

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={{ fontSize: 22 }}>👑</span>
        <div>
          <div style={styles.brandName}>Kingdom Dial Tracker</div>
          <div style={styles.agencyName}>{profile?.agency_name || 'Kingdom Business Services'}</div>
        </div>
      </div>

      <div style={styles.tabs}>
        {TABS.map(t => (
          <button key={t} style={{ ...styles.tabBtn, ...(activeTab === t ? styles.tabActive : {}) }}
            onClick={() => onTabChange(t)}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div style={styles.right}>
        {/* XP + Level */}
        <div style={styles.xpWrap}>
          <div style={styles.levelBadge}>LV {profile?.level || 1}</div>
          <div>
            <div style={styles.xpBarWrap}>
              <div style={{ ...styles.xpBarFill, width: `${xpPct}%` }} />
            </div>
            <div style={styles.xpText}>{profile?.xp || 0} / {profile?.xp_needed || 500} XP</div>
          </div>
        </div>

        {/* Avatar */}
        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>{initials}</div>
          <div>
            <div style={styles.agentName}>{profile?.full_name || 'Agent'}</div>
            <button onClick={onSignOut} style={styles.signOutBtn}>Sign out</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 20px', background: '#0D0D0D', borderBottom: '1px solid #1A1A1A',
    position: 'sticky', top: 0, zIndex: 100, gap: 16, flexWrap: 'wrap'
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  brandName: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#F0B429',
    letterSpacing: '0.05em', lineHeight: 1
  },
  agencyName: { fontSize: 10, color: '#6A6460', letterSpacing: '0.06em', textTransform: 'uppercase' },
  tabs: { display: 'flex', gap: 2, background: '#1A1A1A', borderRadius: 8, padding: 3 },
  tabBtn: {
    padding: '7px 14px', border: 'none', background: 'transparent',
    color: '#6A6460', fontSize: 12, fontWeight: 600, cursor: 'pointer',
    borderRadius: 6, transition: 'all 0.18s', fontFamily: "'DM Sans', sans-serif",
    whiteSpace: 'nowrap'
  },
  tabActive: { background: '#F0B429', color: '#000' },
  right: { display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 },
  xpWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  levelBadge: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#F0B429',
    background: 'rgba(240,180,41,0.1)', padding: '2px 10px', borderRadius: 6,
    border: '1px solid rgba(240,180,41,0.2)'
  },
  xpBarWrap: { width: 90, height: 5, background: '#222', borderRadius: 3, overflow: 'hidden' },
  xpBarFill: { height: '100%', background: '#F0B429', borderRadius: 3, transition: 'width 0.5s' },
  xpText: { fontSize: 10, color: '#6A6460', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 },
  avatarWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: {
    width: 36, height: 36, borderRadius: '50%', background: 'rgba(240,180,41,0.15)',
    border: '2px solid rgba(240,180,41,0.3)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#F0B429',
    flexShrink: 0
  },
  agentName: { fontSize: 12, fontWeight: 600, color: '#F0EDE8' },
  signOutBtn: {
    background: 'none', border: 'none', color: '#6A6460', fontSize: 11,
    cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif'",
    textDecoration: 'underline'
  }
}
