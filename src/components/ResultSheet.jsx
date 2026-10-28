import { Copy, Share2, ExternalLink, Save, X } from 'lucide-react'
import { Share } from '@capacitor/share'
import { parse } from '../utils/qr.js'
import { add } from '../storage/store.js'

export default function ResultSheet({ item, onClose, toast }) {
  const p = parse(item.text)
  const copy = async () => { try { await navigator.clipboard.writeText(item.text); toast('Copied') } catch { toast('Copy failed') } }
  const share = async () => { try { await Share.share({ text: item.text }) } catch {} }
  const open = () => { if (confirm('Open this destination?\n\n' + p.open)) window.open(p.open, '_system') }
  const save = () => { add('saved', { ...item, id: Date.now() + '' }); toast('Saved') }
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="between"><span className="badge">{p.type}</span><button className="ic" onClick={onClose}><X size={20} /></button></div>
        <p className="res">{p.info}</p>
        {p.open && <p className="mu">Destination: {p.open}</p>}
        <div className="row">
          {p.open && <button className="btn main" onClick={open}><ExternalLink size={16} /> Open</button>}
          <button className="btn" onClick={copy}><Copy size={16} /> Copy</button>
          <button className="btn" onClick={share}><Share2 size={16} /> Share</button>
          <button className="btn" onClick={save}><Save size={16} /> Save</button>
        </div>
      </div>
    </div>
  )
}
