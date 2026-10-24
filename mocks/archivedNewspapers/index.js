// Plain-JavaScript mock datasets & API blueprint for the Admin "Archived Newspapers & Pages" browser
// (two display modes: Collections by Years/decades, and By Dates with thumbnails).
//
// Shapes follow `gnp-api` (C++ Drogon + PostgreSQL) archive tables & the existing
// `news-papers/search-archives` contract (`ArchiveSearchItem` in ~/models):
//   - `newspapers`            (id, title, slug, price, is_free, publication_id, publication_name,
//                              edition_number, is_published, published_date, thumbnail_id, document_id)
//   - `newspaper_details`     (page_count, digitized_pages, ocr_status per edition)
//   - decade collections      (pre-aggregated coverage stats used by the "Collections by Years" mode)
//
// Suggested admin endpoints (standard GNP envelope `{ status, success, message, result }`):
//   GET /api/v1/admin/archives/decades
//       -> result: { decades: ArchiveDecadeCollection[], summary: ArchiveCoverageSummary }
//   GET /api/v1/admin/archives/editions?view=dates|list&query=&publicationId=&decade=&year=
//            &dateFrom=&dateTo=&sort=asc|desc&pageNo=&pageSize=
//       -> result: { dateGroups: [...], data: [...], pageNo, pageSize, totalCount, totalPages,
//                    lowerBound, upperBound }

/** Publications covered by the 1953–2023 digital archive. */
export const MOCK_ARCHIVE_PUBLICATIONS = [
  { id: 'pub-daily-graphic', name: 'Daily Graphic', accent: '#b91c1c' },
  { id: 'pub-graphic-business', name: 'Graphic Business', accent: '#b45309' },
  { id: 'pub-the-mirror', name: 'The Mirror', accent: '#7c3aed' },
  { id: 'pub-graphic-sports', name: 'Graphic Sports', accent: '#047857' },
  { id: 'pub-graphic-showbiz', name: 'Graphic Showbiz', accent: '#be185d' },
  { id: 'pub-junior-graphic', name: 'Junior Graphic', accent: '#0369a1' },
];

export const MOCK_ARCHIVE_OCR_OPTIONS = [
  { value: 'complete', label: 'OCR Complete' },
  { value: 'partial', label: 'OCR Partial' },
  { value: 'pending', label: 'OCR Pending' },
];

// ── Decade collections (pre-aggregated coverage stats) ─────────────────────────────────────────
export const MOCK_ARCHIVE_DECADES = [
  {
    id: '1950s',
    label: "1950's",
    startYear: 1953,
    endYear: 1959,
    editionCount: 1240,
    pageCount: 37200,
    publicationsCovered: 2,
    description: 'The founding years — early Daily Graphic & Mirror runs, including the Independence-era editions.',
    yearStats: [
      { year: 1953, editionCount: 120 }, { year: 1954, editionCount: 180 }, { year: 1955, editionCount: 190 },
      { year: 1956, editionCount: 185 }, { year: 1957, editionCount: 210 }, { year: 1958, editionCount: 180 },
      { year: 1959, editionCount: 175 },
    ],
  },
  {
    id: '1960s',
    label: "1960's",
    startYear: 1960,
    endYear: 1969,
    editionCount: 2480,
    pageCount: 86800,
    publicationsCovered: 3,
    description: 'The republic years — expanding national coverage and the first sports pages.',
    yearStats: [
      { year: 1960, editionCount: 240 }, { year: 1961, editionCount: 245 }, { year: 1962, editionCount: 250 },
      { year: 1963, editionCount: 252 }, { year: 1964, editionCount: 248 }, { year: 1965, editionCount: 250 },
      { year: 1966, editionCount: 246 }, { year: 1967, editionCount: 248 }, { year: 1968, editionCount: 250 },
      { year: 1969, editionCount: 251 },
    ],
  },
  {
    id: '1970s',
    label: "1970's",
    startYear: 1970,
    endYear: 1979,
    editionCount: 3120,
    pageCount: 124800,
    publicationsCovered: 3,
    description: 'A transformative decade of national events, business pages, and photography.',
    yearStats: [
      { year: 1970, editionCount: 300 }, { year: 1971, editionCount: 305 }, { year: 1972, editionCount: 308 },
      { year: 1973, editionCount: 310 }, { year: 1974, editionCount: 315 }, { year: 1975, editionCount: 312 },
      { year: 1976, editionCount: 314 }, { year: 1977, editionCount: 316 }, { year: 1978, editionCount: 318 },
      { year: 1979, editionCount: 322 },
    ],
  },
  {
    id: '1980s',
    label: "1980's",
    startYear: 1980,
    endYear: 1989,
    editionCount: 3640,
    pageCount: 160160,
    publicationsCovered: 4,
    description: 'Graphic Business launches; Junior Graphic opens the archive to young readers.',
    yearStats: [
      { year: 1980, editionCount: 350 }, { year: 1981, editionCount: 352 }, { year: 1982, editionCount: 355 },
      { year: 1983, editionCount: 360 }, { year: 1984, editionCount: 362 }, { year: 1985, editionCount: 365 },
      { year: 1986, editionCount: 368 }, { year: 1987, editionCount: 370 }, { year: 1988, editionCount: 375 },
      { year: 1989, editionCount: 383 },
    ],
  },
  {
    id: '1990s',
    label: "1990's",
    startYear: 1990,
    endYear: 1999,
    editionCount: 4120,
    pageCount: 197760,
    publicationsCovered: 5,
    description: 'The nineties — full colour presses, sports coverage growth, and the Fourth Republic.',
    yearStats: [
      { year: 1990, editionCount: 390 }, { year: 1991, editionCount: 395 }, { year: 1992, editionCount: 400 },
      { year: 1993, editionCount: 405 }, { year: 1994, editionCount: 408 }, { year: 1995, editionCount: 410 },
      { year: 1996, editionCount: 412 }, { year: 1997, editionCount: 415 }, { year: 1998, editionCount: 430 },
      { year: 1999, editionCount: 455 },
    ],
  },
  {
    id: '2000s',
    label: "2000's",
    startYear: 2000,
    endYear: 2009,
    editionCount: 4860,
    pageCount: 257580,
    publicationsCovered: 6,
    description: 'The full family of six publications, with digital-first page production.',
    yearStats: [
      { year: 2000, editionCount: 460 }, { year: 2001, editionCount: 465 }, { year: 2002, editionCount: 470 },
      { year: 2003, editionCount: 475 }, { year: 2004, editionCount: 480 }, { year: 2005, editionCount: 485 },
      { year: 2006, editionCount: 490 }, { year: 2007, editionCount: 500 }, { year: 2008, editionCount: 510 },
      { year: 2009, editionCount: 525 },
    ],
  },
  {
    id: '2010s',
    label: "2010's",
    startYear: 2010,
    endYear: 2019,
    editionCount: 6240,
    pageCount: 349440,
    publicationsCovered: 6,
    description: 'High-resolution rescans, full-text OCR rollout, and the mobile reading era.',
    yearStats: [
      { year: 2010, editionCount: 540 }, { year: 2011, editionCount: 560 }, { year: 2012, editionCount: 580 },
      { year: 2013, editionCount: 600 }, { year: 2014, editionCount: 615 }, { year: 2015, editionCount: 630 },
      { year: 2016, editionCount: 645 }, { year: 2017, editionCount: 660 }, { year: 2018, editionCount: 690 },
      { year: 2019, editionCount: 720 },
    ],
  },
  {
    id: '2020s',
    label: "2020's",
    startYear: 2020,
    endYear: 2023,
    editionCount: 3360,
    pageCount: 208320,
    publicationsCovered: 6,
    description: 'Born-digital editions, instant ingestion, and AI-assisted archive search.',
    yearStats: [
      { year: 2020, editionCount: 780 }, { year: 2021, editionCount: 820 },
      { year: 2022, editionCount: 850 }, { year: 2023, editionCount: 910 },
    ],
  },
];

// ── Sample archived editions (browsable rows — a realistic slice of the 29k+ edition archive) ──
export const MOCK_ARCHIVE_EDITIONS = [
  // 1950's
  { id: 'arc-1954-03-06-dg', title: 'Daily Graphic — 6 March 1954', slug: 'daily-graphic-1954-03-06', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '1482', publicationDate: '1954-03-06', pageCount: 12, digitizedPages: 12, ocrStatus: 'complete', price: '0.05', isFree: false, isPublished: true, thumbnailId: 'th-arc-1954-03-06-dg', documentId: 'doc-arc-1954-03-06-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 2140 },
  { id: 'arc-1954-03-06-tm', title: 'The Mirror — 6 March 1954', slug: 'the-mirror-1954-03-06', publicationId: 'pub-the-mirror', publicationName: 'The Mirror', editionNumber: '312', publicationDate: '1954-03-06', pageCount: 8, digitizedPages: 6, ocrStatus: 'partial', price: '0.05', isFree: false, isPublished: true, thumbnailId: 'th-arc-1954-03-06-tm', documentId: 'doc-arc-1954-03-06-tm', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 980 },
  { id: 'arc-1957-03-06-dg', title: 'Daily Graphic — 6 March 1957 (Independence Day)', slug: 'daily-graphic-1957-03-06', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '2310', publicationDate: '1957-03-06', pageCount: 16, digitizedPages: 16, ocrStatus: 'complete', price: '0.05', isFree: false, isPublished: true, thumbnailId: 'th-arc-1957-03-06-dg', documentId: 'doc-arc-1957-03-06-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 8920 },
  { id: 'arc-1957-03-06-tm', title: 'The Mirror — 6 March 1957 (Independence Souvenir)', slug: 'the-mirror-1957-03-06', publicationId: 'pub-the-mirror', publicationName: 'The Mirror', editionNumber: '548', publicationDate: '1957-03-06', pageCount: 10, digitizedPages: 10, ocrStatus: 'complete', price: '0.05', isFree: false, isPublished: true, thumbnailId: 'th-arc-1957-03-06-tm', documentId: 'doc-arc-1957-03-06-tm', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 3410 },

  // 1960's
  { id: 'arc-1962-07-14-dg', title: 'Daily Graphic — 14 July 1962', slug: 'daily-graphic-1962-07-14', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '3920', publicationDate: '1962-07-14', pageCount: 14, digitizedPages: 14, ocrStatus: 'complete', price: '0.08', isFree: false, isPublished: true, thumbnailId: 'th-arc-1962-07-14-dg', documentId: 'doc-arc-1962-07-14-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1210 },
  { id: 'arc-1962-07-14-gs', title: 'Graphic Sports — 14 July 1962', slug: 'graphic-sports-1962-07-14', publicationId: 'pub-graphic-sports', publicationName: 'Graphic Sports', editionNumber: '210', publicationDate: '1962-07-14', pageCount: 8, digitizedPages: 5, ocrStatus: 'partial', price: '0.08', isFree: false, isPublished: true, thumbnailId: 'th-arc-1962-07-14-gs', documentId: 'doc-arc-1962-07-14-gs', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 640 },
  { id: 'arc-1969-11-02-dg', title: 'Daily Graphic — 2 November 1969', slug: 'daily-graphic-1969-11-02', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '5710', publicationDate: '1969-11-02', pageCount: 16, digitizedPages: 16, ocrStatus: 'complete', price: '0.08', isFree: false, isPublished: true, thumbnailId: 'th-arc-1969-11-02-dg', documentId: 'doc-arc-1969-11-02-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 890 },
  { id: 'arc-1969-11-02-tm', title: 'The Mirror — 2 November 1969', slug: 'the-mirror-1969-11-02', publicationId: 'pub-the-mirror', publicationName: 'The Mirror', editionNumber: '1240', publicationDate: '1969-11-02', pageCount: 10, digitizedPages: 10, ocrStatus: 'complete', price: '0.08', isFree: false, isPublished: true, thumbnailId: 'th-arc-1969-11-02-tm', documentId: 'doc-arc-1969-11-02-tm', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 520 },

  // 1970's
  { id: 'arc-1974-10-22-dg', title: 'Daily Graphic — 22 October 1974', slug: 'daily-graphic-1974-10-22', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '7420', publicationDate: '1974-10-22', pageCount: 18, digitizedPages: 18, ocrStatus: 'complete', price: '0.10', isFree: false, isPublished: true, thumbnailId: 'th-arc-1974-10-22-dg', documentId: 'doc-arc-1974-10-22-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1560 },
  { id: 'arc-1974-10-22-tm', title: 'The Mirror — 22 October 1974', slug: 'the-mirror-1974-10-22', publicationId: 'pub-the-mirror', publicationName: 'The Mirror', editionNumber: '1820', publicationDate: '1974-10-22', pageCount: 12, digitizedPages: 12, ocrStatus: 'complete', price: '0.10', isFree: false, isPublished: true, thumbnailId: 'th-arc-1974-10-22-tm', documentId: 'doc-arc-1974-10-22-tm', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 720 },
  { id: 'arc-1974-10-22-gs', title: 'Graphic Sports — 22 October 1974', slug: 'graphic-sports-1974-10-22', publicationId: 'pub-graphic-sports', publicationName: 'Graphic Sports', editionNumber: '880', publicationDate: '1974-10-22', pageCount: 10, digitizedPages: 7, ocrStatus: 'partial', price: '0.10', isFree: false, isPublished: true, thumbnailId: 'th-arc-1974-10-22-gs', documentId: 'doc-arc-1974-10-22-gs', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 410 },
  { id: 'arc-1979-12-31-dg', title: 'Daily Graphic — 31 December 1979 (Year End)', slug: 'daily-graphic-1979-12-31', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '8910', publicationDate: '1979-12-31', pageCount: 20, digitizedPages: 20, ocrStatus: 'complete', price: '0.10', isFree: false, isPublished: true, thumbnailId: 'th-arc-1979-12-31-dg', documentId: 'doc-arc-1979-12-31-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1980 },

  // 1980's
  { id: 'arc-1983-01-15-dg', title: 'Daily Graphic — 15 January 1983', slug: 'daily-graphic-1983-01-15', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '9240', publicationDate: '1983-01-15', pageCount: 16, digitizedPages: 16, ocrStatus: 'complete', price: '0.15', isFree: false, isPublished: true, thumbnailId: 'th-arc-1983-01-15-dg', documentId: 'doc-arc-1983-01-15-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 760 },
  { id: 'arc-1983-01-15-gb', title: 'Graphic Business — 15 January 1983', slug: 'graphic-business-1983-01-15', publicationId: 'pub-graphic-business', publicationName: 'Graphic Business', editionNumber: '120', publicationDate: '1983-01-15', pageCount: 8, digitizedPages: 0, ocrStatus: 'pending', price: '0.15', isFree: false, isPublished: true, thumbnailId: 'th-arc-1983-01-15-gb', documentId: 'doc-arc-1983-01-15-gb', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 300 },
  { id: 'arc-1988-06-25-dg', title: 'Daily Graphic — 25 June 1988', slug: 'daily-graphic-1988-06-25', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '10820', publicationDate: '1988-06-25', pageCount: 18, digitizedPages: 18, ocrStatus: 'complete', price: '0.20', isFree: false, isPublished: true, thumbnailId: 'th-arc-1988-06-25-dg', documentId: 'doc-arc-1988-06-25-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1120 },
  { id: 'arc-1988-06-25-tm', title: 'The Mirror — 25 June 1988', slug: 'the-mirror-1988-06-25', publicationId: 'pub-the-mirror', publicationName: 'The Mirror', editionNumber: '3210', publicationDate: '1988-06-25', pageCount: 12, digitizedPages: 12, ocrStatus: 'complete', price: '0.20', isFree: false, isPublished: true, thumbnailId: 'th-arc-1988-06-25-tm', documentId: 'doc-arc-1988-06-25-tm', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 540 },
  { id: 'arc-1988-06-25-jg', title: 'Junior Graphic — 25 June 1988', slug: 'junior-graphic-1988-06-25', publicationId: 'pub-junior-graphic', publicationName: 'Junior Graphic', editionNumber: '45', publicationDate: '1988-06-25', pageCount: 8, digitizedPages: 5, ocrStatus: 'partial', price: '0.00', isFree: true, isPublished: true, thumbnailId: 'th-arc-1988-06-25-jg', documentId: 'doc-arc-1988-06-25-jg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 210 },

  // 1990's
  { id: 'arc-1992-04-28-dg', title: 'Daily Graphic — 28 April 1992', slug: 'daily-graphic-1992-04-28', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '12110', publicationDate: '1992-04-28', pageCount: 20, digitizedPages: 20, ocrStatus: 'complete', price: '0.30', isFree: false, isPublished: true, thumbnailId: 'th-arc-1992-04-28-dg', documentId: 'doc-arc-1992-04-28-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1340 },
  { id: 'arc-1992-04-28-gb', title: 'Graphic Business — 28 April 1992', slug: 'graphic-business-1992-04-28', publicationId: 'pub-graphic-business', publicationName: 'Graphic Business', editionNumber: '410', publicationDate: '1992-04-28', pageCount: 10, digitizedPages: 10, ocrStatus: 'complete', price: '0.25', isFree: false, isPublished: true, thumbnailId: 'th-arc-1992-04-28-gb', documentId: 'doc-arc-1992-04-28-gb', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 480 },
  { id: 'arc-1996-09-20-dg', title: 'Daily Graphic — 20 September 1996', slug: 'daily-graphic-1996-09-20', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '13540', publicationDate: '1996-09-20', pageCount: 22, digitizedPages: 22, ocrStatus: 'complete', price: '0.40', isFree: false, isPublished: true, thumbnailId: 'th-arc-1996-09-20-dg', documentId: 'doc-arc-1996-09-20-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 980 },
  { id: 'arc-1996-09-20-gs', title: 'Graphic Sports — 20 September 1996', slug: 'graphic-sports-1996-09-20', publicationId: 'pub-graphic-sports', publicationName: 'Graphic Sports', editionNumber: '1240', publicationDate: '1996-09-20', pageCount: 12, digitizedPages: 12, ocrStatus: 'complete', price: '0.30', isFree: false, isPublished: true, thumbnailId: 'th-arc-1996-09-20-gs', documentId: 'doc-arc-1996-09-20-gs', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 620 },
  { id: 'arc-1996-09-20-tm', title: 'The Mirror — 20 September 1996', slug: 'the-mirror-1996-09-20', publicationId: 'pub-the-mirror', publicationName: 'The Mirror', editionNumber: '4120', publicationDate: '1996-09-20', pageCount: 12, digitizedPages: 8, ocrStatus: 'partial', price: '0.30', isFree: false, isPublished: true, thumbnailId: 'th-arc-1996-09-20-tm', documentId: 'doc-arc-1996-09-20-tm', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 450 },

  // 2000's
  { id: 'arc-2003-05-12-dg', title: 'Daily Graphic — 12 May 2003', slug: 'daily-graphic-2003-05-12', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '15320', publicationDate: '2003-05-12', pageCount: 24, digitizedPages: 24, ocrStatus: 'complete', price: '1.00', isFree: false, isPublished: true, thumbnailId: 'th-arc-2003-05-12-dg', documentId: 'doc-arc-2003-05-12-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 2210 },
  { id: 'arc-2003-05-12-gsb', title: 'Graphic Showbiz — 12 May 2003', slug: 'graphic-showbiz-2003-05-12', publicationId: 'pub-graphic-showbiz', publicationName: 'Graphic Showbiz', editionNumber: '310', publicationDate: '2003-05-12', pageCount: 12, digitizedPages: 12, ocrStatus: 'complete', price: '0.80', isFree: false, isPublished: true, thumbnailId: 'th-arc-2003-05-12-gsb', documentId: 'doc-arc-2003-05-12-gsb', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 890 },
  { id: 'arc-2008-11-04-dg', title: 'Daily Graphic — 4 November 2008', slug: 'daily-graphic-2008-11-04', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '17110', publicationDate: '2008-11-04', pageCount: 28, digitizedPages: 28, ocrStatus: 'complete', price: '1.50', isFree: false, isPublished: true, thumbnailId: 'th-arc-2008-11-04-dg', documentId: 'doc-arc-2008-11-04-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1890 },
  { id: 'arc-2008-11-04-gb', title: 'Graphic Business — 4 November 2008', slug: 'graphic-business-2008-11-04', publicationId: 'pub-graphic-business', publicationName: 'Graphic Business', editionNumber: '920', publicationDate: '2008-11-04', pageCount: 14, digitizedPages: 14, ocrStatus: 'complete', price: '1.20', isFree: false, isPublished: true, thumbnailId: 'th-arc-2008-11-04-gb', documentId: 'doc-arc-2008-11-04-gb', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1120 },
  { id: 'arc-2008-11-04-jg', title: 'Junior Graphic — 4 November 2008', slug: 'junior-graphic-2008-11-04', publicationId: 'pub-junior-graphic', publicationName: 'Junior Graphic', editionNumber: '210', publicationDate: '2008-11-04', pageCount: 12, digitizedPages: 12, ocrStatus: 'complete', price: '0.00', isFree: true, isPublished: true, thumbnailId: 'th-arc-2008-11-04-jg', documentId: 'doc-arc-2008-11-04-jg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 640 },

  // 2010's
  { id: 'arc-2013-07-01-dg', title: 'Daily Graphic — 1 July 2013', slug: 'daily-graphic-2013-07-01', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '19240', publicationDate: '2013-07-01', pageCount: 32, digitizedPages: 32, ocrStatus: 'complete', price: '2.50', isFree: false, isPublished: true, thumbnailId: 'th-arc-2013-07-01-dg', documentId: 'doc-arc-2013-07-01-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 3120 },
  { id: 'arc-2013-07-01-gb', title: 'Graphic Business — 1 July 2013', slug: 'graphic-business-2013-07-01', publicationId: 'pub-graphic-business', publicationName: 'Graphic Business', editionNumber: '1420', publicationDate: '2013-07-01', pageCount: 16, digitizedPages: 16, ocrStatus: 'complete', price: '2.00', isFree: false, isPublished: true, thumbnailId: 'th-arc-2013-07-01-gb', documentId: 'doc-arc-2013-07-01-gb', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1540 },
  { id: 'arc-2013-07-01-tm', title: 'The Mirror — 1 July 2013', slug: 'the-mirror-2013-07-01', publicationId: 'pub-the-mirror', publicationName: 'The Mirror', editionNumber: '5210', publicationDate: '2013-07-01', pageCount: 16, digitizedPages: 16, ocrStatus: 'complete', price: '2.00', isFree: false, isPublished: true, thumbnailId: 'th-arc-2013-07-01-tm', documentId: 'doc-arc-2013-07-01-tm', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 980 },
  { id: 'arc-2018-08-18-dg', title: 'Daily Graphic — 18 August 2018', slug: 'daily-graphic-2018-08-18', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '21110', publicationDate: '2018-08-18', pageCount: 36, digitizedPages: 36, ocrStatus: 'complete', price: '4.00', isFree: false, isPublished: true, thumbnailId: 'th-arc-2018-08-18-dg', documentId: 'doc-arc-2018-08-18-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 4210 },
  { id: 'arc-2018-08-18-gs', title: 'Graphic Sports — 18 August 2018', slug: 'graphic-sports-2018-08-18', publicationId: 'pub-graphic-sports', publicationName: 'Graphic Sports', editionNumber: '2210', publicationDate: '2018-08-18', pageCount: 16, digitizedPages: 16, ocrStatus: 'complete', price: '3.00', isFree: false, isPublished: true, thumbnailId: 'th-arc-2018-08-18-gs', documentId: 'doc-arc-2018-08-18-gs', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1890 },
  { id: 'arc-2018-08-18-gsb', title: 'Graphic Showbiz — 18 August 2018', slug: 'graphic-showbiz-2018-08-18', publicationId: 'pub-graphic-showbiz', publicationName: 'Graphic Showbiz', editionNumber: '880', publicationDate: '2018-08-18', pageCount: 14, digitizedPages: 9, ocrStatus: 'partial', price: '2.50', isFree: false, isPublished: true, thumbnailId: 'th-arc-2018-08-18-gsb', documentId: 'doc-arc-2018-08-18-gsb', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1240 },

  // 2020's
  { id: 'arc-2021-03-06-dg', title: 'Daily Graphic — 6 March 2021 (Founders Day)', slug: 'daily-graphic-2021-03-06', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '23210', publicationDate: '2021-03-06', pageCount: 40, digitizedPages: 40, ocrStatus: 'complete', price: '5.00', isFree: false, isPublished: true, thumbnailId: 'th-arc-2021-03-06-dg', documentId: 'doc-arc-2021-03-06-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 5120 },
  { id: 'arc-2021-03-06-gb', title: 'Graphic Business — 6 March 2021', slug: 'graphic-business-2021-03-06', publicationId: 'pub-graphic-business', publicationName: 'Graphic Business', editionNumber: '2810', publicationDate: '2021-03-06', pageCount: 18, digitizedPages: 18, ocrStatus: 'complete', price: '4.00', isFree: false, isPublished: true, thumbnailId: 'th-arc-2021-03-06-gb', documentId: 'doc-arc-2021-03-06-gb', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 2310 },
  { id: 'arc-2021-03-06-jg', title: 'Junior Graphic — 6 March 2021', slug: 'junior-graphic-2021-03-06', publicationId: 'pub-junior-graphic', publicationName: 'Junior Graphic', editionNumber: '420', publicationDate: '2021-03-06', pageCount: 14, digitizedPages: 14, ocrStatus: 'complete', price: '0.00', isFree: true, isPublished: true, thumbnailId: 'th-arc-2021-03-06-jg', documentId: 'doc-arc-2021-03-06-jg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1890 },
  { id: 'arc-2023-10-23-dg', title: 'Daily Graphic — 23 October 2023', slug: 'daily-graphic-2023-10-23', publicationId: 'pub-daily-graphic', publicationName: 'Daily Graphic', editionNumber: '24120', publicationDate: '2023-10-23', pageCount: 44, digitizedPages: 44, ocrStatus: 'complete', price: '5.00', isFree: false, isPublished: true, thumbnailId: 'th-arc-2023-10-23-dg', documentId: 'doc-arc-2023-10-23-dg', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 6210 },
  { id: 'arc-2023-10-23-tm', title: 'The Mirror — 23 October 2023', slug: 'the-mirror-2023-10-23', publicationId: 'pub-the-mirror', publicationName: 'The Mirror', editionNumber: '6120', publicationDate: '2023-10-23', pageCount: 18, digitizedPages: 18, ocrStatus: 'complete', price: '4.50', isFree: false, isPublished: true, thumbnailId: 'th-arc-2023-10-23-tm', documentId: 'doc-arc-2023-10-23-tm', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 2140 },
  { id: 'arc-2023-10-23-gs', title: 'Graphic Sports — 23 October 2023', slug: 'graphic-sports-2023-10-23', publicationId: 'pub-graphic-sports', publicationName: 'Graphic Sports', editionNumber: '2820', publicationDate: '2023-10-23', pageCount: 16, digitizedPages: 16, ocrStatus: 'complete', price: '4.00', isFree: false, isPublished: true, thumbnailId: 'th-arc-2023-10-23-gs', documentId: 'doc-arc-2023-10-23-gs', storageService: 'g3', createdAt: '2024-01-12T10:00:00Z', views: 1980 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────────────────────
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "Saturday, 6 March 1957" */
export function formatArchiveDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const yearOf = (edition) => Number(edition.publicationDate.slice(0, 4));
const decadeOf = (year) => `${Math.floor(year / 10) * 10}s`;

const matchesFilters = (edition, f) => {
  const q = String(f.query || '').trim().toLowerCase();
  if (q) {
    const haystack = `${edition.title} ${edition.publicationName} ${edition.editionNumber}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (f.publicationId && edition.publicationId !== f.publicationId) return false;
  if (f.ocrStatus && edition.ocrStatus !== f.ocrStatus) return false;
  if (f.decade && decadeOf(yearOf(edition)) !== f.decade) return false;
  if (f.year && yearOf(edition) !== Number(f.year)) return false;
  if (f.dateFrom && edition.publicationDate < f.dateFrom) return false;
  if (f.dateTo && edition.publicationDate > f.dateTo) return false;
  return true;
};

// ── Service functions (backend API blueprint) ──────────────────────────────────────────────────

/** Archive-wide coverage summary chips. */
export function getArchiveCoverageSummary() {
  const editions = MOCK_ARCHIVE_DECADES.reduce((sum, d) => sum + d.editionCount, 0);
  const pages = MOCK_ARCHIVE_DECADES.reduce((sum, d) => sum + d.pageCount, 0);
  return {
    decades: MOCK_ARCHIVE_DECADES.length,
    editions,
    pages,
    publications: MOCK_ARCHIVE_PUBLICATIONS.length,
    ocrCompletePct: 91.4,
    dateSpan: `${MOCK_ARCHIVE_DECADES[0].startYear} – ${MOCK_ARCHIVE_DECADES[MOCK_ARCHIVE_DECADES.length - 1].endYear}`,
  };
}

/** Decade collections ("Collections by Years" mode), each with per-year stats. */
export function listArchiveDecades() {
  return MOCK_ARCHIVE_DECADES.map((d) => ({
    ...d,
    yearStats: d.yearStats.map((y) => ({ ...y })),
  }));
}

/** Flat, filtered, paginated archived editions (plain list mode). */
export function listArchivedEditions(dto = {}) {
  const { pageSize = 30, pageNo = 1, sort = 'desc' } = dto;
  let rows = MOCK_ARCHIVE_EDITIONS.filter((e) => matchesFilters(e, dto)).slice();
  rows.sort((a, b) =>
    sort === 'asc'
      ? a.publicationDate.localeCompare(b.publicationDate)
      : b.publicationDate.localeCompare(a.publicationDate)
  );

  const totalCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePageNo = Math.min(Math.max(1, pageNo), totalPages);
  const lowerBound = totalCount === 0 ? 0 : (safePageNo - 1) * pageSize + 1;
  const upperBound = Math.min(safePageNo * pageSize, totalCount);
  const data = rows.slice((safePageNo - 1) * pageSize, safePageNo * pageSize).map((e) => ({ ...e }));

  return { data, pageNo: safePageNo, pageSize, totalCount, totalPages, lowerBound, upperBound };
}

/**
 * Date-grouped view ("By Dates with thumbnails" mode): one group per publication date,
 * paginated by date groups. `sort` = 'desc' (newest first, default) | 'asc'.
 */
export function listArchivesByDate(dto = {}) {
  const { pageSize = 12, pageNo = 1, sort = 'desc' } = dto;

  const byDate = new Map();
  for (const e of MOCK_ARCHIVE_EDITIONS) {
    if (!matchesFilters(e, dto)) continue;
    if (!byDate.has(e.publicationDate)) byDate.set(e.publicationDate, []);
    byDate.get(e.publicationDate).push({ ...e });
  }

  let groups = [...byDate.entries()].map(([date, editions]) => ({
    date,
    label: formatArchiveDateLabel(date),
    editionCount: editions.length,
    pageCount: editions.reduce((sum, e) => sum + e.pageCount, 0),
    editions: editions.sort((a, b) => a.publicationName.localeCompare(b.publicationName)),
  }));

  groups.sort((a, b) => (sort === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));

  const totalCount = groups.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePageNo = Math.min(Math.max(1, pageNo), totalPages);
  const lowerBound = totalCount === 0 ? 0 : (safePageNo - 1) * pageSize + 1;
  const upperBound = Math.min(safePageNo * pageSize, totalCount);
  const dateGroups = groups.slice((safePageNo - 1) * pageSize, safePageNo * pageSize);

  return { dateGroups, pageNo: safePageNo, pageSize, totalCount, totalPages, lowerBound, upperBound };
}

/** Sample editions belonging to one decade (used for the stacked thumbnails on decade cards). */
export function getDecadeCoverEditions(decadeId, limit = 3) {
  return MOCK_ARCHIVE_EDITIONS
    .filter((e) => decadeOf(yearOf(e)) === decadeId)
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
    .slice(0, limit)
    .map((e) => ({ ...e }));
}
