import type { ArchiveAccessMetadata, ArchiveSearchItem, RelatedArchivedContent } from '~/models';

const day = (value: string) => value?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || '';
const normalise = (value: string) => (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
/** Trimmed string; numbers are accepted because the API is loose about `pageNumber`. */
const text = (value: unknown) => typeof value === 'string' ? value.trim() : typeof value === 'number' && Number.isFinite(value) ? String(value) : '';

/** One card in the "Keep reading" strip on /archives/:id. */
export type KeepReadingPage =
  Pick<RelatedArchivedContent, 'id' | 'newspaperId' | 'publicationName' | 'publicationDate' | 'pageNumber' | 'thumbnailId' | 'fileType'>
  & { /** False when the API suggested a page from another edition. */ sameEdition: boolean };

/**
 * Body for POST news-papers/get-related-archived-content: describes the archive
 * page being read so the API can return the pages to continue with.
 */
export function buildRelatedArchivePayload(currentId: string, metadata: ArchiveAccessMetadata) {
  return {
    id: text(currentId),
    newspaperId: text(metadata.newspaperId),
    publicationName: text(metadata.publicationName),
    publicationDate: text(metadata.publicationDate),
    fileType: text(metadata.fileType),
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
  };
}

/** Edition IDs decide when both sides have one; otherwise publication name + date. */
export function isSameEdition(item: { newspaperId?: string; publicationName?: string; publicationDate?: string }, metadata: ArchiveAccessMetadata): boolean {
  const editionId = text(item.newspaperId);
  if (editionId && text(metadata.newspaperId)) return editionId === text(metadata.newspaperId);
  const date = day(metadata.publicationDate);
  return !!date && day(item.publicationDate || '') === date && normalise(item.publicationName || '') === normalise(metadata.publicationName);
}

/**
 * Turns the `result` of news-papers/get-related-archived-content into the cards
 * for the "Keep reading" strip. Accepts a plain array, the standard pagination
 * envelope (`{ data: [...] }`) or a single record. The page being read and
 * duplicates are dropped. Pages of the current edition come first in page order;
 * anything from another edition keeps the order the API ranked it in.
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
    const id = text(source.id);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const page = {
      id,
      newspaperId: text(source.newspaperId),
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
