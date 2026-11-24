// Plain-JavaScript mock datasets & API blueprint for the Admin "Subscriber Newspapers" page
// (all newspapers a subscriber has access to, with filters).
//
// Shapes mirror the `gnp-api` (C++ Drogon + PostgreSQL) tables exactly so this file can be used
// as the contract when wiring the real endpoints:
//   - `users`                     (id, first_name, last_name, email, phone_number, is_active, partner_id, last_active)
//   - `user_subscriptions`        (subscription_identifier, user_id, subscription_plan_id, billing_cycle,
//                                  subscription_plan_description, newspaper_entitlements JSON, is_active,
//                                  start_date, end_date)
//   - `subscription_plans`        (name, plan_type, description, pricing, target_publications)
//   - `publications`              (id, name, type, is_active, price, publishing_days)
//   - `newspapers`                (id, title, slug, price, is_free, publication_id, publication_name,
//                                  edition_number, is_published, published_date, created_at)
//   - `purchase_attempts`         (id, user_id, newspaper_id, attempt_reference, amount, status)
//   - `scheduled_publication_access` (user_subscription_id, user_id, target_publications, start_date, end_date)
//   - `GrantNewsPaperAccessDto`   (uniqueId, userId, email) — direct/promo edition grants
//
// Suggested backend endpoint (returns the standard GNP envelope):
//   GET /api/v1/admin/subscribers/{subscriberId}/newspaper-access
//       ?query=&publicationId=&accessType=&accessStatus=&editionStatus=&startDate=&endDate=&pageNo=&pageSize=
//   -> { status: 200, success: true, message: "OK", result: { subscriber, summary, data,
//        pageNo, pageSize, totalCount, totalPages, lowerBound, upperBound } }

/** "Today" used for access-status derivation across the mock dataset. */
export const MOCK_ACCESS_AS_OF = '2026-10-23';

// ── Publications (table: `publications`) ───────────────────────────────────────────────────────
export const MOCK_ACCESS_PUBLICATIONS = [
  { id: 'pub-daily-graphic', name: 'Daily Graphic', type: 'daily', isActive: true, price: '5.00', publishingDays: 'Mon - Sat', sortOrder: 1 },
  { id: 'pub-graphic-business', name: 'Graphic Business', type: 'weekly', isActive: true, price: '4.00', publishingDays: 'Fri', sortOrder: 2 },
  { id: 'pub-the-mirror', name: 'The Mirror', type: 'weekly', isActive: true, price: '4.50', publishingDays: 'Sat', sortOrder: 3 },
  { id: 'pub-graphic-sports', name: 'Graphic Sports', type: 'weekly', isActive: true, price: '4.00', publishingDays: 'Wed', sortOrder: 4 },
  { id: 'pub-graphic-showbiz', name: 'Graphic Showbiz', type: 'weekly', isActive: true, price: '3.50', publishingDays: 'Fri', sortOrder: 5 },
  { id: 'pub-junior-graphic', name: 'Junior Graphic', type: 'weekly', isActive: true, price: '2.50', publishingDays: 'Fri', sortOrder: 6 },
];

// ── Newspaper editions (table: `newspapers`) ───────────────────────────────────────────────────
export const MOCK_ACCESS_NEWSPAPERS = [
  {
    id: 'np-260923-dg', title: 'Daily Graphic — Wed, 23 Sep 2026', slug: 'daily-graphic-2026-09-23',
    price: '5.00', isFree: false, publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '24521', isPopular: false,
    fullDescription: 'Cabinet approves new infrastructure bond; Ashanti Region road map out; schools reopening brief.',
    thumbnailId: 'th-dg-260923', documentId: 'doc-dg-260923', storageService: 'g3',
    isPublished: true, publishedDate: '2026-09-23', createdAt: '2026-09-23T05:30:00Z', views: 18240, sales: 612,
  },
  {
    id: 'np-261005-dg', title: 'Daily Graphic — Mon, 05 Oct 2026', slug: 'daily-graphic-2026-10-05',
    price: '5.00', isFree: false, publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '24532', isPopular: true,
    fullDescription: 'MPC preview, independence anniversary events, and full sports wrap.',
    thumbnailId: 'th-dg-261005', documentId: 'doc-dg-261005', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-05', createdAt: '2026-10-05T05:30:00Z', views: 22110, sales: 745,
  },
  {
    id: 'np-261012-dg', title: 'Daily Graphic — Mon, 12 Oct 2026', slug: 'daily-graphic-2026-10-12',
    price: '5.00', isFree: false, publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '24538', isPopular: false,
    fullDescription: 'Budget statement highlights, teacher licensing updates, and district assembly news.',
    thumbnailId: 'th-dg-261012', documentId: 'doc-dg-261012', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-12', createdAt: '2026-10-12T05:30:00Z', views: 19870, sales: 690,
  },
  {
    id: 'np-261021-dg', title: 'Daily Graphic — Wed, 21 Oct 2026', slug: 'daily-graphic-2026-10-21',
    price: '5.00', isFree: false, publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '24545', isPopular: true,
    fullDescription: 'Bank of Ghana policy rate watch, port expansion deal, and health service strike brief.',
    thumbnailId: 'th-dg-261021', documentId: 'doc-dg-261021', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-21', createdAt: '2026-10-21T05:30:00Z', views: 25430, sales: 884,
  },
  {
    id: 'np-261022-dg', title: 'Daily Graphic — Thu, 22 Oct 2026', slug: 'daily-graphic-2026-10-22',
    price: '5.00', isFree: false, publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '24546', isPopular: true,
    fullDescription: 'Morning edition: cedi steadies, new education curriculum rollout, and road safety campaign.',
    thumbnailId: 'th-dg-261022', documentId: 'doc-dg-261022', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-22', createdAt: '2026-10-22T05:30:00Z', views: 27650, sales: 932,
  },
  {
    id: 'np-261002-gb', title: 'Graphic Business — Fri, 02 Oct 2026', slug: 'graphic-business-2026-10-02',
    price: '4.00', isFree: false, publicationId: 'pub-graphic-business', publicationName: 'Graphic Business',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '1123', isPopular: false,
    fullDescription: 'Inflation print analysis, T-bill yields, and SME lending clinic.',
    thumbnailId: 'th-gb-261002', documentId: 'doc-gb-261002', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-02', createdAt: '2026-10-02T06:00:00Z', views: 9210, sales: 388,
  },
  {
    id: 'np-261016-gb', title: 'Graphic Business — Fri, 16 Oct 2026', slug: 'graphic-business-2026-10-16',
    price: '4.00', isFree: false, publicationId: 'pub-graphic-business', publicationName: 'Graphic Business',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '1129', isPopular: true,
    fullDescription: 'Energy sector debt plan, mobile money interoperability gains, and market outlook.',
    thumbnailId: 'th-gb-261016', documentId: 'doc-gb-261016', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-16', createdAt: '2026-10-16T06:00:00Z', views: 11450, sales: 447,
  },
  {
    id: 'np-261022-gb', title: 'Graphic Business — Wed, 21 Oct 2026 (Midweek)', slug: 'graphic-business-2026-10-21',
    price: '4.00', isFree: false, publicationId: 'pub-graphic-business', publicationName: 'Graphic Business',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '1131', isPopular: false,
    fullDescription: 'Midweek markets: cedi dashboard, treasury auction results, and commodity prices.',
    thumbnailId: 'th-gb-261022', documentId: 'doc-gb-261022', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-22', createdAt: '2026-10-22T06:00:00Z', views: 8730, sales: 356,
  },
  {
    id: 'np-260926-tm', title: 'The Mirror — Sat, 26 Sep 2026', slug: 'the-mirror-2026-09-26',
    price: '4.50', isFree: false, publicationId: 'pub-the-mirror', publicationName: 'The Mirror',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '3487', isPopular: false,
    fullDescription: 'Weekend magazine: women in agribusiness feature, health column, and family recipes.',
    thumbnailId: 'th-tm-260926', documentId: 'doc-tm-260926', storageService: 'g3',
    isPublished: true, publishedDate: '2026-09-26', createdAt: '2026-09-26T06:00:00Z', views: 7120, sales: 298,
  },
  {
    id: 'np-261010-tm', title: 'The Mirror — Sat, 10 Oct 2026', slug: 'the-mirror-2026-10-10',
    price: '4.50', isFree: false, publicationId: 'pub-the-mirror', publicationName: 'The Mirror',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '3490', isPopular: true,
    fullDescription: 'Weekend magazine: education special, parenting column, and Saturday kitchen.',
    thumbnailId: 'th-tm-261010', documentId: 'doc-tm-261010', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-10', createdAt: '2026-10-10T06:00:00Z', views: 8340, sales: 341,
  },
  {
    id: 'np-261017-tm', title: 'The Mirror — Sat, 17 Oct 2026', slug: 'the-mirror-2026-10-17',
    price: '4.50', isFree: false, publicationId: 'pub-the-mirror', publicationName: 'The Mirror',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '3491', isPopular: false,
    fullDescription: 'Weekend magazine: breast cancer awareness feature and community heroes.',
    thumbnailId: 'th-tm-261017', documentId: 'doc-tm-261017', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-17', createdAt: '2026-10-17T06:00:00Z', views: 7680, sales: 312,
  },
  {
    id: 'np-261003-gs', title: 'Graphic Sports — Wed, 07 Oct 2026', slug: 'graphic-sports-2026-10-07',
    price: '4.00', isFree: false, publicationId: 'pub-graphic-sports', publicationName: 'Graphic Sports',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '982', isPopular: true,
    fullDescription: 'Black Stars qualifiers preview, Premier League round-up, and boxing results.',
    thumbnailId: 'th-gs-261003', documentId: 'doc-gs-261003', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-03', createdAt: '2026-10-03T06:00:00Z', views: 12980, sales: 523,
  },
  {
    id: 'np-261017-gs', title: 'Graphic Sports — Wed, 21 Oct 2026', slug: 'graphic-sports-2026-10-21',
    price: '4.00', isFree: false, publicationId: 'pub-graphic-sports', publicationName: 'Graphic Sports',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '985', isPopular: true,
    fullDescription: 'Champions League night, Ghana Premier League table, and athletics trials report.',
    thumbnailId: 'th-gs-261017', documentId: 'doc-gs-261017', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-17', createdAt: '2026-10-17T06:00:00Z', views: 11240, sales: 471,
  },
  {
    id: 'np-260925-gsb', title: 'Graphic Showbiz — Fri, 25 Sep 2026', slug: 'graphic-showbiz-2026-09-25',
    price: '3.50', isFree: false, publicationId: 'pub-graphic-showbiz', publicationName: 'Graphic Showbiz',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '446', isPopular: false,
    fullDescription: 'Red carpet gallery, interview with Ghanaian film-makers, and chart countdown.',
    thumbnailId: 'th-gsb-260925', documentId: 'doc-gsb-260925', storageService: 'g3',
    isPublished: true, publishedDate: '2026-09-25', createdAt: '2026-09-25T06:00:00Z', views: 6210, sales: 242,
  },
  {
    id: 'np-261016-gsb', title: 'Graphic Showbiz — Fri, 16 Oct 2026', slug: 'graphic-showbiz-2026-10-16',
    price: '3.50', isFree: false, publicationId: 'pub-graphic-showbiz', publicationName: 'Graphic Showbiz',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '449', isPopular: true,
    fullDescription: 'Awards season preview, music festival line-up, and style watch.',
    thumbnailId: 'th-gsb-261016', documentId: 'doc-gsb-261016', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-16', createdAt: '2026-10-16T06:00:00Z', views: 7430, sales: 301,
  },
  {
    id: 'np-261009-jg', title: 'Junior Graphic — Fri, 09 Oct 2026', slug: 'junior-graphic-2026-10-09',
    price: '0.00', isFree: true, publicationId: 'pub-junior-graphic', publicationName: 'Junior Graphic',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '762', isPopular: true,
    fullDescription: 'Free youth edition: science fair winners, cartoon strip, and spelling bee prep.',
    thumbnailId: 'th-jg-261009', documentId: 'doc-jg-261009', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-09', createdAt: '2026-10-09T06:00:00Z', views: 15220, sales: 0,
  },
  {
    id: 'np-261016-jg', title: 'Junior Graphic — Fri, 16 Oct 2026', slug: 'junior-graphic-2026-10-16',
    price: '0.00', isFree: true, publicationId: 'pub-junior-graphic', publicationName: 'Junior Graphic',
    copyrightOwner: 'Graphic Communications Group Ltd', editionNumber: '763', isPopular: true,
    fullDescription: 'Free youth edition: read-along story, quiz corner, and young reporters page.',
    thumbnailId: 'th-jg-261016', documentId: 'doc-jg-261016', storageService: 'g3',
    isPublished: true, publishedDate: '2026-10-16', createdAt: '2026-10-16T06:00:00Z', views: 14870, sales: 0,
  },
];

// ── Subscribers (join of `users` + `user_subscriptions` + `subscription_plans`) ────────────────
export const MOCK_ACCESS_SUBSCRIBERS = [
  {
    id: 'usr-1001',
    firstName: 'Ama Serwaa', lastName: 'Mensah',
    email: 'ama.mensah@example.com.gh', phoneNumber: '+233 24 555 0101', country: 'Ghana',
    isActive: true, accountType: 'regular', partnerId: null, partnerName: null,
    lastActive: '2026-10-23T08:12:00Z', createdAt: '2025-11-04T10:22:00Z',
    subscription: {
      subscriptionIdentifier: 'SUB-2026-1001',
      subscriptionPlanId: 'plan-premium',
      planName: 'Digital Premium', planType: 'premium', billingCycle: 'monthly',
      subscriptionPlanDescription: 'All 6 publications + 1950–2026 Digital Archives',
      pricing: 'GHS 89.00 / month',
      targetPublications: ['pub-daily-graphic', 'pub-graphic-business', 'pub-the-mirror', 'pub-graphic-sports', 'pub-graphic-showbiz', 'pub-junior-graphic'],
      // user_subscriptions.newspaper_entitlements (JSON array of newspaper ids)
      newspaperEntitlements: [
        'np-260923-dg', 'np-261005-dg', 'np-261012-dg', 'np-261021-dg', 'np-261022-dg',
        'np-261002-gb', 'np-261016-gb', 'np-261022-gb',
        'np-260926-tm', 'np-261010-tm', 'np-261017-tm',
        'np-261003-gs', 'np-261017-gs',
        'np-260925-gsb', 'np-261016-gsb',
        'np-261009-jg', 'np-261016-jg',
      ],
      isActive: true, startDate: '2026-09-28', endDate: '2026-10-28', nextRenewalDate: '2026-10-28',
    },
  },
  {
    id: 'usr-1002',
    firstName: 'Kwame', lastName: 'Boateng',
    email: 'kwame.boateng@example.com.gh', phoneNumber: '+233 20 555 0102', country: 'Ghana',
    isActive: true, accountType: 'regular', partnerId: null, partnerName: null,
    lastActive: '2026-10-22T19:41:00Z', createdAt: '2026-03-18T14:05:00Z',
    subscription: {
      subscriptionIdentifier: 'SUB-2026-1002',
      subscriptionPlanId: 'plan-daily-standard',
      planName: 'Daily Graphic Standard', planType: 'standard', billingCycle: 'monthly',
      subscriptionPlanDescription: 'Daily Graphic digital edition only',
      pricing: 'GHS 35.00 / month',
      targetPublications: ['pub-daily-graphic'],
      newspaperEntitlements: ['np-261005-dg', 'np-261012-dg', 'np-261021-dg', 'np-261022-dg'],
      isActive: true, startDate: '2026-10-01', endDate: '2026-10-31', nextRenewalDate: '2026-11-01',
    },
  },
  {
    id: 'usr-1003',
    firstName: 'Efua', lastName: 'Nyarko',
    email: 'e.nyarko@glaghana.org', phoneNumber: '+233 27 555 0103', country: 'Ghana',
    isActive: true, accountType: 'partner', partnerId: 'prt-77', partnerName: 'Ghana Library Authority',
    lastActive: '2026-10-23T07:02:00Z', createdAt: '2026-08-15T09:30:00Z',
    subscription: {
      subscriptionIdentifier: 'SUB-2026-1003',
      subscriptionPlanId: 'plan-corporate-campus',
      planName: 'Corporate Campus Bundle', planType: 'corporate', billingCycle: 'annual',
      subscriptionPlanDescription: 'Partner seat — Daily Graphic, The Mirror & Junior Graphic',
      pricing: 'GHS 1,200.00 / year',
      targetPublications: ['pub-daily-graphic', 'pub-the-mirror', 'pub-junior-graphic'],
      newspaperEntitlements: [
        'np-260923-dg', 'np-261005-dg', 'np-261012-dg', 'np-261021-dg', 'np-261022-dg',
        'np-260926-tm', 'np-261010-tm', 'np-261017-tm',
        'np-261009-jg', 'np-261016-jg',
      ],
      isActive: true, startDate: '2026-08-15', endDate: '2026-11-15', nextRenewalDate: '2026-11-15',
    },
  },
  {
    id: 'usr-1004',
    firstName: 'Kofi', lastName: 'Asante',
    email: 'kofi.asante@example.com.gh', phoneNumber: '+233 26 555 0104', country: 'Ghana',
    isActive: true, accountType: 'regular', partnerId: null, partnerName: null,
    lastActive: '2026-10-22T21:15:00Z', createdAt: '2026-06-30T11:45:00Z',
    subscription: {
      subscriptionIdentifier: 'SUB-2026-1004',
      subscriptionPlanId: 'plan-premium',
      planName: 'Digital Premium', planType: 'premium', billingCycle: 'quarterly',
      subscriptionPlanDescription: 'All 6 publications + 1950–2026 Digital Archives',
      pricing: 'GHS 240.00 / quarter',
      targetPublications: ['pub-daily-graphic', 'pub-graphic-business', 'pub-the-mirror', 'pub-graphic-sports', 'pub-graphic-showbiz', 'pub-junior-graphic'],
      newspaperEntitlements: ['np-260923-dg', 'np-260926-tm', 'np-260925-gsb'],
      isActive: false, startDate: '2026-07-01', endDate: '2026-08-31', nextRenewalDate: null,
    },
  },
  {
    id: 'usr-1005',
    firstName: 'Akosua', lastName: 'Adjei',
    email: 'akosua.adjei@example.com.gh', phoneNumber: '+233 55 555 0105', country: 'Ghana',
    isActive: true, accountType: 'regular', partnerId: null, partnerName: null,
    lastActive: '2026-10-21T16:20:00Z', createdAt: '2026-09-12T08:00:00Z',
    subscription: null, // Pay-as-you-go reader — no active user_subscriptions row
  },
];

// ── Single-copy purchases (table: `purchase_attempts`) ─────────────────────────────────────────
export const MOCK_ACCESS_PURCHASE_ATTEMPTS = [
  { id: 'pay-9001', userId: 'usr-1005', newspaperId: 'np-261021-dg', attemptReference: 'PAY-2026-9001', amount: '5.00', status: 'success', failureReason: null, createdAt: '2026-10-21T07:44:00Z' },
  { id: 'pay-9002', userId: 'usr-1005', newspaperId: 'np-261017-gs', attemptReference: 'PAY-2026-9002', amount: '4.00', status: 'success', failureReason: null, createdAt: '2026-10-18T10:12:00Z' },
  { id: 'pay-9003', userId: 'usr-1005', newspaperId: 'np-261003-gs', attemptReference: 'PAY-2026-9003', amount: '4.00', status: 'success', failureReason: null, createdAt: '2026-10-04T09:30:00Z' },
  { id: 'pay-9004', userId: 'usr-1005', newspaperId: 'np-261002-gb', attemptReference: 'PAY-2026-9004', amount: '4.00', status: 'failed', failureReason: 'Insufficient wallet balance', createdAt: '2026-10-02T12:05:00Z' },
  { id: 'pay-9005', userId: 'usr-1002', newspaperId: 'np-261017-tm', attemptReference: 'PAY-2026-9005', amount: '4.50', status: 'success', failureReason: null, createdAt: '2026-10-18T08:20:00Z' },
  { id: 'pay-9006', userId: 'usr-1004', newspaperId: 'np-261022-dg', attemptReference: 'PAY-2026-9006', amount: '5.00', status: 'success', failureReason: null, createdAt: '2026-10-22T06:40:00Z' },
  { id: 'pay-9007', userId: 'usr-1004', newspaperId: 'np-261022-gb', attemptReference: 'PAY-2026-9007', amount: '4.00', status: 'success', failureReason: null, createdAt: '2026-10-22T06:42:00Z' },
];

// ── Direct / promo edition grants (GrantNewsPaperAccessDto flows) ──────────────────────────────
export const MOCK_ACCESS_GRANTS = [
  { id: 'grt-8001', userId: 'usr-1002', newspaperId: 'np-261016-gb', grantReference: 'BIZWEEK2026', grantedAt: '2026-10-16T09:00:00Z', expiresAt: '2026-10-30', revoked: false },
  { id: 'grt-8002', userId: 'usr-1005', newspaperId: 'np-261016-gsb', grantReference: 'SHOWBIZ-SPOTLIGHT', grantedAt: '2026-10-16T11:30:00Z', expiresAt: '2026-10-26', revoked: false },
  { id: 'grt-8003', userId: 'usr-1005', newspaperId: 'np-261010-tm', grantReference: 'MIRROR-WEEKEND', grantedAt: '2026-10-08T10:00:00Z', expiresAt: '2026-10-22', revoked: true },
];

// ── Filter option catalogs (for the page's dropdowns) ──────────────────────────────────────────
export const MOCK_ACCESS_TYPE_OPTIONS = [
  { value: 'plan_entitlement', label: 'Plan Entitlement' },
  { value: 'single_copy_purchase', label: 'Single-Copy Purchase' },
  { value: 'promo_grant', label: 'Promo / Direct Grant' },
  { value: 'free_access', label: 'Free Access' },
];

export const MOCK_ACCESS_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expiring_soon', label: 'Expiring Soon' },
  { value: 'expired', label: 'Expired' },
  { value: 'revoked', label: 'Revoked' },
];

export const MOCK_EDITION_STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
];

// ── Derivation helpers ─────────────────────────────────────────────────────────────────────────
const ACCESS_TYPE_LABELS = {
  plan_entitlement: 'Plan Entitlement',
  single_copy_purchase: 'Single-Copy Purchase',
  promo_grant: 'Promo / Direct Grant',
  free_access: 'Free Access',
};

const dayDiff = (fromDate, toDate) =>
  Math.round((new Date(toDate) - new Date(fromDate)) / 86400000);

/** Derive access status as of `asOf` (YYYY-MM-DD): revoked | expired | expiring_soon | active */
const deriveAccessStatus = (expiresAt, revoked, asOf = MOCK_ACCESS_AS_OF) => {
  if (revoked) return 'revoked';
  if (!expiresAt) return 'active'; // permanent copy
  if (expiresAt < asOf) return 'expired';
  if (dayDiff(asOf, expiresAt) <= 7) return 'expiring_soon';
  return 'active';
};

/**
 * Builds the flat "newspaper access" rows for one subscriber by merging:
 *   1. plan entitlements  (user_subscriptions.newspaper_entitlements)
 *   2. single-copy buys   (purchase_attempts with status 'success')
 *   3. promo/direct grants(GrantNewsPaperAccess flows)
 *   4. free editions      (newspapers.is_free)
 * Duplicate newspapers keep the highest-priority source (1 > 2 > 3 > 4).
 */
const buildAccessRowsForSubscriber = (subscriber) => {
  const paperById = Object.fromEntries(MOCK_ACCESS_NEWSPAPERS.map((p) => [p.id, p]));
  const rows = [];
  const seen = new Set();

  const pushRow = (row) => {
    if (seen.has(row.newspaperId)) return;
    seen.add(row.newspaperId);
    const paper = paperById[row.newspaperId];
    if (!paper) return;
    rows.push({
      ...row,
      accessTypeLabel: ACCESS_TYPE_LABELS[row.accessType],
      accessStatus: deriveAccessStatus(row.expiresAt, Boolean(row.revoked)),
      newspaper: { ...paper },
    });
  };

  // 1. Plan entitlements (highest priority)
  const sub = subscriber.subscription;
  if (sub) {
    for (const newspaperId of sub.newspaperEntitlements) {
      pushRow({
        id: `acc-${subscriber.id}-${newspaperId}`,
        subscriberId: subscriber.id,
        newspaperId,
        accessType: 'plan_entitlement',
        grantedVia: sub.planName,
        sourceReference: sub.subscriptionIdentifier,
        grantedAt: sub.startDate,
        expiresAt: sub.endDate,
        revoked: false,
      });
    }
  }

  // 2. Successful single-copy purchases (permanent copies)
  for (const attempt of MOCK_ACCESS_PURCHASE_ATTEMPTS) {
    if (attempt.userId !== subscriber.id || attempt.status !== 'success') continue;
    pushRow({
      id: `acc-${subscriber.id}-${attempt.id}`,
      subscriberId: subscriber.id,
      newspaperId: attempt.newspaperId,
      accessType: 'single_copy_purchase',
      grantedVia: `Order ${attempt.attemptReference}`,
      sourceReference: attempt.attemptReference,
      grantedAt: attempt.createdAt,
      expiresAt: null,
      revoked: false,
    });
  }

  // 3. Promo / direct grants
  for (const grant of MOCK_ACCESS_GRANTS) {
    if (grant.userId !== subscriber.id) continue;
    pushRow({
      id: `acc-${subscriber.id}-${grant.id}`,
      subscriberId: subscriber.id,
      newspaperId: grant.newspaperId,
      accessType: 'promo_grant',
      grantedVia: `Promo ${grant.grantReference}`,
      sourceReference: grant.grantReference,
      grantedAt: grant.grantedAt,
      expiresAt: grant.expiresAt,
      revoked: grant.revoked,
    });
  }

  // 4. Free editions (lowest priority — only when no paid/granted source exists)
  for (const paper of MOCK_ACCESS_NEWSPAPERS) {
    if (!paper.isFree) continue;
    pushRow({
      id: `acc-${subscriber.id}-free-${paper.id}`,
      subscriberId: subscriber.id,
      newspaperId: paper.id,
      accessType: 'free_access',
      grantedVia: 'Free edition',
      sourceReference: 'free-tier',
      grantedAt: paper.publishedDate,
      expiresAt: null,
      revoked: false,
    });
  }

  return rows;
};

// ── Mock service functions (backend API blueprint) ─────────────────────────────────────────────

/** Subscriber directory search for the page's subscriber picker. */
export function searchAccessSubscribers(query = '') {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return MOCK_ACCESS_SUBSCRIBERS.map((s) => ({ ...s }));
  return MOCK_ACCESS_SUBSCRIBERS.filter((s) =>
    [s.firstName, s.lastName, s.email, s.phoneNumber, s.partnerName, s.subscription?.planName]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q))
  ).map((s) => ({ ...s }));
}

/** Unfiltered access-row count + per-source counts for one subscriber (summary card). */
export function getSubscriberAccessProfile(subscriberId) {
  const subscriber = MOCK_ACCESS_SUBSCRIBERS.find((s) => s.id === subscriberId) || null;
  if (!subscriber) return null;
  const rows = buildAccessRowsForSubscriber(subscriber);
  const counts = { total: rows.length, plan_entitlement: 0, single_copy_purchase: 0, promo_grant: 0, free_access: 0, active: 0, expiring_soon: 0, expired: 0, revoked: 0 };
  for (const r of rows) {
    counts[r.accessType] += 1;
    counts[r.accessStatus] += 1;
  }
  return { subscriber, counts };
}

/**
 * Filtered + paginated list of every newspaper the subscriber can access.
 * `dto` fields: subscriberId (required), query, publicationId, accessType, accessStatus,
 * editionStatus, startDate, endDate (publicationDate range), pageNo, pageSize.
 */
export function getSubscriberNewspaperAccess(dto = {}) {
  const {
    subscriberId, query = '', publicationId = '', accessType = '', accessStatus = '',
    editionStatus = '', startDate = '', endDate = '', pageNo = 1, pageSize = 30,
  } = dto;

  const subscriber = MOCK_ACCESS_SUBSCRIBERS.find((s) => s.id === subscriberId);
  if (!subscriber) {
    return { subscriber: null, summary: null, data: [], pageNo: 1, pageSize, totalCount: 0, totalPages: 0, lowerBound: 0, upperBound: 0 };
  }

  const q = String(query).trim().toLowerCase();

  let rows = buildAccessRowsForSubscriber(subscriber).filter((row) => {
    const paper = row.newspaper;

    if (q) {
      const haystack = `${paper.title} ${paper.editionNumber} ${paper.publicationName} ${row.grantedVia}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (publicationId && paper.publicationId !== publicationId) return false;
    if (accessType && row.accessType !== accessType) return false;
    if (accessStatus && row.accessStatus !== accessStatus) return false;
    if (editionStatus === 'published' && !paper.isPublished) return false;
    if (editionStatus === 'unpublished' && paper.isPublished) return false;
    if (startDate && paper.publishedDate < startDate) return false;
    if (endDate && paper.publishedDate > endDate) return false;
    return true;
  });

  // Newest editions first
  rows = rows.slice().sort((a, b) => (a.newspaper.publishedDate < b.newspaper.publishedDate ? 1 : -1));

  // Filter-aware summary chips
  const summary = {
    total: rows.length,
    planEntitlement: rows.filter((r) => r.accessType === 'plan_entitlement').length,
    singleCopy: rows.filter((r) => r.accessType === 'single_copy_purchase').length,
    promoGrant: rows.filter((r) => r.accessType === 'promo_grant').length,
    freeAccess: rows.filter((r) => r.accessType === 'free_access').length,
    active: rows.filter((r) => r.accessStatus === 'active').length,
    expiringSoon: rows.filter((r) => r.accessStatus === 'expiring_soon').length,
    expired: rows.filter((r) => r.accessStatus === 'expired').length,
    revoked: rows.filter((r) => r.accessStatus === 'revoked').length,
  };

  const totalCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePageNo = Math.min(Math.max(1, pageNo), totalPages);
  const lowerBound = totalCount === 0 ? 0 : (safePageNo - 1) * pageSize + 1;
  const upperBound = Math.min(safePageNo * pageSize, totalCount);
  const data = rows.slice((safePageNo - 1) * pageSize, safePageNo * pageSize);

  return {
    subscriber: { ...subscriber },
    summary,
    data,
    pageNo: safePageNo,
    pageSize,
    totalCount,
    totalPages,
    lowerBound,
    upperBound,
  };
}
