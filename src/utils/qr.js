const req = (v, ...k) => (k.some((x) => !v[x]?.trim()) ? 'Please fill all required fields' : null)
const urlOk = (v) => req(v, 'url') || (/\s/.test(v.url) || !v.url.includes('.') ? 'Enter a valid URL' : null)
const urlB = (v) => (/^https?:\/\//i.test(v.url.trim()) ? v.url.trim() : 'https://' + v.url.trim())
export const TYPES = {
  URL: { f: [['url', 'Website URL']], b: urlB, c: urlOk },
  Text: { f: [['text', 'Text']], b: (v) => v.text, c: (v) => req(v, 'text') },
  WiFi: { f: [['ssid', 'Network name'], ['password', 'Password'], ['enc', 'Security (WPA / WEP / nopass)']], b: (v) => `WIFI:T:${v.enc || 'WPA'};S:${v.ssid};P:${v.password || ''};;`, c: (v) => req(v, 'ssid') },
  Contact: { f: [['name', 'Full name'], ['phone', 'Phone'], ['email', 'Email']], b: (v) => `BEGIN:VCARD\nVERSION:3.0\nFN:${v.name}\nTEL:${v.phone || ''}\nEMAIL:${v.email || ''}\nEND:VCARD`, c: (v) => req(v, 'name') },
  Email: { f: [['to', 'Email address'], ['subject', 'Subject'], ['body', 'Message']], b: (v) => `mailto:${v.to}?subject=${encodeURIComponent(v.subject || '')}&body=${encodeURIComponent(v.body || '')}`, c: (v) => (/^\S+@\S+\.\S+$/.test(v.to || '') ? null : 'Enter a valid email') },
  Phone: { f: [['num', 'Phone number']], b: (v) => 'tel:' + v.num, c: (v) => (/^\+?[\d\s()-]{5,}$/.test(v.num || '') ? null : 'Enter a valid number') },
  SMS: { f: [['num', 'Phone number'], ['msg', 'Message']], b: (v) => `SMSTO:${v.num}:${v.msg || ''}`, c: (v) => req(v, 'num') },
  Location: { f: [['lat', 'Latitude'], ['lng', 'Longitude']], b: (v) => `geo:${v.lat},${v.lng}`, c: (v) => (!v.lat || !v.lng || isNaN(v.lat) || isNaN(v.lng) ? 'Enter valid coordinates' : null) },
  Social: { f: [['url', 'Profile link']], b: urlB, c: urlOk },
  Event: { f: [['title', 'Event title'], ['start', 'Starts', 'datetime-local'], ['end', 'Ends', 'datetime-local']], b: (v) => { const d = (x) => x.replace(/[-:]/g, '') + '00'; return `BEGIN:VEVENT\nSUMMARY:${v.title}\nDTSTART:${d(v.start)}\nDTEND:${d(v.end)}\nEND:VEVENT` }, c: (v) => req(v, 'title', 'start', 'end') },
}
export const parse = (t) => {
  const s = t.trim(), u = s.toLowerCase()
  const kv = (k) => (s.match(new RegExp(k + ':((?:\\\\.|[^;])*)')) || [])[1] || ''
  const line = (k) => (s.match(new RegExp('^' + k + '[^:\\n]*:(.*)$', 'mi')) || [])[1] || ''
  if (/^https?:\/\//i.test(s)) return { type: 'URL', open: s, info: s }
  if (u.startsWith('wifi:')) return { type: 'WiFi', info: `Network: ${kv('S')}\nPassword: ${kv('P') || '-'}\nSecurity: ${kv('T') || '-'}` }
  if (u.startsWith('mailto:')) return { type: 'Email', open: s, info: s.slice(7).split('?')[0] }
  if (u.startsWith('tel:')) return { type: 'Phone', open: s, info: s.slice(4) }
  if (/^smsto?:/i.test(s)) return { type: 'SMS', open: s, info: s.replace(/^smsto?:/i, '') }
  if (u.startsWith('geo:')) return { type: 'Location', open: s, info: s.slice(4) }
  if (u.startsWith('begin:vcard')) return { type: 'Contact', info: `Name: ${line('FN')}\nPhone: ${line('TEL')}\nEmail: ${line('EMAIL')}` }
  if (u.startsWith('begin:vevent')) return { type: 'Event', info: `Title: ${line('SUMMARY')}\nStart: ${line('DTSTART')}\nEnd: ${line('DTEND')}` }
  return { type: 'Text', info: s }
}
