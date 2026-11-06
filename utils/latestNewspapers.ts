import type { NewsPaper } from '~/models';

/** Local calendar date (yyyy-MM-dd) used to match “today’s” edition. */
export function getLocalDateKey(date: Date = new Date()): string {
  if (Number.isNaN(date.getTime())) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * API publication dates are calendar dates or timestamps without a reliable
 * timezone. Keep the leading yyyy-MM-dd instead of shifting it via Date parsing.
 */
export function getNewspaperDateKey(value: string | null | undefined): string {
  const match = value?.trim().match(/^(\d{4}-\d{2}-\d{2})(?:$|[T\s])/);
  return match?.[1] ?? '';
}

/** Find today’s Daily Graphic in the same latest-editions feed as the homepage. */
export function findDailyGraphicEdition(
  newspapers: readonly NewsPaper[] | null | undefined,
  dateKey: string,
): NewsPaper | null {
  if (!dateKey || !newspapers?.length) return null;

  return newspapers.find((paper) => {
    if (!paper || typeof paper.id !== 'string' || !paper.id.trim()) return false;
    if (paper.isPublished === false) return false;

    const publication = paper.publicationName?.trim().toLowerCase();
    const isDailyGraphic = publication === 'daily graphic'
      || (!publication && /^daily graphic\b/i.test(paper.title?.trim() ?? ''));
    if (!isDailyGraphic) return false;

    const editionDate = getNewspaperDateKey(paper.publicationDate || paper.publishedDate);
    return editionDate === dateKey;
  }) ?? null;
}

export function getNewspaperDetailPath(id: string): string {
  return `/newspapers/${encodeURIComponent(id.trim())}`;
}
