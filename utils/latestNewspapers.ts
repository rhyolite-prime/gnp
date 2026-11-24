import type { NewsPaper } from '~/models';

/** The latest feed is a projection: publicationName/isPublished may be absent. */
export type LatestNewsPaper = Pick<NewsPaper, 'id' | 'title'> &
  Partial<Pick<NewsPaper, 'publicationName' | 'publicationDate' | 'publishedDate' | 'isPublished'>>;

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
  if (typeof value !== 'string') return '';
  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})(?:$|[T\s])/);
  return match?.[1] ?? '';
}

/** Find today’s Daily Graphic in the same latest-editions feed as the homepage. */
export function findDailyGraphicEdition(
  newspapers: readonly LatestNewsPaper[] | null | undefined,
  dateKey: string,
): LatestNewsPaper | null {
  if (!dateKey || !newspapers?.length) return null;

  return newspapers.find((paper) => {
    if (!paper || typeof paper.id !== 'string' || !paper.id.trim()) return false;
    // get-latest omits isPublished; only an explicit false excludes an edition.
    if (paper.isPublished === false) return false;

    const publication = typeof paper.publicationName === 'string'
      ? paper.publicationName.trim().toLowerCase()
      : '';
    const title = typeof paper.title === 'string' ? paper.title.trim() : '';
    // Latest-feed titles use the DG prefix, e.g. "DG Friday, November 6, 2026".
    // Require a word boundary so unrelated prefixes such as DGB do not match.
    const isDailyGraphic = publication
      ? publication === 'daily graphic'
      : /^(?:dg|daily graphic)\b/i.test(title);
    if (!isDailyGraphic) return false;

    const editionDate = getNewspaperDateKey(paper.publicationDate || paper.publishedDate);
    return editionDate === dateKey;
  }) ?? null;
}

export function getNewspaperDetailPath(id: string): string {
  return `/newspapers/${encodeURIComponent(id.trim())}`;
}
