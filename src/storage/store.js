const get = (k) => { try { return JSON.parse(localStorage.getItem(k) || '[]') } catch { return [] } }
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
export const list = get
export const add = (k, item) => set(k, [item, ...get(k).filter((x) => x.text !== item.text)].slice(0, 300))
export const remove = (k, id) => set(k, get(k).filter((x) => x.id !== id))
export const clear = (k) => set(k, [])
