import {
  searchAccessSubscribers,
  getSubscriberAccessProfile,
  getSubscriberNewspaperAccess,
  MOCK_ACCESS_PUBLICATIONS,
  MOCK_ACCESS_TYPE_OPTIONS,
  MOCK_ACCESS_STATUS_OPTIONS,
  MOCK_EDITION_STATUS_OPTIONS,
} from '~/mocks/subscriberNewspapers/index.js';

/**
 * Subscriber Newspaper Access service — backed by plain JavaScript mock objects & arrays
 * (`~/mocks/subscriberNewspapers`). Shapes mirror the `gnp-api` tables (`users`,
 * `user_subscriptions.newspaper_entitlements`, `newspapers`, `purchase_attempts`,
 * `GrantNewsPaperAccessDto`), so wiring the real API later is a straight swap:
 *
 *   GET /api/v1/admin/subscribers/{subscriberId}/newspaper-access
 *       ?query=&publicationId=&accessType=&accessStatus=&editionStatus=&startDate=&endDate=&pageNo=&pageSize=
 *   -> { status: 200, success: true, message: 'OK', result: { subscriber, summary, data,
 *        pageNo, pageSize, totalCount, totalPages, lowerBound, upperBound } }
 *
 * and each handler below becomes `const res = await gnpAdminUserHttpClient(...); return res.result;`.
 */

export interface SubscriberAccessQueryDto {
  subscriberId: string;
  query?: string;
  publicationId?: string;
  accessType?: string;
  accessStatus?: string;
  editionStatus?: string;
  /** yyyy-MM-dd */
  startDate?: string;
  /** yyyy-MM-dd */
  endDate?: string;
  pageNo?: number;
  pageSize?: number;
}

export {
  MOCK_ACCESS_PUBLICATIONS,
  MOCK_ACCESS_TYPE_OPTIONS,
  MOCK_ACCESS_STATUS_OPTIONS,
  MOCK_EDITION_STATUS_OPTIONS,
};

/** Subscriber directory search used by the page's subscriber picker. */
export const searchSubscriberDirectory = (query: string) => searchAccessSubscribers(query);

/** Unfiltered per-subscriber access profile (account + summary counts). */
export const fetchSubscriberAccessProfile = (subscriberId: string) =>
  getSubscriberAccessProfile(subscriberId);

/** Filtered + paginated list of newspapers the subscriber has access to. */
export const fetchSubscriberNewspaperAccess = (dto: SubscriberAccessQueryDto) =>
  getSubscriberNewspaperAccess(dto);
