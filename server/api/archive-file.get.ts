import { defineEventHandler, getQuery, getHeader, getCookie, setHeader, createError } from 'h3';
import { archiveAssetType } from '~/utils/archiveAccess';
import type { ArchiveAccessResponse } from '~/models';

/** Archive counterpart to pdf.get.ts: validate the archive, then fetchAsset. */
export default defineEventHandler(async event => {
  setHeader(event, 'Cache-Control', 'private, no-store');
  setHeader(event, 'Vary', 'Cookie, Authorization');
  setHeader(event, 'X-Content-Type-Options', 'nosniff');
  const query = getQuery(event);
  const archiveId = typeof query.archiveId === 'string' ? query.archiveId : '';
  const hint = archiveAssetType(query.fileType);
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(archiveId) || !hint) {
    throw createError({ statusCode: 400, statusMessage: 'A valid archive ID and image/PDF file type are required.' });
  }
  const authorization = getHeader(event, 'authorization');
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1] || getCookie(event, 'gnp-user-identity');
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Sign in to view this archive document.' });
  const apiBase = String(useRuntimeConfig(event).public.proxyApiBaseURL).replace(/\/?$/, '/');
  const headers = { Authorization: `Bearer ${token}`, 'User-Agent': 'NewsPlus Archive Document Proxy' };
  let validation: Response;
  try {
    validation = await fetch(`${apiBase}subscription/validate-archive-access/${encodeURIComponent(archiveId)}`, {
      headers, signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Unable to reach the archive access service.' });
  }
  if (!validation.ok) {
    throw createError({ statusCode: [401, 403, 404].includes(validation.status) ? validation.status : 502, statusMessage: 'Archive access could not be verified.' });
  }
  let grant: ArchiveAccessResponse;
  try { grant = await validation.json(); }
  catch { throw createError({ statusCode: 502, statusMessage: 'Invalid archive access response.' }); }
  if (grant.success !== true || grant.result?.metadata?.hasAccess !== true) {
    throw createError({ statusCode: 403, statusMessage: 'Your subscription does not include this archive document.' });
  }
  // The caller supplies a hint, not authority: trust only the validated metadata.
  const assetType = archiveAssetType(grant.result.metadata.fileType);
  if (!assetType) throw createError({ statusCode: 415, statusMessage: 'This archive file type is not supported.' });
  if (hint.extension !== assetType.extension) throw createError({ statusCode: 409, statusMessage: 'Archive file type changed. Refresh the document.' });

  async function fetchAsset(name: string): Promise<Buffer> {
    let response: Response;
    try {
      response = await fetch(`${apiBase}g3/get-archived-file/gnp-master-documents/${encodeURIComponent(name)}`, {
        headers, signal: AbortSignal.timeout(30000),
      });
    } catch { throw createError({ statusCode: 502, statusMessage: 'Unable to reach archive file storage.' }); }
    if (!response.ok) {
      throw createError({ statusCode: [401, 403, 404].includes(response.status) ? response.status : 502, statusMessage: 'Archive file could not be loaded.' });
    }
    return Buffer.from(await response.arrayBuffer());
  }
  // The archive/page ID is deliberately not replaced by its parent newspaperId.
  const filename = `${archiveId}.${assetType.extension}`;
 

  const buffer = await fetchAsset(filename);
  setHeader(event, 'Content-Type', assetType.contentType);
  setHeader(event, 'Content-Disposition', `inline; filename="${filename}"`);
  setHeader(event, 'Content-Length', String(buffer.length));
  return buffer;
});
