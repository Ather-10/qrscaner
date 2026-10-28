import { useState } from 'react'
import QRCode from 'qrcode'
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { Copy, Share2, Download, Save, RefreshCw } from 'lucide-react'
import { TYPES } from '../utils/qr.js'
import { add } from '../storage/store.js'

export default function Create({ toast }) {
  const [type, setType] = useState('URL'), [v, setV] = useState({}), [img, setImg] = useState(''), [text, setText] = useState('')
  const T = TYPES[type]
  const gen = async () => {
    const e = T.c(v); if (e) return toast(e)
    const t = T.b(v)
    try { setImg(await QRCode.toDataURL(t, { width: 720, margin: 2 })); setText(t) } catch { toast('Content too long for a QR code') }
  }
  const tmp = async () => (await Filesystem.writeFile({ path: `qr_${Date.now()}.png`, data: img.split(',')[1], directory: Directory.Cache })).uri
  const png = async () => {
    try {
      if (Capacitor.isNativePlatform()) await Share.share({ files: [await tmp()], dialogTitle: 'Save / send PNG' })
      else { const a = document.createElement('a'); a.href = img; a.download = 'qrcode.png'; a.click() }
    } catch {}
  }
  const share = async () => { try { Capacitor.isNativePlatform() ? await Share.share({ files: [await tmp()] }) : await Share.share({ text }) } catch {} }
  const copy = async () => { try { await navigator.clipboard.writeText(text); toast('Copied') } catch { toast('Copy failed') } }
  const save = () => { add('saved', { id: Date.now() + '', text, type, time: Date.now() }); toast('Saved') }
  return (
    <>
      <h2>Create QR</h2>
      <div className="chips">{Object.keys(TYPES).map((k) => <button key={k} className={'chip' + (k === type ? ' on' : '')} onClick={() => { setType(k); setV({}); setImg('') }}>{k}</button>)}</div>
      <div className="card">
        {T.f.map(([k, l, t]) => <input key={k} type={t || 'text'} placeholder={l} value={v[k] || ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} />)}
        <button className="btn main" onClick={gen}><RefreshCw size={16} /> {img ? 'Regenerate' : 'Generate'}</button>
      </div>
      {img && (
        <div className="card">
          <img className="qr" src={img} alt="QR code" />
          <div className="row">
            <button className="btn" onClick={copy}><Copy size={16} /> Copy</button>
            <button className="btn" onClick={share}><Share2 size={16} /> Share</button>
            <button className="btn" onClick={png}><Download size={16} /> PNG</button>
            <button className="btn" onClick={save}><Save size={16} /> Save</button>
          </div>
        </div>
      )}
    </>
  )
}
