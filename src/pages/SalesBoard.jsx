import React, { useState } from 'react'

const STATUS_FILTERS = ['all', 'sale', 'progress', 'missed']
const STATUS_LABELS = { all: 'All', sale: 'Sales', progress: 'In Progress', missed: 'Missed' }

export default function SalesBoard({ store, onNewClient }) {
  const { clients, deleteClient } = store
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filtered = clients
    .filter(c => filter === 'all' || c.sale_status === filter)
    .filter(c => !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search))
    .sort((a, b) => sortBy === 'newest' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at))

  const totalSales = clients.filter(c => c.sale_status === 'sale')
  const totalAP = totalSales.reduce((s, c) => s + (parseFloat(c.apv) || 0), 0)
  const totalShows = clients.filter(c => c.show_status === 'show').length
  const totalNoShows = clients.filter(c => c.show_status === 'noshow').length

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.title}>Sales Board</h1>
        <button className="btn btn-gold" onClick={onNewClient}>+ New Client</button>
      </div>

      {/* Stats row */}
      <div style={styles.statRow}>
        {[
          { label: 'Total Sales', val: totalSales.length, color: '#22C55E' },
          { label: 'Total AP', val: '$' + totalAP.toLocaleString(), color: '#22C55E' },
          { label: 'Shows', val: totalShows, color: '#60A5FA' },
          { label: 'No Shows', val: totalNoShows, color: '#EF4444' },
          { label: 'Pending', val: clients.filter(c => c.sale_status === 'progress').length, color: '#A78BFA' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: '#6A6460', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterTabs}>
          {STATUS_FILTERS.map(f => (
            <button key={f} style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
              onClick={() => setFilter(f)}>
              {STATUS_LABELS[f]}
              <span style={styles.filterCount}>
                {f === 'all' ? clients.length : clients.filter(c => c.sale_status === f).length}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text" placeholder="Search clients..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: 180 }}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 120 }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 40, marginBottom: 8, opacity: 0.3 }}>📋</div>
          <div style={{ color: '#6A6460', fontSize: 14 }}>No clients recorded yet</div>
          <div style={{ color: '#3A3632', fontSize: 12, marginTop: 4 }}>Fill out the worksheet and save to add records here</div>
          <button className="btn btn-gold btn-sm" onClick={onNewClient} style={{ marginTop: 14 }}>
            + Add First Client
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: 4 }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Phone</th>
                <th>Carrier</th>
                <th>Day / Time</th>
                <th>Show</th>
                <th>Status</th>
                <th>APV</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id}>
                  <td style={{ color: '#6A6460', fontSize: 12 }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.full_name}</div>
                    {c.email && <div style={{ fontSize: 11, color: '#6A6460' }}>{c.email}</div>}
                  </td>
                  <td style={{ color: '#A09A90', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                    {c.phone || '—'}
                  </td>
                  <td style={{ color: '#A09A90', fontSize: 12 }}>{c.carrier || '—'}</td>
                  <td style={{ fontSize: 11, color: '#6A6460' }}>
                    {c.appointment_day && <div>{c.appointment_day}</div>}
                    {c.appointment_time && <div>{c.appointment_time}</div>}
                    {!c.appointment_day && '—'}
                  </td>
                  <td>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: c.show_status === 'show' ? '#22C55E' : '#EF4444'
                    }}>
                      {c.show_status === 'show' ? '✓ Show' : '✗ No Show'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${c.sale_status}`}>
                      {c.sale_status === 'progress' ? 'In Progress' : c.sale_status === 'sale' ? 'Sale' : 'Missed'}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", color: '#F0B429', fontWeight: 600 }}>
                    {c.apv ? '$' + parseFloat(c.apv).toLocaleString() : '—'}
                  </td>
                  <td style={{ color: '#6A6460', fontSize: 11 }}>
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <button
                      onClick={() => { if (confirm('Delete this client record?')) deleteClient(c.id) }}
                      style={{ background: 'none', border: 'none', color: '#6A6460', cursor: 'pointer', fontSize: 14 }}
                    >✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ height: 40 }} />
    </div>
  )
}

const styles = {
  wrap: { padding: '20px', maxWidth: 1100, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 },
  title: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#F0EDE8', letterSpacing: '0.03em' },
  statRow: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  statCard: {
    background: '#111', border: '1px solid #1E1E1E', borderRadius: 10,
    padding: '12px 16px', flex: '1 1 100px'
  },
  filterBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12, flexWrap: 'wrap', gap: 10
  },
  filterTabs: { display: 'flex', gap: 2, background: '#1A1A1A', borderRadius: 8, padding: 3 },
  filterBtn: {
    padding: '6px 14px', border: 'none', background: 'transparent', color: '#6A6460',
    fontSize: 12, fontWeight: 600, cursor: 'pointer', borderRadius: 6,
    fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
    display: 'flex', alignItems: 'center', gap: 6
  },
  filterBtnActive: { background: '#F0B429', color: '#000' },
  filterCount: {
    background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '1px 6px',
    fontSize: 10, fontWeight: 700
  },
  empty: { textAlign: 'center', padding: '60px 20px', background: '#111', border: '1px solid #1E1E1E', borderRadius: 12, marginTop: 4 },
}
