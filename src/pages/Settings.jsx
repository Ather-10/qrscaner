export default function Settings({ s, set }) {
  const T = ({ k, l }) => <label className="card between"><span>{l}</span><input type="checkbox" checked={s[k]} onChange={(e) => set(k, e.target.checked)} /></label>
  return (
    <>
      <h2>Settings</h2>
      <label className="card between"><span>Theme</span>
        <select value={s.theme} onChange={(e) => set('theme', e.target.value)}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select></label>
      <T k="beep" l="Beep on scan" /><T k="vibrate" l="Vibrate on scan" /><T k="history" l="Save scan history" />
      <div className="card"><h3>About & Privacy</h3>
        <p className="mu">ScanPro v1.0. No account, no ads, no analytics. Scans, history and saved codes stay on your device. Nothing is uploaded. Links are never opened automatically; you always confirm first. The camera is used only while scanning.</p></div>
    </>
  )
}
