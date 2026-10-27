'use client'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

const detect = (t) =>
  /^https?:\/\//i.test(t) ? 'URL' :
  /^WIFI:/i.test(t) ? 'WiFi' :
  /^mailto:/i.test(t) ? 'Email' :
  /^tel:/i.test(t) ? 'Phone' :
  /^BEGIN:VCARD/i.test(t) ? 'Contact' : 'Text'

export default function Home() {
  const [tab, setTab] = useState('scan')
  const [scanning, setScanning] = useState(false)
  const [torch, setTorch] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [text, setText] = useState('https://')
  const [qrImg, setQrImg] = useState('')
  const [msg, setMsg] = useState('')
  const scanner = useRef(null)
  const fileRef = useRef(null)

  // load history
  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem('qr-history') || '[]')) } catch {}
    return () => { stopScan() }
    // eslint-disable-next-line
  }, [])

  const save = (h) => {
    setHistory(h)
    try { localStorage.setItem('qr-history', JSON.stringify(h)) } catch {}
  }

  const feedback = () => {
    try { navigator.vibrate?.(150) } catch {}
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator(); o.frequency.value = 880
      o.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.12)
    } catch {}
  }

  const handleResult = (value) => {
    const item = { text: value, type: detect(value), time: Date.now() }
    setResult(item)
    feedback()
    save([item, ...history.filter((h) => h.text !== value)].slice(0, 100))
  }

  const startScan = async () => {
    setMsg(''); setResult(null)
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const s = new Html5Qrcode('reader')
      scanner.current = s
      await s.start(
        { facingMode: 'environment' },
        { fps: 12, qrbox: { width: 250, height: 250 } },
        async (value) => { await stopScan(); handleResult(value) },
        () => {}
      )
      setScanning(true)
    } catch (e) {
      setMsg('Camera permission do ya HTTPS/localhost par chalao.')
    }
  }

  const stopScan = async () => {
    const s = scanner.current
    scanner.current = null
    if (s) { try { await s.stop(); s.clear() } catch {} }
    setScanning(false); setTorch(false)
  }

  const toggleTorch = async () => {
    try {
      await scanner.current.applyVideoConstraints({ advanced: [{ torch: !torch }] })
      setTorch(!torch)
    } catch { setMsg('Is device par flashlight support nahi hai.') }
  }

  const scanFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMsg('')
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const s = new Html5Qrcode('reader-file')
      const value = await s.scanFile(file, false)
      handleResult(value)
    } catch { setMsg('Image mein QR code nahi mila.') }
    e.target.value = ''
  }

  const copy = async (t) => { await navigator.clipboard?.writeText(t); setMsg('Copied ✅') }
  const share = (t) => navigator.share ? navigator.share({ text: t }) : copy(t)
  const toHref = (r) => (r.type === 'URL' || r.type === 'Email' || r.type === 'Phone') ? r.text : null

  useEffect(() => {
    if (!text.trim()) return setQrImg('')
    QRCode.toDataURL(text, { width: 512, margin: 1 }).then(setQrImg).catch(() => {})
  }, [text])

  const Result = ({ r }) => (
    <div className="card">
      <span className="badge">{r.type}</span>
      <p className="res">{r.text}</p>
      <div className="row">
        <button className="btn" onClick={() => copy(r.text)}>Copy</button>
        <button className="btn" onClick={() => share(r.text)}>Share</button>
        {toHref(r) && <a className="btn main" href={toHref(r)} target="_blank" rel="noreferrer">Open</a>}
      </div>
    </div>
  )

  return (
    <main className="wrap">
      <h1>QR Scanner <span>Pro</span></h1>

      <div className="tabs">
        {[['scan', 'Scan'], ['gen', 'Generate'], ['hist', 'History']].map(([k, l]) => (
          <button key={k} className={tab === k ? 'on' : ''}
            onClick={() => { if (k !== 'scan') stopScan(); setTab(k); setMsg('') }}>{l}</button>
        ))}
      </div>

      {tab === 'scan' && (
        <>
          <div className="card">
            <div id="reader" />
            <div id="reader-file" style={{ display: 'none' }} />
            <div className="row">
              {!scanning
                ? <button className="btn main" onClick={startScan}>📷 Start Camera</button>
                : <button className="btn red" onClick={stopScan}>Stop</button>}
              {scanning && <button className="btn" onClick={toggleTorch}>{torch ? '🔦 Torch Off' : '🔦 Torch On'}</button>}
              <button className="btn" onClick={() => fileRef.current.click()}>🖼️ Image</button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={scanFile} />
            </div>
          </div>
          {msg && <p className="muted">{msg}</p>}
          {result && <Result r={result} />}
        </>
      )}

      {tab === 'gen' && (
        <div className="card">
          <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Link, text, WiFi, number likho..." />
          {qrImg && <img className="qr" src={qrImg} width={260} height={260} alt="QR code" />}
          {qrImg && (
            <div className="row">
              <a className="btn main" href={qrImg} download="qrcode.png">⬇ Download PNG</a>
              <button className="btn" onClick={() => copy(text)}>Copy text</button>
            </div>
          )}
        </div>
      )}

      {tab === 'hist' && (
        <div className="card">
          {history.length === 0 && <p className="muted">Abhi koi scan nahi hua.</p>}
          {history.map((h) => (
            <div key={h.time} className="item" onClick={() => { setResult(h); setTab('scan') }}>
              <span className="badge">{h.type}</span>
              <div className="res">{h.text.slice(0, 90)}</div>
              <small>{new Date(h.time).toLocaleString()}</small>
            </div>
          ))}
          {history.length > 0 && (
            <div className="row"><button className="btn red" onClick={() => save([])}>Clear all</button></div>
          )}
        </div>
      )}
    </main>
  )
}
