import type { ArchiveAccessMetadata, ArchiveSearchItem } from '~/models';

const day = (value: string) => value?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || '';
const normalise = (value: string) => (value || '').trim().toLowerCase().replace(/\s+/g, ' ');

export function sameEditionPages(items: ArchiveSearchItem[], metadata: ArchiveAccessMetadata, currentId: string): ArchiveSearchItem[] {
  const date = day(metadata.publicationDate);
  if (!date) return [];
  const seen = new Set<string>();
  return items.filter(item => {
    if (!item.id || item.id === currentId || seen.has(item.id) || day(item.publicationDate) !== date) return false;
    const samePublication = normalise(item.publicationName) === normalise(metadata.publicationName);
    const sameEdition = item.newspaperId && metadata.newspaperId ? item.newspaperId === metadata.newspaperId : samePublication;
    if (!sameEdition || !samePublication) return false;
    seen.add(item.id);
    return true;
  }).sort((a, b) => (Number(a.pageNumber) || Infinity) - (Number(b.pageNumber) || Infinity) || a.id.localeCompare(b.id));
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
