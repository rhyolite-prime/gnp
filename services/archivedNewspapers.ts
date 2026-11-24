import {
  listArchiveDecades,
  listArchivedEditions,
  listArchivesByDate,
  getArchiveCoverageSummary,
  getDecadeCoverEditions,
  formatArchiveDateLabel,
  MOCK_ARCHIVE_PUBLICATIONS,
  MOCK_ARCHIVE_OCR_OPTIONS,
} from '~/mocks/archivedNewspapers/index.js';

/**
 * Archived Newspapers & Pages browser — backed by plain JavaScript mock objects & arrays
 * (`~/mocks/archivedNewspapers`). Shapes follow `gnp-api` archive tables (`newspapers`,
 * `newspaper_details`, pre-aggregated decade coverage) and the existing
 * `news-papers/search-archives` contract (`ArchiveSearchItem` in ~/models), so wiring the real API
 * later is a straight swap to `gnpAdminUserHttpClient` against:
 *
 *   GET /api/v1/admin/archives/decades
 *       -> { status, success, message, result: { decades: ArchiveDecadeCollection[], summary } }
 *   GET /api/v1/admin/archives/editions?query=&publicationId=&decade=&year=&dateFrom=&dateTo=
 *            &ocrStatus=&sort=asc|desc&pageNo=&pageSize=&view=dates
 *       -> { status, success, message, result: { dateGroups, data, pageNo, pageSize,
 *            totalCount, totalPages, lowerBound, upperBound } }
 */

export interface ArchiveBrowseQueryDto {
  query?: string;
  publicationId?: string;
  decade?: string;
  year?: number | string;
  dateFrom?: string;
  dateTo?: string;
  ocrStatus?: string;
  /** 'desc' = newest first (default) | 'asc' = oldest first */
  sort?: 'asc' | 'desc';
  pageNo?: number;
  pageSize?: number;
}

export {
  MOCK_ARCHIVE_PUBLICATIONS,
  MOCK_ARCHIVE_OCR_OPTIONS,
  formatArchiveDateLabel,
};

/** Archive-wide coverage chips (decades, editions, pages, OCR). */
export const fetchArchiveCoverageSummary = () => getArchiveCoverageSummary();

/** "Collections by Years" mode data — decade cards with per-year stats. */
export const fetchArchiveDecades = () => listArchiveDecades();

/** Flat, filtered, paginated archived editions. */
export const fetchArchivedEditions = (dto: ArchiveBrowseQueryDto = {}) => listArchivedEditions(dto);

/** "By Dates" mode data — date groups with edition thumbnails, paginated by date. */
export const fetchArchivesByDate = (dto: ArchiveBrowseQueryDto = {}) => listArchivesByDate(dto);

/** Small sample of editions per decade for the stacked card thumbnails. */
export const fetchDecadeCoverEditions = (decadeId: string, limit?: number) =>
  getDecadeCoverEditions(decadeId, limit);
