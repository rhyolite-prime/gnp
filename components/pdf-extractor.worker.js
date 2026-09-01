const seen = new Set()

const isJunk = (s) =>
  /daily graphic/i.test(s) || /^page \d+$/i.test(s) || /^\d{1,3}$/.test(s) ||
  /^(www\.|graphic online)/i.test(s)

const buildParas = (bodyItems) => {
  let byline = ''
  let raw = ''
  let dropCap = false
  for (const it of bodyItems) {
    if (/^[A-Z]$/.test(it.str) && it.size > 60) {
      raw += (raw ? ' ' : '') + it.str
      dropCap = true
      continue
    }
    if (!byline && /^by [a-z]/i.test(it.str) && it.str.length < 60) { byline = it.str; continue }
    if (dropCap) { raw += it.str; dropCap = false }
    else if (raw.endsWith('-')) raw = raw.slice(0, -1) + it.str
    else raw += (raw ? ' ' : '') + it.str
    if (raw.length > 12000) break
  }
  raw = raw.replace(/\s+/g, ' ').trim()
  const sentences = raw.match(/[^.!?]+[.!?]+["””']?\s*/g) || (raw ? [raw] : [])
  const paragraphs = []
  for (let i = 0; i < sentences.length; i += 3) {
    const para = sentences.slice(i, i + 3).join('').trim()
    if (para.length > 2) paragraphs.push(para)
  }
  return { byline, paragraphs }
}

self.onmessage = (e) => {
  if (e.data.type === 'extract-page') {
    const { p, items } = e.data
    
    if (!items || !items.length) {
      self.postMessage({ type: 'page-result', p, blocks: [], found: [] })
      return
    }

    const sizes = items.map((i) => i.size).filter((s) => s > 0).sort((a, b) => a - b)
    const median = sizes[Math.floor(sizes.length / 2)] || 9
    const thr = Math.max(14, median * 1.6)

    const isHeadlineItem = (it) =>
      it.size >= thr && it.size <= 64 &&
      /[a-zA-Z]{2,}/.test(it.str) && !isJunk(it.str)

    const bodyFilter = (it) =>
      (it.size < thr && it.size >= median * 0.6 && !isJunk(it.str)) ||
      (it.size > 60 && /^[A-Z]$/.test(it.str)) // keep drop caps

    // group consecutive headline items of similar size
    const groups = []
    let cur = null
    items.forEach((it, idx) => {
      if (isHeadlineItem(it)) {
        if (cur && Math.max(cur.size, it.size) / Math.min(cur.size, it.size) < 1.25 && idx - cur.lastIdx <= 2) {
          if (cur.text.endsWith('-')) cur.text = cur.text.slice(0, -1) + it.str
          else cur.text += ' ' + it.str
          cur.lastIdx = idx
        } else {
          if (cur) groups.push(cur)
          cur = { text: it.str, size: it.size, startIdx: idx, lastIdx: idx }
        }
      }
    })
    if (cur) groups.push(cur)

    const valid = groups.filter((g) => {
      const t = g.text.replace(/\s+/g, ' ').trim()
      return t.length >= 12 && t.length <= 160 && /[a-zA-Z]/.test(t) &&
        !/^\d+$/.test(t) && !/^[—–•\-]/.test(t)
    })

    /* ── build Liquid Mode blocks: [intro text] → (headline → byline → paragraphs)* ── */
    const blocks = []
    const ranges = []
    if (!valid.length) {
      ranges.push({ s: 0, e: items.length, g: null })
    } else {
      if (valid[0].startIdx > 0) ranges.push({ s: 0, e: valid[0].startIdx, g: null })
      valid.forEach((g, gi) =>
        ranges.push({ s: g.lastIdx + 1, e: gi + 1 < valid.length ? valid[gi + 1].startIdx : items.length, g })
      )
    }

    const found = []
    valid.forEach((g, gi) => {
      const title = g.text.replace(/\s+/g, ' ').trim()
      const dedupeKey = title.toLowerCase().slice(0, 60)
      if (seen.has(dedupeKey)) return
      seen.add(dedupeKey)
      const endIdx = gi + 1 < valid.length ? valid[gi + 1].startIdx : items.length
      const { byline, paragraphs } = buildParas(items.slice(g.lastIdx + 1, endIdx).filter(bodyFilter))
      found.push({ id: `${p}-${gi}`, page: p, title, byline, paragraphs })
    })

    for (const r of ranges) {
      if (r.g) blocks.push({ type: 'h', text: r.g.text.replace(/\s+/g, ' ').trim() })
      const { byline, paragraphs } = buildParas(items.slice(r.s, r.e).filter(bodyFilter))
      if (byline) blocks.push({ type: 'byline', text: byline })
      paragraphs.forEach((t, i) => blocks.push({ type: 'p', text: t, lede: r.g && i === 0 }))
    }

    self.postMessage({ type: 'page-result', p, blocks, found })
  } else if (e.data.type === 'finish') {
    self.postMessage({ type: 'done' })
  }
}
