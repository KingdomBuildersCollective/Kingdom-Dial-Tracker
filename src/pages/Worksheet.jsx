import React, { useState } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_BLOCKS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
]

const initForm = {
  full_name: '', phone: '', email: '', dob: '', age: '', address: '',
  city: '', state: '', zip: '', occupation: '', is_smoker: false,
  carrier: '', apv: '', show_status: 'show', sale_status: 'progress',
  appointment_day: '', appointment_time: '', notes: ''
}

export default function Worksheet({ store, onSaved }) {
  const { addClient, session } = store
  const [form, setForm] = useState(initForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave() {
    if (!form.full_name.trim()) { alert('Client name is required'); return }
    setSaving(true)
    await addClient({
      ...form,
      age: form.age ? parseInt(form.age) : null,
      apv: form.apv ? parseFloat(form.apv) : 0,
    })
    setSaved(true)
    setSaving(false)
    setTimeout(() => {
      setForm(initForm)
      setSaved(false)
      onSaved()
    }, 1200)
  }

  const statusOptions = [
    { val: 'progress', label: '⏳ In Progress', active: 'rgba(167,139,250,0.15)', border: '#A78BFA', text: '#A78BFA' },
    { val: 'missed', label: '✗ Missed', active: 'rgba(239,68,68,0.1)', border: '#EF4444', text: '#EF4444' },
    { val: 'sale', label: '✓ Sale', active: 'rgba(34,197,94,0.1)', border: '#22C55E', text: '#22C55E' },
  ]

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.title}>Client Worksheet</h1>
        <div style={{ fontSize: 12, color: '#6A6460' }}>
          {session ? `Session: ${session.day_of_week} · ${session.session_date}` : 'No active session'}
        </div>
      </div>

      {saved && (
        <div style={styles.savedBanner}>
          ✅ Client saved to Sales Board!
        </div>
      )}

      {/* Sale Status */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Sale Status</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {statusOptions.map(o => (
            <button key={o.val}
              onClick={() => set('sale_status', o.val)}
              style={{
                padding: '8px 18px', borderRadius: 20,
                border: `1.5px solid ${form.sale_status === o.val ? o.border : '#2A2A2A'}`,
                background: form.sale_status === o.val ? o.active : 'transparent',
                color: form.sale_status === o.val ? o.text : '#6A6460',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s'
              }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client Info */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Client Information</div>
        <div style={styles.grid2}>
          <div style={styles.field}>
            <label style={styles.label}>Client Name *</label>
            <input type="text" placeholder="Full name" value={form.full_name}
              onChange={e => set('full_name', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Date of Birth</label>
            <input type="text" placeholder="MM/DD/YYYY" value={form.dob}
              onChange={e => set('dob', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Phone</label>
            <input type="tel" placeholder="555-555-5555" value={form.phone}
              onChange={e => set('phone', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Age</label>
            <input type="number" placeholder="Age" value={form.age}
              onChange={e => set('age', e.target.value)} />
          </div>
          <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Email</label>
            <input type="email" placeholder="email@example.com" value={form.email}
              onChange={e => set('email', e.target.value)} />
          </div>
          <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Street Address</label>
            <input type="text" placeholder="Street address" value={form.address}
              onChange={e => set('address', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>City</label>
            <input type="text" placeholder="City" value={form.city}
              onChange={e => set('city', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>State</label>
            <input type="text" placeholder="State" value={form.state}
              onChange={e => set('state', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Zip Code</label>
            <input type="text" placeholder="Zip" value={form.zip}
              onChange={e => set('zip', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Occupation</label>
            <input type="text" placeholder="Job title" value={form.occupation}
              onChange={e => set('occupation', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Smoker?</label>
            <select value={form.is_smoker ? 'yes' : 'no'}
              onChange={e => set('is_smoker', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Appointment Details</div>
        <div style={styles.grid2}>
          <div style={styles.field}>
            <label style={styles.label}>Carrier Name</label>
            <input type="text" placeholder="Insurance carrier" value={form.carrier}
              onChange={e => set('carrier', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>APV Amount ($)</label>
            <input type="number" placeholder="Annual premium value" value={form.apv}
              onChange={e => set('apv', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Day</label>
            <select value={form.appointment_day} onChange={e => set('appointment_day', e.target.value)}>
              <option value="">Select day</option>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Time</label>
            <select value={form.appointment_time} onChange={e => set('appointment_time', e.target.value)}>
              <option value="">Select time</option>
              {TIME_BLOCKS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Show / No Show</label>
            <select value={form.show_status} onChange={e => set('show_status', e.target.value)}>
              <option value="show">✓ Show</option>
              <option value="noshow">✗ No Show</option>
            </select>
          </div>
          <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
            <label style={styles.label}>Notes / Client Info</label>
            <textarea placeholder="Additional information about this client..."
              value={form.notes} onChange={e => set('notes', e.target.value)}
              style={{ minHeight: 80, resize: 'vertical' }} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingBottom: 40 }}>
        <button className="btn btn-outline" onClick={() => setForm(initForm)}>Clear</button>
        <button className="btn btn-gold btn-lg" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : '💾 Save to Sales Board'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrap: { padding: '20px', maxWidth: 800, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F0EDE8', letterSpacing: '0.03em' },
  section: { background: '#111', border: '1px solid #1E1E1E', borderRadius: 12, padding: 20, marginBottom: 12 },
  sectionLabel: { fontSize: 11, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, fontWeight: 600 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 11, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.04em' },
  savedBanner: {
    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: 10, padding: '12px 16px', color: '#22C55E', fontSize: 14,
    fontWeight: 600, marginBottom: 12, textAlign: 'center',
    animation: 'slideDown 0.3s ease'
  }
}
