import React, { useState, useEffect, useRef } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_BLOCKS = [
  '9:00 AM – 10:00 AM', '10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM', '1:00 PM – 2:00 PM', '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM', '4:00 PM – 5:00 PM', '5:00 PM – 6:00 PM',
  '6:00 PM – 7:00 PM', '7:00 PM – 8:00 PM', '8:00 PM – 9:00 PM'
]
const HOUR_LABELS = ['9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM']

export default function SessionPage({ store }) {
  const { session, todayStats, hustleScore, conversionRates, adjust, updateHourBlock, updateTimer, startSession } = store

  const [showSetup, setShowSetup] = useState(!session)
  const [setupDay, setSetupDay] = useState(() => {
    const d = new Date().getDay()
    return DAYS[Math.max(0, d - 1)] || 'Monday'
  })
  const [setupTime, setSetupTime] = useState(TIME_BLOCKS[0])
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSec, setTimerSec] = useState(session?.timer_seconds || 0)
  const timerRef = useRef(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (session) {
      setShowSetup(false)
      setTimerSec(session.timer_seconds || 0)
    }
  }, [session?.id])

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSec(s => {
          const next = s + 1
          updateTimer(next)
          return next
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [timerRunning])

  async function handleStart() {
    setStarting(true)
    await startSession(setupDay, setupTime)
    setShowSetup(false)
    setStarting(false)
  }

  function formatTime(s) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  // Setup Screen
  if (showSetup) {
    return (
      <div style={styles.setupWrap}>
        <div style={styles.setupCard}>
          <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>📞</div>
          <h2 style={styles.setupTitle}>Start Dial Session</h2>
          <p style={{ fontSize: 13, color: '#6A6460', textAlign: 'center', marginBottom: 24, lineHeight: 1.6 }}>
            Choose your day and time block to begin tracking
          </p>

          <div style={styles.setupField}>
            <label style={styles.setupLabel}>Day of Week</label>
            <div style={styles.dayGrid}>
              {DAYS.map(d => (
                <button key={d} style={{ ...styles.dayBtn, ...(setupDay === d ? styles.dayBtnActive : {}) }}
                  onClick={() => setSetupDay(d)}>{d}</button>
              ))}
            </div>
          </div>

          <div style={styles.setupField}>
            <label style={styles.setupLabel}>Time Block</label>
            <div style={styles.timeGrid}>
              {TIME_BLOCKS.map(t => (
                <button key={t} style={{ ...styles.timeBtn, ...(setupTime === t ? styles.timeBtnActive : {}) }}
                  onClick={() => setSetupTime(t)}>{t}</button>
              ))}
            </div>
          </div>

          <button className="btn btn-gold btn-lg" onClick={handleStart} disabled={starting}
            style={{ width: '100%', marginTop: 8, fontSize: 16 }}>
            {starting ? 'Setting up...' : '🚀 Launch Session'}
          </button>
        </div>
      </div>
    )
  }

  const stats = todayStats

  return (
    <div style={styles.wrap}>
      {/* Session Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.sessionMeta}>
            <span style={styles.metaTag}>{session?.day_of_week || 'Today'}</span>
            <span style={styles.metaDot}>·</span>
            <span style={styles.metaTag}>{session?.time_block || ''}</span>
            <span style={styles.metaDot}>·</span>
            <span style={{ fontSize: 12, color: '#6A6460' }}>{session?.session_date || ''}</span>
          </div>
          <h1 style={styles.title}>Dial Session</h1>
        </div>
        <div style={styles.timerRow}>
          <div style={styles.timerDisplay}>{formatTime(timerSec)}</div>
          <button
            className={`btn ${timerRunning ? 'btn-outline' : 'btn-gold'}`}
            onClick={() => setTimerRunning(r => !r)}
          >
            {timerRunning ? '⏸ Pause' : '▶ Start Timer'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowSetup(true)}>
            Change Setup
          </button>
        </div>
      </div>

      {/* Hustle Score */}
      <div style={styles.hustleBanner}>
        <span style={{ fontSize: 14, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hustle Score</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: '#A78BFA', lineHeight: 1 }}>
          {hustleScore}
        </span>
        <div style={{ flex: 1 }} />
        <div style={styles.convRow}>
          {[
            { label: 'Contact Rate', val: conversionRates.contactRate + '%' },
            { label: 'Appt Rate', val: conversionRates.apptRate + '%' },
            { label: 'Close Rate', val: conversionRates.closeRate + '%' },
          ].map(c => (
            <div key={c.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600, color: '#F0EDE8' }}>{c.val}</div>
              <div style={{ fontSize: 10, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Blocks */}
      <div style={styles.section}>
        <div style={styles.sectionHead}>
          <span style={styles.sectionTitle}>Hourly Blocks</span>
          <span style={styles.sectionSub}>Tap to mark active hours</span>
        </div>
        <div style={styles.hourRow}>
          {HOUR_LABELS.map((lbl, i) => {
            const filled = session?.hour_blocks?.[i]
            return (
              <button key={i} onClick={() => updateHourBlock(i, !filled)}
                style={{ ...styles.hourDot, ...(filled ? styles.hourDotFilled : {}) }}>
                <span style={{ fontSize: 9, fontWeight: 600 }}>{lbl.replace('AM','').replace('PM','')}</span>
                <span style={{ fontSize: 8, opacity: 0.7 }}>{lbl.includes('AM') ? 'am' : 'pm'}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* DIALS */}
      <TallyBlock
        icon="📞" title="DIALS" goal={300}
        current={stats.dials || 0} metric="dials"
        color="#F0B429" bgColor="rgba(240,180,41,0.08)"
        quickAdds={[1, 5, 10, 15, 25]}
        onAdjust={delta => adjust('dials', delta)}
      />

      {/* CONTACTS */}
      <TallyBlock
        icon="🤝" title="CONTACTS" goal={100}
        current={stats.contacts || 0} metric="contacts"
        color="#22C55E" bgColor="rgba(34,197,94,0.06)"
        quickAdds={[1, 5, 10]}
        onAdjust={delta => adjust('contacts', delta)}
      />

      {/* APPOINTMENTS */}
      <TallyBlock
        icon="📅" title="APPOINTMENTS" goal={20}
        current={stats.appointments || 0} metric="appointments"
        color="#60A5FA" bgColor="rgba(96,165,250,0.06)"
        quickAdds={[1, 5]}
        onAdjust={delta => adjust('appointments', delta)}
      />

      {/* PRESENTATIONS + SALES side by side */}
      <div style={styles.halfGrid}>
        <TallyBlock
          icon="🎯" title="PRESENTATIONS" goal={10}
          current={stats.presentations || 0} metric="presentations"
          color="#A78BFA" bgColor="rgba(167,139,250,0.06)"
          quickAdds={[1]}
          onAdjust={delta => adjust('presentations', delta)}
          compact
        />
        <TallyBlock
          icon="💰" title="SALES" goal={5}
          current={stats.sales || 0} metric="sales"
          color="#22C55E" bgColor="rgba(34,197,94,0.1)"
          quickAdds={[1]}
          onAdjust={delta => adjust('sales', delta)}
          compact
        />
      </div>

      {/* RECRUITING */}
      <TallyBlock
        icon="👥" title="RECRUITING" goal={5}
        current={stats.recruiting || 0} metric="recruiting"
        color="#F0B429" bgColor="rgba(240,180,41,0.06)"
        quickAdds={[1]}
        onAdjust={delta => adjust('recruiting', delta)}
        compact
      />

      <div style={{ height: 40 }} />
    </div>
  )
}

function TallyBlock({ icon, title, goal, current, color, bgColor, quickAdds, onAdjust, compact = false }) {
  const pct = Math.min(100, (current / goal) * 100)
  const isComplete = current >= goal

  return (
    <div style={{ ...styles.section, background: isComplete ? bgColor : '#111', borderColor: isComplete ? color + '44' : '#1E1E1E' }}>
      <div style={styles.sectionHead}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: isComplete ? color : '#F0EDE8', letterSpacing: '0.04em' }}>
              {title} {isComplete && '✓'}
            </div>
            <div style={{ fontSize: 11, color: '#6A6460' }}>Goal: {goal}</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: isComplete ? color : '#6A6460', background: isComplete ? bgColor : '#1A1A1A', padding: '3px 10px', borderRadius: 20, border: `1px solid ${isComplete ? color + '44' : '#2A2A2A'}` }}>
          {current} / {goal}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: '#1A1A1A', borderRadius: 3, overflow: 'hidden', margin: '10px 0' }}>
        <div style={{ height: '100%', background: color, borderRadius: 3, width: `${pct}%`, transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>

      {/* Counter row */}
      <div style={styles.counterRow}>
        <button onClick={() => onAdjust(-1)} style={{ ...styles.adjustBtn, color: '#6A6460' }}>−</button>

        <div style={{ ...styles.bigNum, color, fontSize: compact ? 56 : 72 }}>
          {current}
        </div>

        <button onClick={() => onAdjust(1)} style={{ ...styles.adjustBtn, background: color, color: '#000', fontSize: 28 }}>+</button>

        <div style={styles.quickAddCol}>
          <div style={{ fontSize: 10, color: '#3A3632', marginBottom: 4 }}>QUICK ADD</div>
          {quickAdds.map(n => (
            <button key={n} onClick={() => onAdjust(n)}
              style={styles.quickBtn}>+{n}</button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#6A6460', textAlign: 'center', marginTop: 4 }}>
        {Math.round(pct)}% of daily goal
      </div>
    </div>
  )
}

const styles = {
  wrap: { padding: '16px 20px', maxWidth: 900, margin: '0 auto' },
  setupWrap: {
    minHeight: 'calc(100vh - 62px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: 20
  },
  setupCard: {
    background: '#111', border: '1px solid #1E1E1E', borderRadius: 16, padding: 28,
    width: '100%', maxWidth: 520
  },
  setupTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F0B429',
    textAlign: 'center', letterSpacing: '0.04em', marginBottom: 4
  },
  setupField: { marginBottom: 20 },
  setupLabel: { fontSize: 11, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 },
  dayGrid: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  dayBtn: {
    padding: '8px 14px', border: '1px solid #2A2A2A', borderRadius: 8,
    background: '#1A1A1A', color: '#A09A90', cursor: 'pointer', fontSize: 13,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: 'all 0.15s'
  },
  dayBtnActive: { background: 'rgba(240,180,41,0.15)', borderColor: '#F0B429', color: '#F0B429' },
  timeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 6 },
  timeBtn: {
    padding: '8px 10px', border: '1px solid #2A2A2A', borderRadius: 8,
    background: '#1A1A1A', color: '#A09A90', cursor: 'pointer', fontSize: 12,
    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s', textAlign: 'center'
  },
  timeBtnActive: { background: 'rgba(240,180,41,0.15)', borderColor: '#F0B429', color: '#F0B429' },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    marginBottom: 14, flexWrap: 'wrap', gap: 12
  },
  sessionMeta: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
  metaTag: { fontSize: 12, color: '#F0B429', fontWeight: 600 },
  metaDot: { color: '#3A3632' },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F0EDE8', letterSpacing: '0.03em' },
  timerRow: { display: 'flex', alignItems: 'center', gap: 8 },
  timerDisplay: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600,
    background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8,
    padding: '6px 16px', color: '#F0EDE8', letterSpacing: '0.04em'
  },
  hustleBanner: {
    background: '#0D0D0D', border: '1px solid #1E1E1E', borderRadius: 12, padding: '12px 18px',
    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap'
  },
  convRow: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  section: {
    background: '#111', border: '1px solid #1E1E1E', borderRadius: 12, padding: 16,
    marginBottom: 12, transition: 'border-color 0.3s, background 0.3s'
  },
  sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  sectionTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#F0EDE8', letterSpacing: '0.04em' },
  sectionSub: { fontSize: 11, color: '#6A6460' },
  hourRow: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 },
  hourDot: {
    width: 46, height: 46, borderRadius: '50%', border: '1.5px solid #2A2A2A',
    background: '#1A1A1A', cursor: 'pointer', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
    color: '#6A6460'
  },
  hourDotFilled: { background: '#F0B429', borderColor: '#F0B429', color: '#000' },
  counterRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 },
  bigNum: {
    fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1, letterSpacing: '0.02em',
    minWidth: 120, textAlign: 'center',
    animation: 'countUp 0.15s ease',
  },
  adjustBtn: {
    width: 64, height: 64, borderRadius: '50%', border: '1.5px solid #2A2A2A',
    background: '#1A1A1A', cursor: 'pointer', fontSize: 28, fontWeight: 700,
    transition: 'all 0.12s', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  quickAddCol: { display: 'flex', flexDirection: 'column', gap: 4 },
  quickBtn: {
    padding: '4px 12px', border: '1px solid #2A2A2A', borderRadius: 6, background: '#1A1A1A',
    color: '#A09A90', cursor: 'pointer', fontSize: 12, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.12s'
  },
  halfGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }
}
