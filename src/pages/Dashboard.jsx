import React from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Dashboard({ store, onGoToSession }) {
  const { profile, todayStats, weeklyStats, hustleScore, totalAPV, conversionRates, allSessions, quote, clients } = store

  const today = new Date()
  const todayDay = today.getDay()

  // Build week dots
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const weekDays = DAYS.map((d, i) => {
    const dayDate = new Date(weekStart)
    dayDate.setDate(weekStart.getDate() + i)
    const dateStr = dayDate.toISOString().split('T')[0]
    const sess = allSessions.find(s => s.session_date === dateStr)
    return { label: d, isToday: i === todayDay, sess, dateStr }
  })

  const salesThisWeek = (() => {
    const wStart = new Date(); wStart.setDate(wStart.getDate() - wStart.getDay())
    return clients.filter(c => c.sale_status === 'sale' && new Date(c.created_at) >= wStart)
  })()

  const weeklyAP = salesThisWeek.reduce((s, c) => s + (parseFloat(c.apv) || 0), 0)

  return (
    <div style={styles.wrap}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Agent'} 👊
          </h1>
          <div style={styles.dateStr}>
            {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <button className="btn btn-gold" onClick={onGoToSession}>
          📞 Start Dial Session
        </button>
      </div>

      {/* Quote */}
      <div style={styles.quoteBar}>
        <span style={{ color: '#F0B429', marginRight: 8, fontSize: 18 }}>"</span>
        <span style={{ flex: 1, fontStyle: 'italic', fontSize: 13, color: '#A09A90' }}>{quote.q}</span>
        {quote.a && <span style={{ marginLeft: 12, fontSize: 11, color: '#6A6460', whiteSpace: 'nowrap' }}>— {quote.a}</span>}
      </div>

      {/* Streak + Hustle */}
      <div style={styles.heroRow}>
        <div style={styles.heroCard}>
          <span style={{ fontSize: 32 }}>🔥</span>
          <div>
            <div style={styles.heroNum}>{profile?.streak || 0}</div>
            <div style={styles.heroLabel}>Day Streak</div>
          </div>
        </div>
        <div style={styles.heroCard}>
          <span style={{ fontSize: 32 }}>⚡</span>
          <div>
            <div style={{ ...styles.heroNum, color: '#A78BFA' }}>{hustleScore}</div>
            <div style={styles.heroLabel}>Hustle Score Today</div>
          </div>
        </div>
        <div style={styles.heroCard}>
          <span style={{ fontSize: 32 }}>💰</span>
          <div>
            <div style={{ ...styles.heroNum, color: '#22C55E' }}>${weeklyAP.toLocaleString()}</div>
            <div style={styles.heroLabel}>AP Sold This Week</div>
          </div>
        </div>
        <div style={styles.heroCard}>
          <span style={{ fontSize: 32 }}>🏆</span>
          <div>
            <div style={{ ...styles.heroNum, color: '#F0B429' }}>${totalAPV.toLocaleString()}</div>
            <div style={styles.heroLabel}>Total APV All-Time</div>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div style={styles.sectionLabel}>TODAY'S ACTIVITY</div>
      <div style={styles.statGrid}>
        {[
          { label: 'Dials', val: todayStats.dials, max: 300, color: '#F0B429', icon: '📞' },
          { label: 'Contacts', val: todayStats.contacts, max: 100, color: '#22C55E', icon: '🤝' },
          { label: 'Appointments', val: todayStats.appointments, max: 20, color: '#60A5FA', icon: '📅' },
          { label: 'Presentations', val: todayStats.presentations, max: 10, color: '#A78BFA', icon: '🎯' },
          { label: 'Sales', val: todayStats.sales, max: 5, color: '#22C55E', icon: '💰' },
          { label: 'Recruiting', val: todayStats.recruiting, max: 5, color: '#F0B429', icon: '👥' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: s.color, lineHeight: 1 }}>
              {s.val || 0}
            </div>
            <div style={{ fontSize: 10, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
              {s.label}
            </div>
            <div style={{ marginTop: 8, height: 3, background: '#1E1E1E', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: s.color, borderRadius: 2, width: `${Math.min(100, ((s.val || 0) / s.max) * 100)}%`, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 10, color: '#3A3632', marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
              {s.val || 0} / {s.max}
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Rates */}
      <div style={styles.sectionLabel}>CONVERSION RATES</div>
      <div style={styles.convGrid}>
        {[
          { label: 'Contact Rate', val: conversionRates.contactRate + '%', sub: `${todayStats.contacts || 0}/${todayStats.dials || 0} dials` },
          { label: 'Appointment Rate', val: conversionRates.apptRate + '%', sub: `${todayStats.appointments || 0}/${todayStats.contacts || 0} contacts` },
          { label: 'Close Rate', val: conversionRates.closeRate + '%', sub: `${todayStats.sales || 0}/${todayStats.presentations || 0} pres` },
          { label: 'Hustle Score', val: hustleScore, sub: 'Activity index' },
        ].map(c => (
          <div key={c.label} style={styles.convCard}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 600, color: '#F0EDE8' }}>{c.val}</div>
            <div style={{ fontSize: 11, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{c.label}</div>
            <div style={{ fontSize: 10, color: '#3A3632', marginTop: 2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* This Week */}
      <div style={styles.sectionLabel}>THIS WEEK</div>
      <div style={styles.weekCard}>
        <div style={{ display: 'flex', gap: 8 }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ ...styles.weekDay, ...(d.isToday ? styles.weekDayToday : {}) }}>
              <div style={styles.weekDayLabel}>{d.label}</div>
              <div style={{
                ...styles.weekDayCircle,
                ...(d.sess ? styles.weekDayHasData : {}),
                ...(d.isToday ? styles.weekDayTodayCircle : {})
              }}>
                {d.sess ? (d.sess.dials || 0) : '—'}
              </div>
              <div style={{ fontSize: 9, color: '#3A3632', marginTop: 3 }}>dials</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Weekly Dials', val: weeklyStats.dials },
            { label: 'Contacts', val: weeklyStats.contacts },
            { label: 'Appointments', val: weeklyStats.appointments },
            { label: 'Sales', val: weeklyStats.sales },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#F0B429' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* All-time totals */}
      <div style={styles.sectionLabel}>ALL-TIME STATS</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingBottom: 40 }}>
        {[
          { label: 'Total Dials', val: (profile?.total_dials || 0) + (todayStats.dials || 0), color: '#F0B429' },
          { label: 'Total Sales', val: profile?.total_sales || 0, color: '#22C55E' },
          { label: 'Total AP', val: '$' + (profile?.total_ap || 0).toLocaleString(), color: '#22C55E' },
          { label: 'Sessions', val: allSessions.length, color: '#A78BFA' },
        ].map(s => (
          <div key={s.label} style={{ ...styles.convCard, flex: '1 1 120px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrap: { padding: '20px', maxWidth: 1100, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F0EDE8', letterSpacing: '0.03em' },
  dateStr: { fontSize: 12, color: '#6A6460', marginTop: 2 },
  quoteBar: {
    background: '#111', borderLeft: '3px solid #F0B429', borderRadius: '0 8px 8px 0',
    padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
  },
  heroRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 20 },
  heroCard: {
    background: '#111', border: '1px solid #1E1E1E', borderRadius: 12, padding: '14px 16px',
    display: 'flex', alignItems: 'center', gap: 12
  },
  heroNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#F0B429', lineHeight: 1 },
  heroLabel: { fontSize: 11, color: '#6A6460', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' },
  sectionLabel: { fontSize: 11, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, marginTop: 20 },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 },
  statCard: {
    background: '#111', border: '1px solid #1E1E1E', borderRadius: 12, padding: 14,
    textAlign: 'center'
  },
  convGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 },
  convCard: {
    background: '#1A1A1A', border: '1px solid #1E1E1E', borderRadius: 8, padding: '12px 14px'
  },
  weekCard: {
    background: '#111', border: '1px solid #1E1E1E', borderRadius: 12, padding: 16
  },
  weekDay: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  weekDayToday: {},
  weekDayLabel: { fontSize: 10, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.04em' },
  weekDayCircle: {
    width: 40, height: 40, borderRadius: '50%', background: '#1E1E1E', border: '1px solid #2A2A2A',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6A6460'
  },
  weekDayHasData: { background: 'rgba(240,180,41,0.15)', borderColor: 'rgba(240,180,41,0.3)', color: '#F0B429' },
  weekDayTodayCircle: { borderColor: '#F0B429', color: '#F0B429' }
}
