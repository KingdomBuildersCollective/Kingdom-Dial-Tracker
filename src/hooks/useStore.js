import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../supabase'

const QUOTES = [
  { q: "Why are you getting upset over an amount you could earn by writing one extra application a month?", a: "John Wetmore" },
  { q: "Iron sharpens iron, and one man sharpens another.", a: "Proverbs 27:17" },
  { q: "The harvest is plentiful but the workers are few.", a: "Matthew 9:37" },
  { q: "Every call is an opportunity to change someone's family forever.", a: "Kingdom Calling" },
  { q: "Don't count the days. Make the days count.", a: "Muhammad Ali" },
  { q: "Success is not owned, it is rented — and the rent is due every day.", a: "" },
  { q: "Whatever you do, work at it with all your heart, as working for the Lord.", a: "Colossians 3:23" },
  { q: "The harder you work, the luckier you get.", a: "Gary Player" },
]

const MILESTONES = [
  { metric: 'dials', val: 50, msg: '50 Dials! Warming up!', icon: '📞', xp: 50 },
  { metric: 'dials', val: 100, msg: '100 Dials! Finding your rhythm!', icon: '🔥', xp: 100 },
  { metric: 'dials', val: 150, msg: '150 Dials — BEAST MODE!', icon: '💪', xp: 150 },
  { metric: 'dials', val: 200, msg: '200 Dials! Elite tier!', icon: '⚡', xp: 200 },
  { metric: 'dials', val: 300, msg: '300 DIALS! DAILY GOAL CRUSHED!', icon: '👑', xp: 500 },
  { metric: 'contacts', val: 25, msg: '25 Contacts! People are listening!', icon: '🤝', xp: 75 },
  { metric: 'contacts', val: 50, msg: '50 Contacts! Halfway!', icon: '🤝', xp: 100 },
  { metric: 'contacts', val: 100, msg: '100 CONTACTS! GOAL REACHED!', icon: '🏆', xp: 300 },
  { metric: 'appts', val: 5, msg: '5 Appointments booked!', icon: '📅', xp: 100 },
  { metric: 'appts', val: 10, msg: '10 Appointments! On fire!', icon: '🎯', xp: 200 },
  { metric: 'appts', val: 20, msg: '20 APPOINTMENTS! GOAL COMPLETE!', icon: '🏆', xp: 500 },
  { metric: 'sales', val: 1, msg: 'FIRST SALE! Kingdom is being built!', icon: '💰', xp: 200 },
  { metric: 'sales', val: 3, msg: '3 SALES! You are on FIRE!', icon: '🔥', xp: 300 },
  { metric: 'sales', val: 5, msg: '5 SALES! Kingdom Producer!', icon: '👑', xp: 500 },
]

export function useStore(user) {
  const [profile, setProfile] = useState(null)
  const [session, setSession] = useState(null) // current dial session
  const [clients, setClients] = useState([])
  const [allSessions, setAllSessions] = useState([])
  const [achievements, setAchievements] = useState([])
  const [toast, setToast] = useState(null)
  const [achievement, setAchievement] = useState(null)
  const [loading, setLoading] = useState(true)
  const shownMilestones = useRef(new Set())
  const saveTimer = useRef(null)

  const quote = useRef(QUOTES[Math.floor(Math.random() * QUOTES.length)])

  // Load profile & today's session
  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  async function loadData() {
    setLoading(true)
    const [profileRes, clientRes, sessRes, achRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('clients').select('*').eq('agent_id', user.id).order('created_at', { ascending: false }),
      supabase.from('dial_sessions').select('*').eq('agent_id', user.id).order('session_date', { ascending: false }),
      supabase.from('achievements').select('*').eq('agent_id', user.id)
    ])

    if (profileRes.data) setProfile(profileRes.data)
    if (clientRes.data) setClients(clientRes.data)
    if (sessRes.data) {
      setAllSessions(sessRes.data)
      // load today's session if exists
      const today = new Date().toISOString().split('T')[0]
      const todaySession = sessRes.data.find(s => s.session_date === today)
      if (todaySession) {
        setSession(todaySession)
        // restore milestone tracking
        MILESTONES.forEach(m => {
          if (todaySession[m.metric] >= m.val) {
            shownMilestones.current.add(`${m.metric}-${m.val}`)
          }
        })
      }
    }
    if (achRes.data) setAchievements(achRes.data)
    setLoading(false)
  }

  // Debounced save session to Supabase
  function scheduleSave(updatedSession) {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveSession(updatedSession), 1500)
  }

  async function saveSession(s) {
    if (!s) return
    const { id, agent_id, created_at, ...data } = s
    if (s.id) {
      await supabase.from('dial_sessions').update({ ...data, updated_at: new Date().toISOString() }).eq('id', s.id)
    } else {
      const { data: newSess } = await supabase.from('dial_sessions').insert({
        agent_id: user.id, ...data
      }).select().single()
      if (newSess) setSession(newSess)
    }
  }

  async function startSession(dayOfWeek, timeBlock) {
    const today = new Date().toISOString().split('T')[0]
    // check if session already exists for this date
    const existing = allSessions.find(s => s.session_date === today)
    if (existing) {
      setSession(existing)
      return existing
    }
    const newSession = {
      agent_id: user.id,
      session_date: today,
      day_of_week: dayOfWeek,
      time_block: timeBlock,
      dials: 0, contacts: 0, appointments: 0,
      presentations: 0, sales: 0, recruiting: 0,
      timer_seconds: 0,
      hour_blocks: [],
      notes: ''
    }
    const { data } = await supabase.from('dial_sessions').insert(newSession).select().single()
    if (data) {
      setSession(data)
      setAllSessions(prev => [data, ...prev])
    }
    return data
  }

  function adjust(metric, delta) {
    if (!session) return
    const maxMap = { dials: 300, contacts: 100, appointments: 20, presentations: 999, sales: 999, recruiting: 999 }
    const newVal = Math.max(0, Math.min(maxMap[metric] || 999, (session[metric] || 0) + delta))
    const updated = { ...session, [metric]: newVal }
    setSession(updated)

    if (delta > 0) {
      const xpGain = { sales: 50, appointments: 15, contacts: 5, presentations: 10, dials: 1, recruiting: 8 }
      gainXP(xpGain[metric] || 1)
      checkMilestones(metric, newVal)
    }
    scheduleSave(updated)
  }

  function updateHourBlock(idx, val) {
    if (!session) return
    const blocks = [...(session.hour_blocks || [])]
    blocks[idx] = val
    const updated = { ...session, hour_blocks: blocks }
    setSession(updated)
    scheduleSave(updated)
  }

  function updateTimer(seconds) {
    if (!session) return
    const updated = { ...session, timer_seconds: seconds }
    setSession(updated)
    // save timer less frequently
    if (seconds % 30 === 0) saveSession(updated)
  }

  function checkMilestones(metric, val) {
    MILESTONES.forEach(m => {
      const key = `${m.metric}-${m.val}`
      if (m.metric === metric && val >= m.val && !shownMilestones.current.has(key)) {
        shownMilestones.current.add(key)
        showAchievement(m.icon, m.msg, 'Achievement unlocked!')
        gainXP(m.xp)
        saveAchievement(key, m.msg, m.icon)
      }
    })
  }

  function gainXP(amount) {
    showToast(`+${amount} XP`)
    setProfile(prev => {
      if (!prev) return prev
      let { xp, level, xp_needed } = prev
      xp = (xp || 0) + amount
      while (xp >= xp_needed) {
        xp -= xp_needed
        level++
        xp_needed = Math.floor(xp_needed * 1.4)
        showAchievement('👑', `Level Up! You're now Level ${level}!`, 'Kingdom is growing!')
      }
      const updated = { ...prev, xp, level, xp_needed }
      supabase.from('profiles').update({ xp, level, xp_needed }).eq('id', user.id)
      return updated
    })
  }

  async function saveAchievement(key, title, icon) {
    const already = achievements.find(a => a.key === key)
    if (already) return
    const { data } = await supabase.from('achievements').insert({
      agent_id: user.id, key, title, icon
    }).select().single()
    if (data) setAchievements(prev => [...prev, data])
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  function showAchievement(icon, text, sub) {
    setAchievement({ icon, text, sub, id: Date.now() })
    setTimeout(() => setAchievement(null), 4500)
  }

  async function addClient(clientData) {
    const { data } = await supabase.from('clients').insert({
      agent_id: user.id,
      session_id: session?.id,
      ...clientData
    }).select().single()
    if (data) {
      setClients(prev => [data, ...prev])
      if (clientData.sale_status === 'sale') {
        gainXP(200)
        showAchievement('💰', `New Sale: ${clientData.full_name}!`, 'Kingdom is growing!')
        // Update total AP on profile
        const newAP = (profile?.total_ap || 0) + (parseFloat(clientData.apv) || 0)
        setProfile(prev => ({ ...prev, total_ap: newAP, total_sales: (prev?.total_sales || 0) + 1 }))
        supabase.from('profiles').update({
          total_ap: newAP,
          total_sales: (profile?.total_sales || 0) + 1
        }).eq('id', user.id)
      }
    }
    return data
  }

  async function updateClient(id, updates) {
    const { data } = await supabase.from('clients').update(updates).eq('id', id).select().single()
    if (data) setClients(prev => prev.map(c => c.id === id ? data : c))
    return data
  }

  async function deleteClient(id) {
    await supabase.from('clients').delete().eq('id', id)
    setClients(prev => prev.filter(c => c.id !== id))
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  // Computed stats
  const todayStats = session || { dials: 0, contacts: 0, appointments: 0, presentations: 0, sales: 0, recruiting: 0 }

  const weeklyStats = (() => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekSessions = allSessions.filter(s => new Date(s.session_date) >= weekStart)
    return {
      dials: weekSessions.reduce((a, s) => a + (s.dials || 0), 0),
      contacts: weekSessions.reduce((a, s) => a + (s.contacts || 0), 0),
      appointments: weekSessions.reduce((a, s) => a + (s.appointments || 0), 0),
      sales: weekSessions.reduce((a, s) => a + (s.sales || 0), 0),
      days: weekSessions
    }
  })()

  const hustleScore = Math.round(
    (todayStats.dials || 0) * 1 +
    (todayStats.contacts || 0) * 3 +
    (todayStats.appointments || 0) * 10 +
    (todayStats.presentations || 0) * 5 +
    (todayStats.sales || 0) * 25
  )

  const totalAPV = clients.filter(c => c.sale_status === 'sale').reduce((s, c) => s + (parseFloat(c.apv) || 0), 0)

  const conversionRates = {
    contactRate: todayStats.dials > 0 ? ((todayStats.contacts / todayStats.dials) * 100).toFixed(1) : '0.0',
    apptRate: todayStats.contacts > 0 ? ((todayStats.appointments / todayStats.contacts) * 100).toFixed(1) : '0.0',
    closeRate: todayStats.presentations > 0 ? ((todayStats.sales / todayStats.presentations) * 100).toFixed(1) : '0.0',
  }

  return {
    profile, session, clients, allSessions, achievements,
    toast, achievement, loading, quote: quote.current,
    todayStats, weeklyStats, hustleScore, totalAPV, conversionRates,
    startSession, adjust, updateHourBlock, updateTimer,
    addClient, updateClient, deleteClient,
    gainXP, showAchievement,
    signOut, loadData
  }
}
