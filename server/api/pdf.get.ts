import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const target = typeof q.url === 'string' && /^https?:\/\//.test(q.url) ? q.url : null

  if (!target) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL'
    })
  }

  const key = createHash('sha1').update(target).digest('hex')
  const cachePath = path.join('/tmp', `pdf-cache-${key}.pdf`)

  let buf: Buffer | null = null
  try {
    buf = await fs.readFile(cachePath)
  } catch {
    /* not cached yet */
  }

  if (!buf) {
    const res = await fetch(target, {
      headers: { 'User-Agent': 'NewsPlus PDF Proxy' }
    })
    if (!res.ok) {
      throw createError({
        statusCode: 502,
        statusMessage: `Upstream fetch failed (${res.status})`
      })
    }
    buf = Buffer.from(await res.arrayBuffer())
    fs.writeFile(cachePath, buf).catch(() => {})
  }

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Length', buf.length.toString())
  setHeader(event, 'Cache-Control', 'public, max-age=7200')
  return buf
})
