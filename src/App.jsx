import { useEffect, useState } from 'react'
import { App as Cap } from '@capacitor/app'
import { Home as HomeI, ScanLine, QrCode, History as HistI, Settings as SetI } from 'lucide-react'
import useSettings from './hooks/useSettings.js'
import { parse } from './utils/qr.js'
import { add } from './storage/store.js'
import Home from './pages/Home.jsx'
import Scan from './pages/Scan.jsx'
import Create from './pages/Create.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'
import ResultSheet from './components/ResultSheet.jsx'

const NAV = [['home', 'Home', HomeI], ['scan', 'Scan', ScanLine], ['create', 'Create', QrCode], ['history', 'History', HistI], ['settings', 'Settings', SetI]]

export default function App() {
  const [tab, setTab] = useState('home'), [sheet, setSheet] = useState(null), [msg, setMsg] = useState('')
  const [s, set] = useSettings()
  const toast = (m) => { setMsg(m); setTimeout(() => setMsg(''), 1800) }

  useEffect(() => {
    let h
    Cap.addListener('backButton', () => { if (sheet) setSheet(null); else if (tab !== 'home') setTab('home'); else Cap.exitApp() }).then((x) => (h = x)).catch(() => {})
    return () => h?.remove()
  }, [tab, sheet])

  const onResult = (text) => {
    const item = { id: Date.now() + '', text, type: parse(text).type, time: Date.now() }
    if (s.vibrate) navigator.vibrate?.(120)
    if (s.beep) { try { const c = new AudioContext(), o = c.createOscillator(); o.frequency.value = 880; o.connect(c.destination); o.start(); o.stop(c.currentTime + 0.12) } catch {} }
    if (s.history) add('history', item)
    setSheet(item)
  }

  return (
    <div className="app">
      {tab === 'home' && <Home go={setTab} onOpen={setSheet} />}
      {tab === 'scan' && <Scan onResult={onResult} toast={toast} />}
      {tab === 'create' && <Create toast={toast} />}
      {tab === 'history' && <History onOpen={setSheet} toast={toast} />}
      {tab === 'settings' && <Settings s={s} set={set} />}
      {sheet && <ResultSheet item={sheet} onClose={() => setSheet(null)} toast={toast} />}
      {msg && <div className="toast">{msg}</div>}
      <nav>{NAV.map(([k, l, I]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><I size={22} /><span>{l}</span></button>)}</nav>
    </div>
  )
}
