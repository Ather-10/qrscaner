import { ScanLine, QrCode, History } from 'lucide-react'
import { list } from '../storage/store.js'
export default function Home({ go, onOpen }) {
  const recent = list('history').slice(0, 4)
  return (
    <>
      <h1>Scan<span className="ac">Pro</span></h1>
      <p className="mu">Free, private QR scanner & generator.</p>
      <div className="grid">
        <button className="card big" onClick={() => go('scan')}><ScanLine size={30} /><b>Scan</b></button>
        <button className="card big" onClick={() => go('create')}><QrCode size={30} /><b>Create</b></button>
        <button className="card big" onClick={() => go('history')}><History size={30} /><b>History</b></button>
      </div>
      <h3>Recent scans</h3>
      {recent.length === 0 && <p className="mu card">No scans yet. Tap Scan to start.</p>}
      {recent.map((h) => <button key={h.id} className="card item" onClick={() => onOpen(h)}><span className="badge">{h.type}</span><div className="res">{h.text.slice(0, 80)}</div></button>)}
    </>
  )
}
