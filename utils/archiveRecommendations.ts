import type { ArchiveAccessMetadata, ArchiveSearchItem } from '~/models';

const day = (value: string) => value?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || '';
const normalise = (value: string) => (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
/** Trimmed string; numbers are accepted because the API sends `pageNumber` as a number. */
const text = (value: unknown) => typeof value === 'string' ? value.trim() : typeof value === 'number' && Number.isFinite(value) ? String(value) : '';

/** One archive page offered for further reading on /archives/:id. */
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
 * True when `page` is the archive page being read: it carries the route id, or
 * (for records the API identifies by `newspaperId`) the open document's own
 * `newspaperId`.
 */
export function isCurrentArchivePage(page: { id: string }, currentId: string, metadata: ArchiveAccessMetadata | null | undefined): boolean {
  const id = text(page.id);
  return !!id && (id === text(currentId) || id === text(metadata?.newspaperId));
}

/**
 * Normalises the `result` of news-papers/get-related-archived-content. The API
 * returns a plain array; the standard pagination envelope (`{ data: [...] }`)
 * and a single record are tolerated. Duplicates and records with no usable id
 * are dropped; nothing else is filtered and the API order is kept.
 */
export function relatedArchivePages(result: unknown, metadata: ArchiveAccessMetadata): KeepReadingPage[] {
  const envelope = result as { data?: unknown } | null | undefined;
  const records: unknown[] = Array.isArray(result) ? result
    : Array.isArray(envelope?.data) ? envelope.data
    : result && typeof result === 'object' ? [result] : [];

  const seen = new Set<string>();
  const pages: KeepReadingPage[] = [];
  for (const record of records) {
    if (!record || typeof record !== 'object') continue;
    const source = record as Record<string, unknown>;
    const newspaperId = text(source.newspaperId);
    // The API sends no `id` on these records, so `newspaperId` is the only handle on the page.
    const id = text(source.id) || newspaperId;
    if (!id || seen.has(id)) continue;
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
  return pages;
}

/** Pages of the current edition first, in page order; anything else keeps its given order. */
function inReadingOrder(pages: KeepReadingPage[]): KeepReadingPage[] {
  const pageOrder = (page: KeepReadingPage) => Number(page.pageNumber) || Infinity;
  return [...pages].sort((a, b) => {
    if (a.sameEdition !== b.sameEdition) return a.sameEdition ? -1 : 1;
    if (!a.sameEdition || pageOrder(a) === pageOrder(b)) return 0;
    return pageOrder(a) - pageOrder(b);
  });
}

/** The other pages to keep reading: everything the API returned except the page being read. */
export function keepReadingPages(result: unknown, metadata: ArchiveAccessMetadata, currentId: string): KeepReadingPage[] {
  return inReadingOrder(relatedArchivePages(result, metadata).filter(page => !isCurrentArchivePage(page, currentId, metadata)));
}

/** Stand-in for the page being read when no record of it (page number, thumbnail) is known yet. */
export function currentArchivePage(currentId: string, metadata: ArchiveAccessMetadata): KeepReadingPage {
  return {
    id: text(currentId),
    newspaperId: text(metadata.newspaperId),
    publicationName: text(metadata.publicationName),
    publicationDate: text(metadata.publicationDate),
    pageNumber: '',
    thumbnailId: '',
    fileType: text(metadata.fileType),
    sameEdition: true,
  };
}

/**
 * The page list beside the reader: the other pages plus the page being read, in
 * reading order. A current page whose number is unknown leads the list rather
 * than sinking to the end of its edition.
 */
export function editionPages(others: KeepReadingPage[], current: KeepReadingPage): KeepReadingPage[] {
  const rest = inReadingOrder(others.filter(page => page.id !== current.id));
  return Number(current.pageNumber) ? inReadingOrder([...rest, current]) : [current, ...rest];
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
