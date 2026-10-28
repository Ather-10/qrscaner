import { useState, useEffect } from 'react'
const D = { theme: 'dark', beep: true, vibrate: true, history: true }
export default function useSettings() {
  const [s, setS] = useState(() => { try { return { ...D, ...JSON.parse(localStorage.getItem('settings')) } } catch { return D } })
  useEffect(() => {
    try { localStorage.setItem('settings', JSON.stringify(s)) } catch {}
    const dark = s.theme === 'system' ? matchMedia('(prefers-color-scheme: dark)').matches : s.theme === 'dark'
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [s])
  return [s, (k, v) => setS((p) => ({ ...p, [k]: v }))]
}
