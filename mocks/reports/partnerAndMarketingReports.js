// Plain JavaScript mock data for Group 4 (Commercial Partner B2B) & Group 5 (Marketing & Campaigns)
// Backend Target: https://github.com/rhyolite-prime/gnp-api (CommercialPartnerService, CampaignsController, AffiliateService)

export const PARTNER_AND_MARKETING_REPORTS_MOCK = {
  // 4.1 Partner Sub-account Engagement -> POST /api/v1/reports/partner-engagement
  // Source tables: commercial_partners, commercial_partner_sub_accounts, reading_history
  partner_engagement: {
    endpoint: '/api/v1/reports/partner-engagement',
    summary: [
      { key: 'activeCorporateReaders', label: 'Active Sub-Accounts', value: 8940, format: 'number', changePct: 15.6 },
      { key: 'totalPartnerReads', label: 'Corporate Edition Reads', value: 112480, format: 'number', changePct: 21.2 },
      { key: 'avgReadsPerSeat', label: 'Reads / Active Seat', value: 12.6, format: 'number', changePct: 4.8 },
      { key: 'seatActivationPct', label: 'Seat Activation Rate', value: 84.4, format: 'percent', changePct: 3.1 },
    ],
    charts: [
      {
        id: 'partner_reads_trend',
        title: 'Corporate Sub-Account Reads by Partner',
        type: 'stacked_bar',
        span: 'full',
        labels: ['W1 Oct', 'W2 Oct', 'W3 Oct', 'W4 Oct'],
        yAxisLabel: 'Reads',
        series: [
          { name: 'MTN Ghana PLC', data: [10400, 11200, 11850, 12490] },
          { name: 'University of Ghana', data: [7600, 8150, 8490, 8920] },
          { name: 'GCB Bank & BoG', data: [7200, 7690, 8120, 8450] },
        ],
      },
    ],
    columns: [
      { key: 'partnerName', label: 'Partner Organization' },
      { key: 'enrolledSeats', label: 'Enrolled Seats', align: 'right', format: 'number' },
      { key: 'monthlyActiveReaders', label: 'Active Readers', align: 'right', format: 'number' },
      { key: 'editionReads', label: 'Edition Reads', align: 'right', format: 'number' },
      { key: 'topPublication', label: 'Most Read Title' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { partnerName: 'MTN Ghana PLC', enrolledSeats: 3692, monthlyActiveReaders: 3210, editionReads: 45940, topPublication: 'Daily Graphic', status: 'Active' },
      { partnerName: 'University of Ghana (Balme Library)', enrolledSeats: 2790, monthlyActiveReaders: 2480, editionReads: 33160, topPublication: 'Daily Graphic & Archives', status: 'Active' },
      { partnerName: 'GCB Bank PLC', enrolledSeats: 2140, monthlyActiveReaders: 1790, editionReads: 19840, topPublication: 'Graphic Business', status: 'Active' },
      { partnerName: 'GNAT', enrolledSeats: 1280, monthlyActiveReaders: 940, editionReads: 8120, topPublication: 'Daily Graphic & Junior Graphic', status: 'Active' },
      { partnerName: 'Bank of Ghana Research Dept.', enrolledSeats: 685, monthlyActiveReaders: 520, editionReads: 5420, topPublication: 'Graphic Business', status: 'Active' },
    ],
  },

  // 4.2 Partner Quota & Usage -> POST /api/v1/reports/partner-quota
  partner_quota: {
    endpoint: '/api/v1/reports/partner-quota',
    summary: [
      { key: 'totalAllocatedSeats', label: 'Total Allocated Seats', value: 12800, format: 'number', changePct: 10.0 },
      { key: 'totalEnrolledSeats', label: 'Enrolled Seats', value: 10587, format: 'number', changePct: 14.3 },
      { key: 'remainingQuota', label: 'Remaining Capacity', value: 2213, format: 'number', changePct: -6.2 },
      { key: 'overallUtilizationPct', label: 'Overall Quota Utilization', value: 82.7, format: 'percent', changePct: 3.5 },
    ],
    charts: [
      {
        id: 'partner_quota_bars',
        title: 'Enrolled vs Remaining Seat Quota by Partner',
        type: 'stacked_bar',
        span: 'full',
        labels: ['MTN Ghana', 'Univ. of Ghana', 'GCB Bank', 'GNAT', 'Bank of Ghana'],
        yAxisLabel: 'Seats',
        series: [
          { name: 'Enrolled Seats', data: [3692, 2790, 2140, 1280, 685] },
          { name: 'Available Quota', data: [1308, 210, 360, 220, 115] },
        ],
      },
    ],
    columns: [
      { key: 'partnerName', label: 'Partner' },
      { key: 'assignedQuota', label: 'Assigned Quota', align: 'right', format: 'number' },
      { key: 'enrolledSeats', label: 'Enrolled', align: 'right', format: 'number' },
      { key: 'remainingSeats', label: 'Remaining', align: 'right', format: 'number' },
      { key: 'utilizationPct', label: 'Utilization %', align: 'right', format: 'percent' },
      { key: 'status', label: 'Alert State', format: 'badge' },
    ],
    rows: [
      { partnerName: 'University of Ghana (Balme Library)', assignedQuota: 3000, enrolledSeats: 2790, remainingSeats: 210, utilizationPct: 93.0, status: 'Pending' },
      { partnerName: 'Bank of Ghana Research Dept.', assignedQuota: 800, enrolledSeats: 685, remainingSeats: 115, utilizationPct: 85.6, status: 'Active' },
      { partnerName: 'GCB Bank PLC', assignedQuota: 2500, enrolledSeats: 2140, remainingSeats: 360, utilizationPct: 85.6, status: 'Active' },
      { partnerName: 'GNAT', assignedQuota: 1500, enrolledSeats: 1280, remainingSeats: 220, utilizationPct: 85.3, status: 'Active' },
      { partnerName: 'MTN Ghana PLC', assignedQuota: 5000, enrolledSeats: 3692, remainingSeats: 1308, utilizationPct: 73.8, status: 'Active' },
    ],
  },

  // 4.3 Partner API Usage Stats -> POST /api/v1/reports/partner-api-usage
  // Source tables: commercial_partner_api_logs, commercial_partner_api_keys
  partner_api_usage: {
    endpoint: '/api/v1/reports/partner-api-usage',
    summary: [
      { key: 'totalApiRequests', label: 'Total API Calls (30d)', value: 418920, format: 'number', changePct: 22.8 },
      { key: 'apiSuccessRatePct', label: 'HTTP 2xx Success Rate', value: 99.4, format: 'percent', changePct: 0.3 },
      { key: 'p95LatencyMs', label: 'P95 Latency (ms)', value: 142, format: 'number', changePct: -11.5 },
      { key: 'rateLimitedCount', label: 'HTTP 429 Throttled', value: 640, format: 'number', changePct: -18.0 },
    ],
    charts: [
      {
        id: 'api_calls_and_latency',
        title: 'Daily Partner API Requests & P95 Latency',
        type: 'bar_line',
        span: 'full',
        labels: ['16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct'],
        yAxisLabel: 'Requests',
        secondaryYAxisLabel: 'Latency (ms)',
        series: [
          { name: 'API Requests', type: 'bar', data: [58400, 61200, 44900, 52300, 66800, 68100, 67220] },
          { name: 'P95 Latency (ms)', type: 'line', yAxisIndex: 1, data: [149, 145, 132, 138, 146, 141, 139] },
        ],
      },
    ],
    columns: [
      { key: 'partnerName', label: 'Partner' },
      { key: 'endpointRoute', label: 'Top Endpoint' },
      { key: 'requests30d', label: 'Requests (30d)', align: 'right', format: 'number' },
      { key: 'avgLatencyMs', label: 'Avg Latency (ms)', align: 'right', format: 'number' },
      { key: 'errorRatePct', label: 'Error %', align: 'right', format: 'percent' },
      { key: 'status', label: 'Health', format: 'badge' },
    ],
    rows: [
      { partnerName: 'MTN Ghana PLC', endpointRoute: 'POST /partner/sub-accounts/sso-token', requests30d: 184200, avgLatencyMs: 96, errorRatePct: 0.4, status: 'Active' },
      { partnerName: 'University of Ghana', endpointRoute: 'GET /partner/archives/search', requests30d: 112600, avgLatencyMs: 168, errorRatePct: 0.7, status: 'Active' },
      { partnerName: 'GCB Bank PLC', endpointRoute: 'GET /partner/editions/latest', requests30d: 68400, avgLatencyMs: 84, errorRatePct: 0.3, status: 'Active' },
      { partnerName: 'Bank of Ghana Research', endpointRoute: 'POST /partner/rag/citations', requests30d: 53720, avgLatencyMs: 194, errorRatePct: 0.8, status: 'Active' },
    ],
  },

  // 5.1 Campaign Performance -> POST /api/v1/reports/campaign-performance
  // Source tables: campaigns + campaign_recipient_events (suggested new table)
  campaign_performance: {
    endpoint: '/api/v1/reports/campaign-performance',
    summary: [
      { key: 'messagesDelivered', label: 'Campaigns Delivered', value: 248600, format: 'number', changePct: 19.5 },
      { key: 'openOrViewRatePct', label: 'Open / View Rate', value: 38.4, format: 'percent', changePct: 3.2 },
      { key: 'clickThroughRatePct', label: 'Click-Through Rate', value: 11.8, format: 'percent', changePct: 2.1 },
      { key: 'attributedRevenueGhs', label: 'Attributed Revenue', value: 74920.0, format: 'currency', changePct: 24.6 },
    ],
    charts: [
      {
        id: 'channel_performance_comparison',
        title: 'Reach vs Clicks by Marketing Channel',
        type: 'bar_line',
        span: 'full',
        labels: ['Email Newsletters', 'Browser Push', 'SMS Alerts'],
        yAxisLabel: 'Delivered',
        secondaryYAxisLabel: 'CTR %',
        series: [
          { name: 'Delivered', type: 'bar', data: [112400, 94800, 41400] },
          { name: 'Click Rate %', type: 'line', yAxisIndex: 1, data: [8.4, 17.8, 6.9] },
        ],
      },
    ],
    columns: [
      { key: 'campaignName', label: 'Campaign' },
      { key: 'channel', label: 'Channel' },
      { key: 'delivered', label: 'Delivered', align: 'right', format: 'number' },
      { key: 'clicks', label: 'Clicks', align: 'right', format: 'number' },
      { key: 'ctrPct', label: 'CTR %', align: 'right', format: 'percent' },
      { key: 'revenueGhs', label: 'Revenue (GHS)', align: 'right', format: 'currency' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { campaignName: '2027 Budget Morning Briefing Push', channel: 'push', delivered: 48200, clicks: 8917, ctrPct: 18.5, revenueGhs: 19400.0, status: 'Active' },
      { campaignName: 'Annual Plan 20% Loyalty Offer', channel: 'email', delivered: 64100, clicks: 5897, ctrPct: 9.2, revenueGhs: 32600.0, status: 'Active' },
      { campaignName: 'MoMo Auto-Renewal Reminder', channel: 'sms', delivered: 41400, clicks: 2856, ctrPct: 6.9, revenueGhs: 14200.0, status: 'Active' },
      { campaignName: 'Weekend Mirror Digest', channel: 'email', delivered: 48300, clicks: 3525, ctrPct: 7.3, revenueGhs: 8720.0, status: 'Active' },
    ],
  },

  // 5.2 Coupon Usage & Effectiveness -> POST /api/v1/reports/coupon-usage
  // Source tables: coupons, coupon_redemptions, payments
  coupon_usage: {
    endpoint: '/api/v1/reports/coupon-usage',
    summary: [
      { key: 'totalRedemptions', label: 'Vouchers Redeemed', value: 1428, format: 'number', changePct: 16.4 },
      { key: 'discountGrantedGhs', label: 'Total Discount Value', value: 18940.0, format: 'currency', changePct: 9.2 },
      { key: 'netOrderValueGhs', label: 'Net Revenue Generated', value: 64280.0, format: 'currency', changePct: 23.1 },
      { key: 'redemptionRatePct', label: 'Quota Redemption %', value: 64.9, format: 'percent', changePct: 5.4 },
    ],
    charts: [
      {
        id: 'top_coupons_bar',
        title: 'Net Revenue vs Discount Granted by Coupon Code (GHS)',
        type: 'stacked_bar',
        span: 'full',
        labels: ['STUDENT50', 'ANNUAL20', 'DIASPORA15', 'CORPWELCOME', 'WEEKEND10'],
        yAxisLabel: 'GHS',
        series: [
          { name: 'Net Paid Revenue', data: [14800, 26400, 11900, 7480, 3700] },
          { name: 'Discount Absorbed', data: [7400, 6600, 2100, 1870, 970] },
        ],
      },
    ],
    columns: [
      { key: 'code', label: 'Coupon Code' },
      { key: 'discountRule', label: 'Discount' },
      { key: 'redeemed', label: 'Redeemed', align: 'right', format: 'number' },
      { key: 'maxUses', label: 'Limit', align: 'right', format: 'number' },
      { key: 'netRevenueGhs', label: 'Net Revenue (GHS)', align: 'right', format: 'currency' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { code: 'ANNUAL20', discountRule: '20% Off Annual Plan', redeemed: 456, maxUses: 600, netRevenueGhs: 26400.0, status: 'Active' },
      { code: 'STUDENT50', discountRule: '50% Campus Verification', redeemed: 422, maxUses: 500, netRevenueGhs: 14800.0, status: 'Active' },
      { code: 'DIASPORA15', discountRule: '15% Off Annual USD/GBP', redeemed: 268, maxUses: 500, netRevenueGhs: 11900.0, status: 'Active' },
      { code: 'CORPWELCOME', discountRule: 'First Month 20% Off', redeemed: 142, maxUses: 300, netRevenueGhs: 7480.0, status: 'Active' },
      { code: 'WEEKEND10', discountRule: 'GHS 2 Off Mirror Copy', redeemed: 140, maxUses: 300, netRevenueGhs: 3700.0, status: 'Inactive' },
    ],
  },

  // 5.3 [SUGGESTED] Affiliate Referral Performance -> POST /api/v1/reports/affiliate-performance
  // Note: Fixes SQL bug in AffiliateService.cc:1506 (queries affiliate_commissions + first_name/last_name)
  affiliate_performance: {
    endpoint: '/api/v1/reports/affiliate-performance',
    isSuggested: true,
    summary: [
      { key: 'activeAffiliates', label: 'Active Affiliates', value: 156, format: 'number', changePct: 12.0 },
      { key: 'referralConversions', label: 'Paid Conversions', value: 1294, format: 'number', changePct: 19.8 },
      { key: 'referredRevenueGhs', label: 'Referred Revenue', value: 78640.0, format: 'currency', changePct: 21.4 },
      { key: 'commissionsEarnedGhs', label: 'Commissions Earned', value: 11796.0, format: 'currency', changePct: 18.2 },
    ],
    charts: [
      {
        id: 'top_affiliates_bar',
        title: 'Top Affiliates by Referred Subscriptions',
        type: 'horizontal_bar',
        labels: ['Tech Review GH', 'Ama Influencer', 'Campus Hub Legon', 'Accra Business Digest', 'Ghana Diaspora UK'],
        series: [{ name: 'Conversions', data: [450, 380, 210, 150, 104] }],
      },
      {
        id: 'affiliate_traffic_sources',
        title: 'Referral Traffic Channels',
        type: 'donut',
        items: [
          { name: 'X / Social Links', value: 45 },
          { name: 'Blogs & Newsletters', value: 30 },
          { name: 'WhatsApp Channels', value: 15 },
          { name: 'YouTube Descriptions', value: 10 },
        ],
      },
    ],
    columns: [
      { key: 'affiliateName', label: 'Affiliate' },
      { key: 'referralCode', label: 'Referral Code' },
      { key: 'clicks', label: 'Link Clicks', align: 'right', format: 'number' },
      { key: 'conversions', label: 'Paid Signups', align: 'right', format: 'number' },
      { key: 'commissionGhs', label: 'Commission (GHS)', align: 'right', format: 'currency' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { affiliateName: 'Tech Review GH', referralCode: 'TECHGH', clicks: 4820, conversions: 450, commissionGhs: 5200.0, status: 'Active' },
      { affiliateName: 'Ama Influencer', referralCode: 'AMANEWS', clicks: 4190, conversions: 380, commissionGhs: 4100.0, status: 'Active' },
      { affiliateName: 'Campus Hub Legon', referralCode: 'LEGONHUB', clicks: 2680, conversions: 210, commissionGhs: 2800.0, status: 'Active' },
      { affiliateName: 'Accra Business Digest', referralCode: 'ACCRABIZ', clicks: 1540, conversions: 150, commissionGhs: 1900.0, status: 'Active' },
    ],
  },

  // 5.4 [SUGGESTED] Affiliate Payout & MoMo Reconciliation -> POST /api/v1/reports/affiliate-payout-reconciliation
  affiliate_payout_reconciliation: {
    endpoint: '/api/v1/reports/affiliate-payout-reconciliation',
    isSuggested: true,
    summary: [
      { key: 'settledPayoutsGhs', label: 'Disbursed Payouts', value: 40950.0, format: 'currency', changePct: 14.5 },
      { key: 'pendingPayoutsGhs', label: 'Pending Approval', value: 4250.0, format: 'currency', changePct: -5.0 },
      { key: 'withholdingTaxGhs', label: 'Withholding Tax Held', value: 3180.0, format: 'currency', changePct: 14.5 },
      { key: 'momoSuccessPct', label: 'MoMo Transfer Success', value: 99.1, format: 'percent', changePct: 0.4 },
    ],
    charts: [
      {
        id: 'payout_methods_donut',
        title: 'Disbursement Volume by Payout Rail (GHS)',
        type: 'donut',
        items: [
          { name: 'MTN MoMo', value: 26400 },
          { name: 'Ghana Bank EFT', value: 10850 },
          { name: 'Telecel Cash', value: 3700 },
        ],
      },
    ],
    columns: [
      { key: 'payoutRef', label: 'Payout Ref' },
      { key: 'affiliateName', label: 'Affiliate' },
      { key: 'rail', label: 'Payout Rail' },
      { key: 'grossAmount', label: 'Gross (GHS)', align: 'right', format: 'currency' },
      { key: 'netPaid', label: 'Net Paid (GHS)', align: 'right', format: 'currency' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { payoutRef: 'PO-AFF-2041', affiliateName: 'Tech Review GH', rail: 'MTN MoMo', grossAmount: 2600.0, netPaid: 2405.0, status: 'Settled' },
      { payoutRef: 'PO-AFF-2042', affiliateName: 'Ama Influencer', rail: 'GCB Bank EFT', grossAmount: 2100.0, netPaid: 1942.5, status: 'Settled' },
      { payoutRef: 'PO-AFF-2043', affiliateName: 'Campus Hub Legon', rail: 'MTN MoMo', grossAmount: 1450.0, netPaid: 1341.25, status: 'Pending' },
    ],
  },

  // 5.5 [SUGGESTED] Browser Push Notification Analytics -> POST /api/v1/reports/push-notification-analytics
  push_notification_analytics: {
    endpoint: '/api/v1/reports/push-notification-analytics',
    isSuggested: true,
    summary: [
      { key: 'subscribedBrowsers', label: 'Subscribed Browsers', value: 14820, format: 'number', changePct: 14.6 },
      { key: 'pushDelivered30d', label: 'Delivered Alerts (30d)', value: 129610, format: 'number', changePct: 22.1 },
      { key: 'avgPushCtrPct', label: 'Average Push CTR', value: 17.8, format: 'percent', changePct: 2.3 },
      { key: 'prunedStaleEndpoints', label: '410 Gone Pruned', value: 94, format: 'number', changePct: -8.0 },
    ],
    charts: [
      {
        id: 'push_ctr_by_topic',
        title: 'Click-Through Rate by Notification Topic (%)',
        type: 'horizontal_bar',
        labels: ['Breaking News', '05:30 Morning Edition', 'Business & Markets', 'Subscription Reminders', 'Daily Games'],
        series: [{ name: 'CTR %', data: [22.4, 19.1, 16.5, 14.2, 12.8] }],
      },
      {
        id: 'push_browser_split',
        title: 'Subscribed Endpoints by Browser',
        type: 'donut',
        items: [
          { name: 'Chrome (Android & Desktop)', value: 9480 },
          { name: 'Safari (iOS & macOS)', value: 3120 },
          { name: 'Microsoft Edge', value: 1490 },
          { name: 'Firefox', value: 730 },
        ],
      },
    ],
    columns: [
      { key: 'broadcastTitle', label: 'Broadcast Headline' },
      { key: 'topic', label: 'Topic' },
      { key: 'delivered', label: 'Delivered', align: 'right', format: 'number' },
      { key: 'clicked', label: 'Clicked', align: 'right', format: 'number' },
      { key: 'ctrPct', label: 'CTR %', align: 'right', format: 'percent' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { broadcastTitle: 'BREAKING: Bank of Ghana Holds Policy Rate Following MPC Review', topic: 'Breaking News', delivered: 14610, clicked: 3272, ctrPct: 22.4, status: 'Settled' },
      { broadcastTitle: 'Good Morning Ghana: Friday Daily Graphic Replica Live', topic: 'Morning Edition', delivered: 14580, clicked: 2784, ctrPct: 19.1, status: 'Settled' },
      { broadcastTitle: 'Graphic Business Weekly Market Outlook Ready', topic: 'Business', delivered: 9420, clicked: 1554, ctrPct: 16.5, status: 'Settled' },
    ],
  },
};
