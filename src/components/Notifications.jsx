import React, { useEffect, useState } from 'react'

export function XPToast({ message }) {
  if (!message) return null
  return (
    <div style={styles.toast}>
      <span style={{ color: '#F0B429', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}>
        {message}
      </span>
    </div>
  )
}

export function AchievementBanner({ data, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (data) {
      setVisible(true)
      const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, 4000)
      return () => clearTimeout(t)
    }
  }, [data?.id])

  if (!data) return null

  return (
    <div style={{ ...styles.banner, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-16px)' }}>
      <div style={{ fontSize: 32 }}>{data.icon}</div>
      <div>
        <div style={styles.bannerTitle}>{data.text}</div>
        <div style={styles.bannerSub}>{data.sub}</div>
      </div>
      <button onClick={onDismiss} style={styles.dismiss}>✕</button>
    </div>
  )
}

const styles = {
  toast: {
    position: 'fixed', top: 72, right: 20, zIndex: 200,
    background: '#111', border: '1px solid rgba(240,180,41,0.4)',
    borderRadius: 8, padding: '8px 16px',
    animation: 'slideDown 0.3s ease, fadeOut 0.3s ease 1.5s forwards',
    pointerEvents: 'none'
  },
  banner: {
    position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%) translateY(0)',
    zIndex: 200, background: '#151200',
    border: '1px solid rgba(240,180,41,0.5)',
    borderRadius: 12, padding: '14px 20px',
    display: 'flex', alignItems: 'center', gap: 14,
    maxWidth: 420, width: 'calc(100% - 40px)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 24px rgba(240,180,41,0.15)'
  },
  bannerTitle: {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 18,
    color: '#FFD97D', letterSpacing: '0.03em'
  },
  bannerSub: { fontSize: 12, color: '#A09A90', marginTop: 2 },
  dismiss: {
    marginLeft: 'auto', background: 'none', border: 'none',
    color: '#6A6460', cursor: 'pointer', fontSize: 16, padding: '0 4px'
  }
}
