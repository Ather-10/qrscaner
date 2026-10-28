import { useState } from 'react'
import { Trash2, Search } from 'lucide-react'
import { list, remove, clear } from '../storage/store.js'

export default function History({ onOpen, toast }) {
  const [tab, setTab] = useState('history'), [q, setQ] = useState(''), [ty, setTy] = useState(''), [, bump] = useState(0)
  const all = list(tab)
  const rows = all.filter((h) => (!ty || h.type === ty) && h.text.toLowerCase().includes(q.toLowerCase()))
  const types = [...new Set(all.map((h) => h.type))]
  const del = (id) => { remove(tab, id); bump((n) => n + 1) }
  const wipe = () => { if (confirm('Delete all entries?')) { clear(tab); bump((n) => n + 1); toast('Cleared') } }
  return (
    <>
      <h2>Library</h2>
      <div className="tabs2">{[['history', 'History'], ['saved', 'Saved QR']].map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setTy('') }}>{l}</button>)}</div>
      <div className="row"><div className="search"><Search size={16} /><input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select value={ty} onChange={(e) => setTy(e.target.value)}><option value="">All</option>{types.map((t) => <option key={t}>{t}</option>)}</select></div>
      {rows.length === 0 && <p className="mu card">Nothing here yet.</p>}
      {rows.map((h) => (
        <div key={h.id} className="card item between">
          <button className="grow" onClick={() => onOpen(h)}><span className="badge">{h.type}</span><div className="res">{h.text.slice(0, 70)}</div><small className="mu">{new Date(h.time).toLocaleString()}</small></button>
          <button className="ic" onClick={() => del(h.id)} aria-label="Delete"><Trash2 size={18} /></button>
        </div>
      ))}
      {all.length > 0 && <button className="btn red" onClick={wipe}>Clear all</button>}
    </>
  )
}
