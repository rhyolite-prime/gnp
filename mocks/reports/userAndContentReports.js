// Plain JavaScript mock data for Group 2 (User & Subscriber) & Group 3 (Content & Newspaper)
// Backend Target: https://github.com/rhyolite-prime/gnp-api (UsersController, SubscriptionsController, NewspaperService)

export const USER_AND_CONTENT_REPORTS_MOCK = {
  // 2.1 Subscriber Demographics & Status -> POST /api/v1/reports/subscriber-demographics
  // Source tables: users, user_profiles, countries
  subscriber_demographics: {
    endpoint: '/api/v1/reports/subscriber-demographics',
    summary: [
      { key: 'totalRegistered', label: 'Registered Readers', value: 28450, format: 'number', changePct: 14.8 },
      { key: 'activeAccounts', label: 'Active Accounts', value: 24190, format: 'number', changePct: 12.6 },
      { key: 'diasporaSharePct', label: 'Diaspora Readership', value: 34.2, format: 'percent', changePct: 4.1 },
      { key: 'verifiedEmailsPct', label: 'Verified Profiles', value: 91.5, format: 'percent', changePct: 2.3 },
    ],
    charts: [
      {
        id: 'signups_monthly_growth',
        title: 'New Subscriber Signups (Ghana vs Diaspora)',
        type: 'stacked_bar',
        span: 'full',
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        yAxisLabel: 'New Users',
        series: [
          { name: 'Ghana Domestic', data: [1120, 1240, 1310, 1450, 1520, 1680] },
          { name: 'Diaspora (UK / US / EU)', data: [540, 590, 645, 710, 780, 865] },
        ],
      },
      {
        id: 'readers_by_country_bar',
        title: 'Top Reader Countries',
        type: 'horizontal_bar',
        labels: ['Ghana', 'United Kingdom', 'United States', 'Canada', 'Germany', 'South Africa'],
        series: [{ name: 'Readers', data: [18720, 4120, 3290, 980, 760, 580] }],
      },
      {
        id: 'account_status_donut',
        title: 'Account Status Distribution',
        type: 'donut',
        items: [
          { name: 'Active', value: 24190 },
          { name: 'Pending Verification', value: 2640 },
          { name: 'Inactive / Dormant', value: 1620 },
        ],
      },
    ],
    columns: [
      { key: 'country', label: 'Country / Region' },
      { key: 'totalUsers', label: 'Total Users', align: 'right', format: 'number' },
      { key: 'paidSubscribers', label: 'Paid Subscribers', align: 'right', format: 'number' },
      { key: 'activePct', label: 'Active %', align: 'right', format: 'percent' },
      { key: 'primaryAuth', label: 'Top Auth Method' },
      { key: 'status', label: 'Segment Health', format: 'badge' },
    ],
    rows: [
      { country: 'Ghana (Greater Accra & Ashanti)', totalUsers: 18720, paidSubscribers: 9840, activePct: 86.4, primaryAuth: 'Email + OTP / Google', status: 'Active' },
      { country: 'United Kingdom', totalUsers: 4120, paidSubscribers: 2690, activePct: 88.2, primaryAuth: 'Google OAuth', status: 'Active' },
      { country: 'United States', totalUsers: 3290, paidSubscribers: 2140, activePct: 84.7, primaryAuth: 'Google / Microsoft SSO', status: 'Active' },
      { country: 'Canada', totalUsers: 980, paidSubscribers: 540, activePct: 81.0, primaryAuth: 'Email + Password', status: 'Active' },
      { country: 'Germany & EU', totalUsers: 760, paidSubscribers: 390, activePct: 79.5, primaryAuth: 'Google OAuth', status: 'Active' },
      { country: 'Rest of Africa / ECOWAS', totalUsers: 580, paidSubscribers: 220, activePct: 74.1, primaryAuth: 'Email + OTP', status: 'Pending' },
    ],
  },

  // 2.2 Subscription Plan Distribution -> POST /api/v1/reports/plan-distribution
  // Source tables: user_subscriptions, subscription_plans, package_publications
  plan_distribution: {
    endpoint: '/api/v1/reports/plan-distribution',
    summary: [
      { key: 'activePaidSeats', label: 'Total Active Subscriptions', value: 15820, format: 'number', changePct: 13.4 },
      { key: 'individualSeats', label: 'Individual Subscribers', value: 9410, format: 'number', changePct: 11.2 },
      { key: 'corporateSeats', label: 'Corporate B2B Seats', value: 6410, format: 'number', changePct: 16.9 },
      { key: 'annualSharePct', label: 'Annual Plan Share', value: 28.5, format: 'percent', changePct: 3.8 },
    ],
    charts: [
      {
        id: 'subscribers_by_plan_donut',
        title: 'Active Subscribers by Plan Tier',
        type: 'donut',
        items: [
          { name: 'Corporate Enterprise Seats', value: 6410 },
          { name: 'Premium Monthly', value: 4680 },
          { name: 'Standard Monthly', value: 2940 },
          { name: 'Premium Annual', value: 1790 },
        ],
      },
      {
        id: 'mrr_vs_headcount_bar',
        title: 'Subscribers vs Monthly Revenue Contribution',
        type: 'bar_line',
        labels: ['Corporate Seats', 'Premium Monthly', 'Standard Monthly', 'Premium Annual'],
        yAxisLabel: 'Subscribers',
        secondaryYAxisLabel: 'MRR (GHS)',
        series: [
          { name: 'Active Subscribers', type: 'bar', data: [6410, 4680, 2940, 1790] },
          { name: 'Monthly Revenue (GHS)', type: 'line', yAxisIndex: 1, data: [96400, 140400, 51450, 86516] },
        ],
      },
    ],
    columns: [
      { key: 'planCode', label: 'Plan Code' },
      { key: 'planName', label: 'Plan Name' },
      { key: 'billingCycle', label: 'Billing Cycle' },
      { key: 'unitPrice', label: 'Price (GHS)', align: 'right', format: 'currency' },
      { key: 'subscribers', label: 'Active Subscribers', align: 'right', format: 'number' },
      { key: 'mrrGhs', label: 'MRR Equivalent (GHS)', align: 'right', format: 'currency' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { planCode: 'PLN-CORP-ENT', planName: 'Corporate B2B Multi-Seat', billingCycle: 'Monthly Invoice', unitPrice: 15.0, subscribers: 6410, mrrGhs: 96150.0, status: 'Active' },
      { planCode: 'PLN-PREM-M', planName: 'Premium All-6 Publications', billingCycle: 'Monthly', unitPrice: 60.0, subscribers: 4680, mrrGhs: 280800.0, status: 'Active' },
      { planCode: 'PLN-STD-M', planName: 'Standard Daily Graphic + Mirror', billingCycle: 'Monthly', unitPrice: 35.0, subscribers: 2940, mrrGhs: 102900.0, status: 'Active' },
      { planCode: 'PLN-PREM-Y', planName: 'Premium Annual All-Access', billingCycle: 'Annual', unitPrice: 580.0, subscribers: 1790, mrrGhs: 86516.67, status: 'Active' },
    ],
  },

  // 2.3 [SUGGESTED] Subscriber Retention Cohorts -> POST /api/v1/reports/subscriber-retention-cohorts
  subscriber_retention_cohorts: {
    endpoint: '/api/v1/reports/subscriber-retention-cohorts',
    isSuggested: true,
    summary: [
      { key: 'm1RetentionPct', label: 'Month-1 Retention', value: 88.4, format: 'percent', changePct: 2.6 },
      { key: 'm3RetentionPct', label: 'Month-3 Retention', value: 76.2, format: 'percent', changePct: 3.4 },
      { key: 'm6RetentionPct', label: 'Month-6 Retention', value: 68.9, format: 'percent', changePct: 4.1 },
      { key: 'avgTenureMonths', label: 'Avg Subscriber Tenure', value: 11.4, format: 'number', changePct: 8.5 },
    ],
    charts: [
      {
        id: 'cohort_retention_heatmap',
        title: 'Monthly Signup Cohort Retention Matrix (%)',
        type: 'heatmap',
        span: 'full',
        xLabels: ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'],
        yLabels: ['May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'],
        // [xIndex, yIndex, retentionPct]
        matrix: [
          [0, 0, 100], [1, 0, 86], [2, 0, 79], [3, 0, 74], [4, 0, 71], [5, 0, 69],
          [0, 1, 100], [1, 1, 87], [2, 1, 81], [3, 1, 76], [4, 1, 73],
          [0, 2, 100], [1, 2, 88], [2, 2, 82], [3, 2, 77],
          [0, 3, 100], [1, 3, 89], [2, 3, 84],
          [0, 4, 100], [1, 4, 90],
          [0, 5, 100],
        ],
      },
    ],
    columns: [
      { key: 'cohortMonth', label: 'Signup Cohort' },
      { key: 'initialSubscribers', label: 'Cohort Size', align: 'right', format: 'number' },
      { key: 'm1Pct', label: 'Month 1', align: 'right', format: 'percent' },
      { key: 'm3Pct', label: 'Month 3', align: 'right', format: 'percent' },
      { key: 'ltvGhs', label: 'Avg LTV (GHS)', align: 'right', format: 'currency' },
    ],
    rows: [
      { cohortMonth: 'May 2026', initialSubscribers: 1660, m1Pct: 86.0, m3Pct: 74.0, ltvGhs: 412.5 },
      { cohortMonth: 'Jun 2026', initialSubscribers: 1830, m1Pct: 87.0, m3Pct: 76.0, ltvGhs: 428.0 },
      { cohortMonth: 'Jul 2026', initialSubscribers: 1955, m1Pct: 88.0, m3Pct: 77.0, ltvGhs: 441.2 },
      { cohortMonth: 'Aug 2026', initialSubscribers: 2160, m1Pct: 89.0, m3Pct: 78.4, ltvGhs: 456.0 },
      { cohortMonth: 'Sep 2026', initialSubscribers: 2300, m1Pct: 90.1, m3Pct: 0.0, ltvGhs: 468.0 },
    ],
  },

  // 3.1 Newspaper Engagement & Sales -> POST /api/v1/reports/newspaper-engagement
  // Preserves exact original `partners` + `engagementTimeSeries` structure AND enriches with full publication rows!
  newspaper_engagement: {
    endpoint: '/api/v1/reports/newspaper-engagement',
    partners: [
      { name: 'MTN Ghana PLC', enrolled: 3692, quota: 5000 },
      { name: 'University of Ghana', enrolled: 2790, quota: 3000 },
      { name: 'GCB Bank PLC', enrolled: 2140, quota: 2500 },
    ],
    summary: [
      { key: 'totalEditionViews', label: 'Total Edition Reads', value: 184620, format: 'number', changePct: 19.2 },
      { key: 'singleCopiesSold', label: 'Single Copies Sold', value: 4520, format: 'number', changePct: 12.5 },
      { key: 'avgReadMinutes', label: 'Avg Reading Time (min)', value: 18.6, format: 'number', changePct: 6.4 },
      { key: 'audioTtsListens', label: 'Article Audio Listens', value: 14280, format: 'number', changePct: 31.0 },
    ],
    charts: [
      {
        id: 'quota_utilization_donut',
        title: 'Partner Enrollment Utilization',
        type: 'donut',
        items: [
          { name: 'MTN Ghana PLC', value: 3692 },
          { name: 'University of Ghana', value: 2790 },
          { name: 'GCB Bank PLC', value: 2140 },
          { name: 'GNAT', value: 1280 },
        ],
      },
      {
        id: 'engagement_and_sales_7d',
        title: 'Engagement & Sales (7 Days)',
        type: 'bar_line',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        yAxisLabel: 'Views',
        secondaryYAxisLabel: 'Sales',
        series: [
          { name: 'Views', type: 'bar', data: [24500, 27300, 26840, 28180, 31350, 22470, 23980] },
          { name: 'Sales', type: 'line', yAxisIndex: 1, data: [620, 740, 690, 710, 890, 460, 410] },
        ],
      },
    ],
    columns: [
      { key: 'publication', label: 'Publication' },
      { key: 'editionsPublished', label: 'Issues (30d)', align: 'right', format: 'number' },
      { key: 'totalViews', label: 'Total Views', align: 'right', format: 'number' },
      { key: 'copiesSold', label: 'Copies Sold', align: 'right', format: 'number' },
      { key: 'completionPct', label: 'Avg Completion', align: 'right', format: 'percent' },
      { key: 'revenueGhs', label: 'Direct Sales (GHS)', align: 'right', format: 'currency' },
    ],
    rows: [
      { publication: 'Daily Graphic', editionsPublished: 26, totalViews: 94200, copiesSold: 2140, completionPct: 74.5, revenueGhs: 17120.0 },
      { publication: 'The Mirror', editionsPublished: 4, totalViews: 31400, copiesSold: 850, completionPct: 79.2, revenueGhs: 6800.0 },
      { publication: 'Graphic Business', editionsPublished: 4, totalViews: 24800, copiesSold: 640, completionPct: 81.0, revenueGhs: 6400.0 },
      { publication: 'Graphic Sports', editionsPublished: 8, totalViews: 16900, copiesSold: 420, completionPct: 68.4, revenueGhs: 2940.0 },
      { publication: 'Graphic Showbiz', editionsPublished: 4, totalViews: 10420, copiesSold: 260, completionPct: 71.8, revenueGhs: 1820.0 },
      { publication: 'Junior Graphic', editionsPublished: 4, totalViews: 6900, copiesSold: 210, completionPct: 84.6, revenueGhs: 1260.0 },
    ],
  },

  // 3.2 Content Inventory Status -> POST /api/v1/reports/content-inventory
  // Source tables: publications, newspapers, magazines, articles
  content_inventory: {
    endpoint: '/api/v1/reports/content-inventory',
    summary: [
      { key: 'totalIssuesCataloged', label: 'Published Issues', value: 14820, format: 'number', changePct: 4.2 },
      { key: 'extractedArticles', label: 'Extracted Articles', value: 392400, format: 'number', changePct: 5.8 },
      { key: 'magazinesCount', label: 'Special Magazines', value: 186, format: 'number', changePct: 3.3 },
      { key: 'ocrReadyPct', label: 'Full-Text Indexed', value: 98.7, format: 'percent', changePct: 0.6 },
    ],
    charts: [
      {
        id: 'catalog_by_publication',
        title: 'Digital Catalog Volume by Publication',
        type: 'horizontal_bar',
        labels: ['Daily Graphic', 'Graphic Sports', 'The Mirror', 'Junior Graphic', 'Graphic Business', 'Graphic Showbiz'],
        series: [{ name: 'Published Issues', data: [7840, 2190, 1620, 1210, 1080, 880] }],
      },
      {
        id: 'inventory_status_donut',
        title: 'Catalog Lifecycle State',
        type: 'donut',
        items: [
          { name: 'Published & Live', value: 14490 },
          { name: 'Scheduled Release', value: 42 },
          { name: 'Pending QA / OCR Review', value: 288 },
        ],
      },
    ],
    columns: [
      { key: 'title', label: 'Publication Title' },
      { key: 'frequency', label: 'Frequency' },
      { key: 'publishedCount', label: 'Published Issues', align: 'right', format: 'number' },
      { key: 'articlesIndexed', label: 'Indexed Articles', align: 'right', format: 'number' },
      { key: 'latestIssue', label: 'Latest Issue' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { title: 'Daily Graphic', frequency: 'Daily (Mon–Sat)', publishedCount: 7840, articlesIndexed: 248900, latestIssue: '2026-10-22', status: 'Published' },
      { title: 'The Mirror', frequency: 'Weekly (Saturday)', publishedCount: 1620, articlesIndexed: 41200, latestIssue: '2026-10-18', status: 'Published' },
      { title: 'Graphic Business', frequency: 'Weekly (Tuesday)', publishedCount: 1080, articlesIndexed: 32600, latestIssue: '2026-10-20', status: 'Published' },
      { title: 'Graphic Sports', frequency: 'Bi-Weekly', publishedCount: 2190, articlesIndexed: 38400, latestIssue: '2026-10-21', status: 'Published' },
      { title: 'Junior Graphic', frequency: 'Weekly (Wednesday)', publishedCount: 1210, articlesIndexed: 18900, latestIssue: '2026-10-21', status: 'Published' },
      { title: 'Graphic Showbiz', frequency: 'Weekly (Thursday)', publishedCount: 880, articlesIndexed: 12400, latestIssue: '2026-10-22', status: 'Published' },
    ],
  },

  // 3.3 Ingestion Job Logs -> POST /api/v1/reports/ingestion-jobs
  // Source tables: ingestion_jobs, ingestion_artifacts (+ ALTER TABLE page_count, ocr_confidence_avg, started_at, completed_at)
  ingestion_jobs: {
    endpoint: '/api/v1/reports/ingestion-jobs',
    summary: [
      { key: 'jobsCompleted30d', label: 'Completed Jobs (30d)', value: 194, format: 'number', changePct: 8.4 },
      { key: 'pipelineSuccessPct', label: 'Pipeline Reliability', value: 98.5, format: 'percent', changePct: 1.2 },
      { key: 'avgProcessingSec', label: 'Avg OCR & Slice Time (s)', value: 84, format: 'number', changePct: -14.0 },
      { key: 'avgOcrConfidence', label: 'Avg OCR Confidence', value: 97.9, format: 'percent', changePct: 0.8 },
    ],
    charts: [
      {
        id: 'ingestion_latency_trend',
        title: 'Daily Ingestion Duration & Pages Processed',
        type: 'bar_line',
        span: 'full',
        labels: ['16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct'],
        yAxisLabel: 'Pages Indexed',
        secondaryYAxisLabel: 'Avg Sec',
        series: [
          { name: 'Pages Indexed', type: 'bar', data: [112, 96, 64, 88, 128, 104, 120] },
          { name: 'Avg Processing (s)', type: 'line', yAxisIndex: 1, data: [91, 86, 74, 82, 95, 83, 79] },
        ],
      },
    ],
    columns: [
      { key: 'jobId', label: 'Job ID' },
      { key: 'edition', label: 'Edition Uploaded' },
      { key: 'pages', label: 'Pages', align: 'right', format: 'number' },
      { key: 'articlesExtracted', label: 'Articles Cut', align: 'right', format: 'number' },
      { key: 'durationSec', label: 'Duration (s)', align: 'right', format: 'number' },
      { key: 'completedAt', label: 'Completed At' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { jobId: 'ING-2026-0894', edition: 'Daily Graphic — 22 Oct 2026', pages: 48, articlesExtracted: 168, durationSec: 79, completedAt: '2026-10-22 04:42', status: 'Active' },
      { jobId: 'ING-2026-0893', edition: 'Graphic Showbiz — 22 Oct 2026', pages: 24, articlesExtracted: 74, durationSec: 46, completedAt: '2026-10-22 04:19', status: 'Active' },
      { jobId: 'ING-2026-0892', edition: 'Junior Graphic — 21 Oct 2026', pages: 32, articlesExtracted: 91, durationSec: 62, completedAt: '2026-10-21 05:03', status: 'Active' },
      { jobId: 'ING-2026-0891', edition: 'Graphic Business — 20 Oct 2026', pages: 40, articlesExtracted: 132, durationSec: 88, completedAt: '2026-10-20 04:51', status: 'Active' },
      { jobId: 'ING-2026-0890', edition: 'Historical Batch 1974 Microfilm #12', pages: 64, articlesExtracted: 215, durationSec: 184, completedAt: '2026-10-19 23:14', status: 'Pending' },
    ],
  },

  // 3.4 [SUGGESTED] Multimedia, Podcasts & Originals Performance -> POST /api/v1/reports/multimedia-originals-performance
  // Source tables: videos, originals_articles + audios & media_playback_events (suggested new tables)
  multimedia_originals_performance: {
    endpoint: '/api/v1/reports/multimedia-originals-performance',
    isSuggested: true,
    summary: [
      { key: 'videoPlays', label: 'Video & Documentary Plays', value: 64800, format: 'number', changePct: 26.4 },
      { key: 'podcastStreams', label: 'Podcast & Audio Streams', value: 38290, format: 'number', changePct: 33.1 },
      { key: 'originalsReads', label: 'NewsPlus Originals Reads', value: 52140, format: 'number', changePct: 19.7 },
      { key: 'avgCompletionPct', label: 'Avg Media Completion', value: 68.5, format: 'percent', changePct: 4.2 },
    ],
    charts: [
      {
        id: 'multimedia_format_growth',
        title: 'Weekly Consumption by Format',
        type: 'area_line',
        span: 'full',
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
        yAxisLabel: 'Streams / Reads',
        series: [
          { name: 'Video Documentaries', data: [8900, 9600, 10400, 11200, 11900, 12800] },
          { name: 'NewsPlus Originals', data: [7400, 8100, 8500, 8950, 9420, 9770] },
          { name: 'Podcasts & Audio Briefings', data: [4800, 5350, 6100, 6820, 7340, 7880] },
        ],
      },
    ],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'format', label: 'Format' },
      { key: 'playsOrReads', label: 'Plays / Reads', align: 'right', format: 'number' },
      { key: 'completionPct', label: 'Completion %', align: 'right', format: 'percent' },
      { key: 'subscriberConversions', label: 'attributed Signups', align: 'right', format: 'number' },
    ],
    rows: [
      { title: 'Graphic Business Roundtable: Cedi Stability & Export Growth', format: 'Video', playsOrReads: 18420, completionPct: 72.4, subscriberConversions: 94 },
      { title: 'Inside Galamsey Water Testing Labs (Investigative Desk)', format: 'Originals Longform', playsOrReads: 21950, completionPct: 81.2, subscriberConversions: 142 },
      { title: '5-Minute Morning Graphic Audio Briefing (06:00 GMT)', format: 'Podcast / Audio', playsOrReads: 19640, completionPct: 86.5, subscriberConversions: 76 },
      { title: 'Black Stars Tactical Breakdown Podcast', format: 'Podcast / Audio', playsOrReads: 11280, completionPct: 69.0, subscriberConversions: 41 },
    ],
  },
};
