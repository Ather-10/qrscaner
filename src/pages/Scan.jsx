import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Zap, Image as Img, RefreshCw } from 'lucide-react'

export default function Scan({ onResult, toast }) {
  const ref = useRef(null), last = useRef({ t: '', at: 0 }), file = useRef(null)
  const [on, setOn] = useState(false), [torch, setTorch] = useState(false), [err, setErr] = useState(''), [busy, setBusy] = useState(true)
  const stop = async () => {
    const s = ref.current; ref.current = null
    if (s) { try { await s.stop(); s.clear() } catch {} }
    setOn(false); setTorch(false)
  }
  const found = (t) => {
    const n = Date.now()
    if (t === last.current.t && n - last.current.at < 3000) return
    last.current = { t, at: n }; stop(); onResult(t)
  }
  const start = async () => {
    setErr(''); setBusy(true)
    try {
      const s = new Html5Qrcode('reader'); ref.current = s
      await s.start({ facingMode: 'environment' }, { fps: 12, qrbox: { width: 240, height: 240 } }, found, () => {})
      setOn(true)
    } catch { setErr('Camera unavailable. Allow camera permission in Android settings and retry.') }
    setBusy(false)
  }
  useEffect(() => { start(); return () => { stop() } }, [])
  const flash = async () => {
    try { await ref.current.applyVideoConstraints({ advanced: [{ torch: !torch }] }); setTorch(!torch) } catch { toast('Flashlight not supported') }
  }
  const pick = async (e) => {
    const f = e.target.files?.[0]; e.target.value = ''
    if (!f) return
    await stop()
    try { found(await new Html5Qrcode('reader-file').scanFile(f, false)) } catch { toast('No QR code found in image') }
  }
  return (
    <>
      <h2>Scan</h2>
      <div className="card"><div id="reader" />{err && <p className="err">{err}</p>}{busy && !err && <p className="mu">Starting camera…</p>}</div>
      <div id="reader-file" hidden />
      <div className="row">
        {!on ? <button className="btn main" onClick={start}><RefreshCw size={16} /> Scan again</button>
          : <button className="btn" onClick={flash}><Zap size={16} /> {torch ? 'Torch off' : 'Torch on'}</button>}
        <button className="btn" onClick={() => file.current.click()}><Img size={16} /> Gallery</button>
        <input ref={file} type="file" accept="image/*" hidden onChange={pick} />
      </div>
    </>
  )
}
