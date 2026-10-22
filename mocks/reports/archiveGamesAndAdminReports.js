// Plain JavaScript mock data for Group 6 (Historical Archives & AI RAG),
// Group 7 (Interactive Games & Puzzles), and Group 8 (Admin & Security Audits)
// Backend Target: https://github.com/rhyolite-prime/gnp-api

export const ARCHIVE_GAMES_ADMIN_REPORTS_MOCK = {
  // 6.1 [SUGGESTED] Historical Archive Search & AI RAG Intelligence -> POST /api/v1/reports/archive-rag-intelligence
  // Source tables: archives, archive_articles, archive_embeddings (pgvector) + archive_search_and_rag_logs (suggested)
  archive_rag_intelligence: {
    endpoint: '/api/v1/reports/archive-rag-intelligence',
    isSuggested: true,
    summary: [
      { key: 'archiveSearches', label: 'Archive Keyword Searches', value: 19420, format: 'number', changePct: 18.5 },
      { key: 'ragCitationsServed', label: 'AI RAG Grounded Answers', value: 7380, format: 'number', changePct: 24.1 },
      { key: 'avgVectorSimilarity', label: 'Avg Cosine Similarity', value: 89.4, format: 'percent', changePct: 1.9 },
      { key: 'zeroResultRatePct', label: 'Zero-Hit Digitization Gap', value: 3.8, format: 'percent', changePct: -1.1 },
    ],
    charts: [
      {
        id: 'archive_decade_demand',
        title: 'Research Queries by Historical Decade (1950s – 2020s)',
        type: 'bar_line',
        span: 'full',
        labels: ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'],
        yAxisLabel: 'Searches',
        secondaryYAxisLabel: 'AI Citations',
        series: [
          { name: 'Keyword Searches', type: 'bar', data: [2140, 3290, 1890, 2050, 2980, 2410, 2390, 2270] },
          { name: 'AI RAG Citations', type: 'line', yAxisIndex: 1, data: [890, 1420, 680, 740, 1180, 890, 820, 760] },
        ],
      },
    ],
    columns: [
      { key: 'decade', label: 'Historical Era' },
      { key: 'indexedPages', label: 'Digitized Pages', align: 'right', format: 'number' },
      { key: 'keywordSearches', label: 'Searches', align: 'right', format: 'number' },
      { key: 'ragQueries', label: 'AI RAG Answers', align: 'right', format: 'number' },
      { key: 'topQuery', label: 'Most Researched Topic' },
    ],
    rows: [
      { decade: '1950 – 1959 (Independence Era)', indexedPages: 28400, keywordSearches: 2140, ragQueries: 890, topQuery: '6 March 1957 Independence & Parliamentary Debates' },
      { decade: '1960 – 1969 (First Republic)', indexedPages: 42100, keywordSearches: 3290, ragQueries: 1420, topQuery: 'Akosombo Hydroelectric Dam Construction' },
      { decade: '1970 – 1979', indexedPages: 49300, keywordSearches: 1890, ragQueries: 680, topQuery: 'Operation Feed Yourself Agricultural Policy' },
      { decade: '1990 – 1999 (Fourth Republic)', indexedPages: 63200, keywordSearches: 2980, ragQueries: 1180, topQuery: '1992 Constitutional Referendum & Elections' },
      { decade: '2000 – 2009', indexedPages: 76400, keywordSearches: 2410, ragQueries: 890, topQuery: '2007 Ghana Cedi Redenomination Exercise' },
    ],
  },

  // 6.2 [SUGGESTED] Institutional Archive Credit Ledger -> POST /api/v1/reports/institutional-archive-credits
  institutional_archive_credits: {
    endpoint: '/api/v1/reports/institutional-archive-credits',
    isSuggested: true,
    summary: [
      { key: 'activeInstitutions', label: 'Active Institutions', value: 26, format: 'number', changePct: 13.0 },
      { key: 'creditsConsumed', label: 'Credits Consumed (30d)', value: 34280, format: 'number', changePct: 19.4 },
      { key: 'topupRevenueGhs', label: 'Credit Top-Up Revenue', value: 42800.0, format: 'currency', changePct: 22.0 },
      { key: 'clippingsExported', label: 'Certified PDF Clippings', value: 6840, format: 'number', changePct: 15.2 },
    ],
    charts: [
      {
        id: 'institution_credit_consumption',
        title: 'Archive Credit Consumption by Institution',
        type: 'horizontal_bar',
        labels: ['Univ. of Ghana', 'KNUST Library', 'Bank of Ghana', 'Parliament Library', 'UCC Library'],
        series: [{ name: 'Credits Used', data: [9420, 7180, 5840, 4920, 3810] }],
      },
    ],
    columns: [
      { key: 'institution', label: 'Institution' },
      { key: 'purchasedCredits', label: 'Credits Purchased', align: 'right', format: 'number' },
      { key: 'consumedCredits', label: 'Consumed', align: 'right', format: 'number' },
      { key: 'remainingBalance', label: 'Balance', align: 'right', format: 'number' },
      { key: 'billedGhs', label: 'Amount Billed (GHS)', align: 'right', format: 'currency' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { institution: 'University of Ghana (Balme Library)', purchasedCredits: 12000, consumedCredits: 9420, remainingBalance: 2580, billedGhs: 14400.0, status: 'Active' },
      { institution: 'KNUST Library System', purchasedCredits: 10000, consumedCredits: 7180, remainingBalance: 2820, billedGhs: 12000.0, status: 'Active' },
      { institution: 'Bank of Ghana Research Dept.', purchasedCredits: 7500, consumedCredits: 5840, remainingBalance: 1660, billedGhs: 9000.0, status: 'Active' },
      { institution: 'Parliament of Ghana Library', purchasedCredits: 5000, consumedCredits: 4920, remainingBalance: 80, billedGhs: 6000.0, status: 'Pending' },
    ],
  },

  // 7.1 [SUGGESTED] Daily Games & Puzzles Engagement -> POST /api/v1/reports/games-engagement-retention
  // Source tables: puzzles, puzzle_attempts, puzzle_leaderboards
  games_engagement_retention: {
    endpoint: '/api/v1/reports/games-engagement-retention',
    isSuggested: true,
    summary: [
      { key: 'dailyPuzzleStarts', label: 'Puzzle Sessions (30d)', value: 92400, format: 'number', changePct: 28.4 },
      { key: 'completionRatePct', label: 'Puzzle Completion Rate', value: 74.2, format: 'percent', changePct: 3.1 },
      { key: 'streakHolders7d', label: '7+ Day Streak Readers', value: 4180, format: 'number', changePct: 19.6 },
      { key: 'churnReductionLift', label: 'Retention Lift vs Non-Players', value: 24.0, format: 'percent', changePct: 2.5 },
    ],
    charts: [
      {
        id: 'games_sessions_by_type',
        title: 'Sessions & Completion Rate by Game Title',
        type: 'bar_line',
        span: 'full',
        labels: ['Graphic Mini Crossword', 'Ghana Word Guess', 'Daily Sudoku', 'News Trivia Quiz', ' Junior Word Search'],
        yAxisLabel: 'Sessions',
        secondaryYAxisLabel: 'Completion %',
        series: [
          { name: 'Sessions Started', type: 'bar', data: [29400, 26800, 17900, 11400, 6900] },
          { name: 'Completion %', type: 'line', yAxisIndex: 1, data: [76.4, 81.2, 64.5, 78.9, 84.0] },
        ],
      },
    ],
    columns: [
      { key: 'gameTitle', label: 'Game / Puzzle' },
      { key: 'sessionsStarted', label: 'Sessions', align: 'right', format: 'number' },
      { key: 'completedCount', label: 'Completed', align: 'right', format: 'number' },
      { key: 'completionPct', label: 'Completion %', align: 'right', format: 'percent' },
      { key: 'avgSolveSec', label: 'Avg Time (s)', align: 'right', format: 'number' },
    ],
    rows: [
      { gameTitle: 'Graphic Daily Mini Crossword', sessionsStarted: 29400, completedCount: 22461, completionPct: 76.4, avgSolveSec: 198 },
      { gameTitle: 'Ghana Word Guess (5-Letter)', sessionsStarted: 26800, completedCount: 21761, completionPct: 81.2, avgSolveSec: 142 },
      { gameTitle: 'Daily Classic Sudoku', sessionsStarted: 17900, completedCount: 11545, completionPct: 64.5, avgSolveSec: 412 },
      { gameTitle: 'Weekly Current Affairs Trivia', sessionsStarted: 11400, completedCount: 8994, completionPct: 78.9, avgSolveSec: 165 },
    ],
  },

  // 8.1 Admin Roles & Access -> POST /api/v1/reports/admin-roles
  // Source tables: admin_users, roles, permissions, role_permissions, user_groups
  admin_roles: {
    endpoint: '/api/v1/reports/admin-roles',
    summary: [
      { key: 'totalAdmins', label: 'Admin Staff Accounts', value: 34, format: 'number', changePct: 0.0 },
      { key: 'ssoEnforcedPct', label: 'Microsoft / Google SSO', value: 94.1, format: 'percent', changePct: 5.9 },
      { key: 'privilegedRoles', label: 'Super-Admin Seats', value: 4, format: 'number', changePct: 0.0 },
      { key: 'dormantAccounts', label: 'Inactive > 30 Days', value: 2, format: 'number', changePct: -33.3 },
    ],
    charts: [
      {
        id: 'admins_by_role_bar',
        title: 'Staff Distribution by Role',
        type: 'horizontal_bar',
        labels: ['Editorial & Production', 'Customer Support Desk', 'Finance & Billing', 'Marketing & Growth', 'Super Admin'],
        series: [{ name: 'Staff Users', data: [12, 8, 6, 4, 4] }],
      },
    ],
    columns: [
      { key: 'staffName', label: 'Admin User' },
      { key: 'email', label: 'Corporate Email' },
      { key: 'role', label: 'Assigned Role' },
      { key: 'authProvider', label: 'Auth Method' },
      { key: 'lastLogin', label: 'Last Login' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { staffName: 'Kofi Boateng', email: 'kofi.boateng@graphic.com.gh', role: 'Super Admin', authProvider: 'Microsoft Entra SSO', lastLogin: '2026-10-22 09:50', status: 'Active' },
      { staffName: 'Ama Serwaa', email: 'ama.serwaa@graphic.com.gh', role: 'Finance & Billing Manager', authProvider: 'Microsoft Entra SSO', lastLogin: '2026-10-22 08:31', status: 'Active' },
      { staffName: 'Nii Armah', email: 'nii.armah@graphic.com.gh', role: 'Editorial Ingestion Lead', authProvider: 'Microsoft Entra SSO', lastLogin: '2026-10-22 04:45', status: 'Active' },
      { staffName: 'Esi Mensimah', email: 'esi.mensimah@graphic.com.gh', role: 'Support Team Lead', authProvider: 'Google Workspace', lastLogin: '2026-10-21 18:12', status: 'Active' },
      { staffName: 'Yaw Ofori', email: 'yaw.ofori@graphic.com.gh', role: 'Auditor (Read-Only)', authProvider: 'Local + MFA', lastLogin: '2026-09-10 11:04', status: 'Inactive' },
    ],
  },

  // 8.2 Partner API Key Audit -> POST /api/v1/reports/api-key-audit
  // Source tables: commercial_partner_api_keys, commercial_partners (+ ALTER TABLE key_prefix, ip_whitelist, revoked_at)
  api_key_audit: {
    endpoint: '/api/v1/reports/api-key-audit',
    summary: [
      { key: 'totalKeysIssued', label: 'Total Issued Keys', value: 19, format: 'number', changePct: 5.5 },
      { key: 'activeKeys', label: 'Active Keys', value: 14, format: 'number', changePct: 7.7 },
      { key: 'expiringSoon', label: 'Expiring < 30 Days', value: 2, format: 'number', changePct: 0.0 },
      { key: 'revokedKeys', label: 'Revoked / Expired', value: 3, format: 'number', changePct: 0.0 },
    ],
    charts: [
      {
        id: 'api_key_posture_donut',
        title: 'Partner API Key Lifecycle Status',
        type: 'donut',
        items: [
          { name: 'Active & Scoped', value: 14 },
          { name: 'Expiring Within 30d', value: 2 },
          { name: 'Revoked / Expired', value: 3 },
        ],
      },
    ],
    columns: [
      { key: 'keyPrefix', label: 'Key Prefix' },
      { key: 'partnerName', label: 'Partner Organization' },
      { key: 'environment', label: 'Environment' },
      { key: 'lastUsedAt', label: 'Last Request' },
      { key: 'expiresAt', label: 'Expires On' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { keyPrefix: 'gnp_live_mtn_9f2a••••', partnerName: 'MTN Ghana PLC', environment: 'Production', lastUsedAt: '2026-10-22 09:58', expiresAt: '2027-06-30', status: 'Active' },
      { keyPrefix: 'gnp_live_ug_4c81••••', partnerName: 'University of Ghana', environment: 'Production', lastUsedAt: '2026-10-22 09:54', expiresAt: '2026-11-12', status: 'Pending' },
      { keyPrefix: 'gnp_live_gcb_71d0••••', partnerName: 'GCB Bank PLC', environment: 'Production', lastUsedAt: '2026-10-22 09:41', expiresAt: '2027-04-15', status: 'Active' },
      { keyPrefix: 'gnp_live_gnat_10b4••••', partnerName: 'GNAT', environment: 'Legacy Rotation', lastUsedAt: '2026-08-19 14:20', expiresAt: '2026-09-01', status: 'Inactive' },
    ],
  },

  // 8.3 [SUGGESTED] Security & Admin Audit Logs -> POST /api/v1/reports/security-audit-logs
  security_audit_logs: {
    endpoint: '/api/v1/reports/security-audit-logs',
    isSuggested: true,
    summary: [
      { key: 'privilegedEvents30d', label: 'Audited Admin Actions', value: 1284, format: 'number', changePct: 6.2 },
      { key: 'roleChanges', label: 'RBAC Permission Edits', value: 9, format: 'number', changePct: -18.0 },
      { key: 'invoiceOverrides', label: 'Billing Adjustments', value: 4, format: 'number', changePct: 0.0 },
      { key: 'blockedLogins', label: 'Blocked Login Attempts', value: 17, format: 'number', changePct: -29.0 },
    ],
    charts: [
      {
        id: 'audit_events_by_module',
        title: 'Audited Actions by Admin Module',
        type: 'horizontal_bar',
        labels: ['Content Ingestion', 'Subscriber Management', 'Partner Keys & Quotas', 'Finance & Refunds', 'RBAC & Roles'],
        series: [{ name: 'Events', data: [512, 348, 219, 134, 71] }],
      },
    ],
    columns: [
      { key: 'timestamp', label: 'Timestamp' },
      { key: 'actor', label: 'Admin Actor' },
      { key: 'action', label: 'Action Performed' },
      { key: 'resource', label: 'Target Resource' },
      { key: 'ipAddress', label: 'IP Address' },
      { key: 'status', label: 'Severity', format: 'badge' },
    ],
    rows: [
      { timestamp: '2026-10-22 09:34', actor: 'Ama Serwaa', action: 'INVOICE_EMAIL_DISPATCHED', resource: 'INV-GNP-2026-1042 (MTN Ghana)', ipAddress: '197.251.142.18', status: 'Active' },
      { timestamp: '2026-10-22 08:15', actor: 'Kofi Boateng', action: 'PARTNER_QUOTA_UPDATED', resource: 'University of Ghana (2,500 → 3,000)', ipAddress: '197.251.142.10', status: 'Pending' },
      { timestamp: '2026-10-21 16:48', actor: 'Kofi Boateng', action: 'API_KEY_REVOKED', resource: 'gnp_live_gnat_10b4', ipAddress: '197.251.142.10', status: 'Active' },
    ],
  },

  // 8.4 [SUGGESTED] Support Tickets & Resolution SLA -> POST /api/v1/reports/support-tickets-sla
  support_tickets_sla: {
    endpoint: '/api/v1/reports/support-tickets-sla',
    isSuggested: true,
    summary: [
      { key: 'ticketsOpened30d', label: 'Tickets Opened (30d)', value: 386, format: 'number', changePct: -7.4 },
      { key: 'slaMetPct', label: 'Resolved Within SLA', value: 93.8, format: 'percent', changePct: 2.9 },
      { key: 'firstResponseMin', label: 'Median First Reply (min)', value: 24, format: 'number', changePct: -19.0 },
      { key: 'csatScorePct', label: 'Subscriber CSAT', value: 94.5, format: 'percent', changePct: 1.5 },
    ],
    charts: [
      {
        id: 'tickets_by_category_donut',
        title: 'Support Volume by Issue Category',
        type: 'donut',
        items: [
          { name: 'MoMo Payment Delay', value: 142 },
          { name: 'Password / SSO Login', value: 98 },
          { name: 'Corporate Seat Activation', value: 74 },
          { name: 'Edition Page Rendering', value: 46 },
          { name: 'Archive Clipping Request', value: 26 },
        ],
      },
    ],
    columns: [
      { key: 'ticketNo', label: 'Ticket #' },
      { key: 'category', label: 'Category' },
      { key: 'subscriber', label: 'Requester' },
      { key: 'firstReplyMin', label: 'First Reply (min)', align: 'right', format: 'number' },
      { key: 'assignedTo', label: 'Agent' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { ticketNo: 'TKT-4821', category: 'MoMo Payment Delay', subscriber: 'Kofi Boateng', firstReplyMin: 14, assignedTo: 'Esi Mensimah', status: 'Active' },
      { ticketNo: 'TKT-4820', category: 'Corporate Seat Activation', subscriber: 'GCB HR Desk', firstReplyMin: 19, assignedTo: 'Esi Mensimah', status: 'Active' },
      { ticketNo: 'TKT-4818', category: 'Archive Clipping Request', subscriber: 'Dr. Mensah (UG)', firstReplyMin: 31, assignedTo: 'Archive Desk', status: 'Pending' },
    ],
  },
};
