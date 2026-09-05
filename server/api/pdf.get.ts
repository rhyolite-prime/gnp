import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { getHeaders } from 'h3'

// Mirrors C# NewsPaper model
interface NewsPaper {
  id: string          // GUID – used to build the PDF file name
  documentId: string
  title: string
  publicationId: string
  publicationName: string
  publicationDate: string
  editionNumber: string
  fileType: string
  thumbnailId: string
  isFree: boolean
  isPublished: boolean
  [key: string]: unknown
}

// Mirrors C# NewsPaperResponse : BaseApiResponse
interface NewsPaperResponse {
  success: boolean
  message?: string
  result: NewsPaper | null
}


/**
 * Decode a JWT without verifying the signature so we can extract
 * the userId and email claims (the signature is already trusted
 * by the upstream service that issued it).
 */
function decodeAccessToken(token: string): { userId: string; email: string } {
  try {
    // JWT format: header.payload.signature – decode the middle segment
    const payloadB64 = token.split('.')[1]
    if (!payloadB64) return { userId: '', email: '' }
    const json = Buffer.from(payloadB64, 'base64url').toString('utf8')
    const claims: Record<string, unknown> = JSON.parse(json)
    const userId =
      (claims['sub'] as string) ||
      (claims['userId'] as string) ||
      (claims['nameid'] as string) ||
      ''
    const email =
      (claims['email'] as string) ||
      (claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] as string) ||
      ''
    return { userId, email }
  } catch {
    return { userId: '', email: '' }
  }
}

export default defineEventHandler(async (event) => {
  const q = getQuery(event)

  const uniqueId    = typeof q.uniqueId    === 'string' ? q.uniqueId    : null
  const accessToken = typeof q.accessToken === 'string' ? q.accessToken : null

  if (!uniqueId || !accessToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required query params: uniqueId, accessToken',
    })
  }

  const headers = getHeaders(event)
  const userAgent = headers['user-agent'] || 'Unknown'
  const acceptLanguage = headers['accept-language'] || 'en-US'
  
  // Optionally get other useful headers
  const referer = headers['referer'] || ''
  const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || event.context.clientAddress || ''

  console.log('[pdf.get.ts] User-Agent:', userAgent)
  console.log('[pdf.get.ts] IP:', ip)
  console.log('[pdf.get.ts] Accept-Language:', acceptLanguage)

  // ── Step 1: Resolve newspaper details & validate subscription ────────────
  // Mirrors GetNewsPaperDetails(): decode the JWT then POST to grant-newspaper-access.
  const { userId, email } = decodeAccessToken(accessToken)

  const config = useRuntimeConfig()
  // proxyApiBaseURL is public so it lives under config.public
  const apiBase: string = (config.public as Record<string, string>).proxyApiBaseURL

  console.log('apiBase->', apiBase); 

  console.log('userId->', userId); 

  console.log('email->', email); 

  const grantUrl = `${apiBase}subscription/grant-newspaper-access`

  let newsPaperDetails: NewsPaperResponse | null = null

  try {
    const grantRes = await fetch(grantUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uniqueId, userId, email }),
    })

    if (!grantRes.ok) {
      throw createError({
        statusCode: 403,
        statusMessage: `Subscription grant failed (${grantRes.status})`,
      })
    }

    newsPaperDetails = (await grantRes.json()) as NewsPaperResponse
  } catch (err: unknown) {
    if ((err as { statusCode?: number }).statusCode) throw err
    throw createError({ statusCode: 502, statusMessage: 'Failed to reach subscription service' })
  }

  const newspaperResult = newsPaperDetails?.result
  if (!newspaperResult?.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied or newspaper not found',
    })
  }

  const fileName = `${newspaperResult.id}.pdf`

  // ── Step 2: Fetch the PDF asset ──────────────────────────────────────────
  // Mirrors GetFileAsset(): GET /g3/get-file/gnp-master-documents/{fileName}
  // with the user's Bearer token as authorization.
  const fileUrl = `${apiBase}g3/get-file/gnp-master-documents/${fileName}`

  // Cache by (fileName + userId) so different users get their own cached copy
  // and the cache key is stable regardless of token rotation.
  const cacheKey  = createHash('sha1').update(`${fileName}:${userId}`).digest('hex')
  const cachePath = path.join('/tmp', `pdf-cache-${cacheKey}.pdf`)

  let buf: Buffer | null = null
  try {
    buf = await fs.readFile(cachePath)
  } catch {
    /* not cached yet */
  }

  if (!buf) {
    let fileRes: Response
    try {
      fileRes = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent':  'NewsPlus PDF Proxy',
        },
      })
    } catch {
      throw createError({ statusCode: 502, statusMessage: 'Failed to reach file storage service' })
    }

    if (!fileRes.ok) {
      throw createError({
        statusCode: 502,
        statusMessage: `File fetch failed (${fileRes.status})`,
      })
    }

    buf = Buffer.from(await fileRes.arrayBuffer())
    // Write to disk-cache in the background; don't block the response
    fs.writeFile(cachePath, buf).catch(() => {})
  } 

  // ── Step 3: Track   Engagement (fire-and-forget) ─────────────────────────
  // We fire this asynchronously so it doesn't block the PDF from streaming to the user.
  // The upstream API will resolve user_id and partner_id from the JWT token.

   // Extract device type from User-Agent
  const deviceType = detectDeviceType(userAgent)

  const trackUrl = `${apiBase}news-papers/track-user-engagement`
  fetch(trackUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      newspaperId: newspaperResult.id,
      timeSpentSeconds: 5,
      deviceType: deviceType,
      userAgent: userAgent,
    })
  }).catch((err) => console.error('[pdf.get.ts] Failed to track engagement:', err))

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Length', buf.length.toString())
  setHeader(event, 'Cache-Control', 'public, max-age=7200')
  return buf
})


/**
 * Detect device type from User-Agent string
 */
function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'mobile'
  }
  
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet'
  }
  
  return 'web'
}