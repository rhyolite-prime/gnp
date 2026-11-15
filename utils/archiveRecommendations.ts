import type { ArchiveAccessMetadata, ArchiveSearchItem } from '~/models';

const day = (value: string) => value?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || '';
const normalise = (value: string) => (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
/** Trimmed string; numbers are accepted because the API sends `pageNumber` as a number. */
const text = (value: unknown) => typeof value === 'string' ? value.trim() : typeof value === 'number' && Number.isFinite(value) ? String(value) : '';

/** One card in the "Keep reading" strip on /archives/:id. */
export interface KeepReadingPage {
  /** Route id for `/archives/:id`: the record's `id`, or its `newspaperId` when the API sends none. */
  id: string;
  newspaperId: string;
  publicationName: string;
  publicationDate: string;
  pageNumber: string;
  thumbnailId: string;
  fileType: string;
  /** False when the API suggested a page from another publication or date. */
  sameEdition: boolean;
}

/**
 * Body for POST news-papers/get-related-archived-content: the archive page
 * being read (route id) and the date it was published.
 */
export function buildRelatedArchivePayload(currentId: string, metadata: ArchiveAccessMetadata) {
  return {
    id: text(currentId),
    publicationDate: text(metadata.publicationDate),
  };
}

/**
 * Same publication on the same day. `newspaperId` is not compared: every archive
 * page carries its own, so two pages of one edition never share it.
 */
export function isSameEdition(item: { publicationName?: string; publicationDate?: string }, metadata: ArchiveAccessMetadata): boolean {
  const date = day(metadata.publicationDate);
  return !!date && day(item.publicationDate || '') === date && normalise(item.publicationName || '') === normalise(metadata.publicationName);
}

/**
 * Turns the `result` of news-papers/get-related-archived-content into the cards
 * for the "Keep reading" strip. The API returns a plain array; the standard
 * pagination envelope (`{ data: [...] }`) and a single record are tolerated.
 * The page being read and duplicates are dropped. Pages of the current edition
 * come first in page order; anything else keeps the order the API ranked it in.
 */
export function keepReadingPages(result: unknown, metadata: ArchiveAccessMetadata, currentId: string): KeepReadingPage[] {
  const envelope = result as { data?: unknown } | null | undefined;
  const records: unknown[] = Array.isArray(result) ? result
    : Array.isArray(envelope?.data) ? envelope.data
    : result && typeof result === 'object' ? [result] : [];

  const seen = new Set<string>([text(currentId)]);
  const pages: KeepReadingPage[] = [];
  for (const record of records) {
    if (!record || typeof record !== 'object') continue;
    const source = record as Record<string, unknown>;
    const ownId = text(source.id);
    const newspaperId = text(source.newspaperId);
    // The API sends no `id` on these records, so `newspaperId` is the only handle
    // on the page. A record identified that way is the page being read when it
    // carries the current document's `newspaperId`.
    const id = ownId || newspaperId;
    if (!id || seen.has(id) || (!ownId && id === text(metadata.newspaperId))) continue;
    seen.add(id);
    const page = {
      id,
      newspaperId,
      publicationName: text(source.publicationName),
      publicationDate: text(source.publicationDate),
      pageNumber: text(source.pageNumber),
      thumbnailId: text(source.thumbnailId),
      fileType: text(source.fileType),
    };
    pages.push({ ...page, sameEdition: isSameEdition(page, metadata) });
  }

  const pageOrder = (page: KeepReadingPage) => Number(page.pageNumber) || Infinity;
  return pages.sort((a, b) => {
    if (a.sameEdition !== b.sameEdition) return a.sameEdition ? -1 : 1;
    if (!a.sameEdition || pageOrder(a) === pageOrder(b)) return 0;
    return pageOrder(a) - pageOrder(b);
  });
}

export function rankRelatedArchives(items: ArchiveSearchItem[], currentId: string, limit = 3): ArchiveSearchItem[] {
  const unique = new Map<string, ArchiveSearchItem>();
  for (const item of items) {
    if (!item.id || item.id === currentId) continue;
    const previous = unique.get(item.id);
    if (!previous || (Number(item.relevance) || 0) > (Number(previous.relevance) || 0)) unique.set(item.id, item);
  }
  return [...unique.values()].sort((a, b) => (Number(b.relevance) || 0) - (Number(a.relevance) || 0)).slice(0, Math.max(0, limit));
}

export function archiveThumbnail(value: string): string {
  const raw = (value || '').trim();
  if (raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\')) return raw;
  const url = raw.match(/https?:\/\/[^\s)\]]+/i)?.[0];
  if (!url) return '';
  try { const parsed = new URL(url); return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : ''; }
  catch { return ''; }
}
