import dayjs from 'dayjs';
import type {
  GeneratedReportResult,
  ReportDefinition,
  ReportGroupDefinition,
  ReportRequestDto,
} from '~/models/reports';
import {
  BASE_GRID,
  BASE_TOOLTIP,
  BOTTOM_LEGEND,
  DUAL_AXIS_GRID,
  GNP_PALETTE,
  areaGradient,
  barGradient,
  categoryXAxis,
  createSeededRng,
  fmtCompactGhs,
  fmtGhs,
  fmtInt,
  normalizeReportWindow,
  valueYAxis,
  type NormalizedReportWindow,
} from '~/utils/echartsHelpers';
import { GRAPHIC_PUBLICATIONS, MOCK_COMMERCIAL_PARTNERS } from '~/utils/reportsSchemaCatalog';

function makeMeta(
  def: ReportDefinition,
  group: ReportGroupDefinition,
  win: NormalizedReportWindow
): GeneratedReportResult['reportMeta'] {
  return {
    reportId: def.id,
    reportName: def.name,
    groupId: group.id,
    groupTitle: group.title,
    isSuggestedNew: Boolean(def.isSuggestedNew),
    generatedAt: new Date().toISOString(),
    currency: 'GHS',
    period: {
      startDate: win.startDate,
      endDate: win.endDate,
      totalDays: win.totalDays,
      granularity: win.granularity,
    },
    appliedFilters: win.appliedFilters,
  };
}

export function generatePart2Report(
  reportId: string,
  def: ReportDefinition,
  group: ReportGroupDefinition,
  dto: ReportRequestDto
): GeneratedReportResult | null {
  const win = normalizeReportWindow(reportId, dto);
  const rng = createSeededRng(win.seedKey);
  const labels = win.buckets.map((b) => b.label);
  const partnerFilter = MOCK_COMMERCIAL_PARTNERS.find((p) => p.id === dto.partnerId);

  switch (reportId) {
    // =========================================================================
    // 15. PARTNER SUB-ACCOUNT ENGAGEMENT
    // =========================================================================
    case 'partner_engagement': {
      const partners = partnerFilter ? [partnerFilter] : MOCK_COMMERCIAL_PARTNERS;
      const scale = partnerFilter ? 0.34 : 1;
      const readsSeries = win.buckets.map((b) => Math.round((1680 + rng() * 820) * b.daysInBucket * scale));
      const sessionsSeries = win.buckets.map((b) => Math.round((640 + rng() * 290) * b.daysInBucket * scale));
      const totalReads = readsSeries.reduce((a, b) => a + b, 0);

      const rows = partners.map((p, idx) => {
        const enrolled = p.subscriberQuota - p.remainingQuota;
        const activeReaders = Math.round(enrolled * (0.79 - idx * 0.04));
        const reads = Math.round(activeReaders * (14.2 - idx * 0.9));
        return {
          partnerName: p.name,
          accountType: p.accountType,
          enrolledSeats: enrolled,
          activeReaders30d: activeReaders,
          activationRate: Number(((activeReaders / Math.max(enrolled, 1)) * 100).toFixed(1)),
          publicationReads: reads,
          avgSessionDuration: `${8 + (idx % 4)}m ${12 + idx * 7}s`,
          topPublication: idx % 2 === 0 ? 'Daily Graphic' : 'Graphic Business',
        };
      });

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Commercial partner members logged ${fmtInt(totalReads)} verified publication reads across ` + '`publication_reads`' + ` with an average session duration of 8m 46s (` + '`user_sessions`' + `). Overall seat activation across enrolled B2B members stands at 74.6%, supporting strong annual contract renewal justification.`,
        kpis: [
          { key: 'b2b_reads', label: 'Partner Publication Reads', value: fmtInt(totalReads), rawValue: totalReads, changePercent: 19.2, changeDirection: 'up', positiveIsGood: true, subtitle: 'Verified in publication_reads', sparkline: readsSeries.slice(-12) },
          { key: 'b2b_sessions', label: 'Active Reader Sessions', value: fmtInt(sessionsSeries.reduce((a, b) => a + b, 0)), rawValue: sessionsSeries.reduce((a, b) => a + b, 0), changePercent: 14.8, changeDirection: 'up', positiveIsGood: true, subtitle: 'Avg 2.6 pages per session', sparkline: sessionsSeries.slice(-12) },
          { key: 'seat_act', label: 'Enrolled Seat Activation', value: '74.6%', rawValue: 74.6, changePercent: 3.9, changeDirection: 'up', positiveIsGood: true, subtitle: 'Active in last 30 days', sparkline: [68, 70, 71.5, 73, 74.6] },
          { key: 'b2b_dwell', label: 'Avg Session Duration', value: '8m 46s', rawValue: 526, changePercent: 9.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Morning 06:30–09:00 peak', sparkline: [460, 478, 495, 510, 526] },
        ],
        charts: [
          {
            id: 'partner-reads-trend',
            title: 'Partner Member Reads & Active Sessions Over Time',
            subtitle: 'Combines `publication_reads` and `user_sessions` activity',
            chartTypeBadge: 'Area + Line',
            span: 'two-thirds',
            height: 305,
            option: {
              color: ['#2563eb', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: valueYAxis('Count'),
              series: [
                { name: 'Publication Reads', type: 'line', smooth: true, areaStyle: { color: areaGradient('#2563eb') }, data: readsSeries },
                { name: 'Member Sessions', type: 'line', smooth: true, areaStyle: { color: areaGradient('#dc2626') }, data: sessionsSeries },
              ],
            },
          },
          {
            id: 'partner-top-pubs-bar',
            title: 'Partner Readership by Publication',
            subtitle: 'Share of partner reads across Graphic titles',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 305,
            option: {
              color: GNP_PALETTE,
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{d}%</b> ({c} reads)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'Daily Graphic', value: Math.round(totalReads * 0.44) },
                    { name: 'Graphic Business', value: Math.round(totalReads * 0.31) },
                    { name: 'Graphic Sports', value: Math.round(totalReads * 0.1) },
                    { name: 'The Mirror', value: Math.round(totalReads * 0.09) },
                    { name: 'Showbiz & Junior', value: Math.round(totalReads * 0.06) },
                  ],
                },
              ],
            },
          },
        ],
        tableTitle: 'Commercial Partner Sub-Account Engagement Matrix',
        columns: [
          { key: 'partnerName', label: 'Commercial Partner' },
          { key: 'accountType', label: 'Tier' },
          { key: 'enrolledSeats', label: 'Enrolled Seats', align: 'right', format: 'number' },
          { key: 'activeReaders30d', label: 'Active Readers', align: 'right', format: 'number' },
          { key: 'activationRate', label: 'Seat Activation', align: 'right', format: 'progress' },
          { key: 'publicationReads', label: 'Total Reads', align: 'right', format: 'number' },
          { key: 'avgSessionDuration', label: 'Avg Session', align: 'right' },
          { key: 'topPublication', label: 'Top Title' },
        ],
        rows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/partner-engagement',
          controllerMethod: 'ReportsController::generatePartnerEngagementReport',
          serviceMethod: 'CommercialPartnerService::getPartnerEngagementReport(partnerId, period)',
          cppDtoFields: ['partnerId', 'startDate', 'endDate'],
          existingTables: [
            { table: 'publication_reads', modelClass: 'drogon_model::Gnp::PublicationReads', usedColumns: ['partner_id', 'publication_id', 'user_id', 'read_at'] },
            { table: 'user_sessions', modelClass: 'drogon_model::Gnp::UserSessions', usedColumns: ['partner_id', 'user_id', 'session_start', 'duration_seconds'] },
            { table: 'commercial_partners', modelClass: 'drogon_model::Gnp::CommercialPartners', usedColumns: ['id', 'name', 'subscriber_quota', 'remaining_quota'] },
          ],
          schemaGaps: [],
          recommendedTables: [],
          sampleSqlQuery: `SELECT cp.id, cp.name, (cp.subscriber_quota - cp.remaining_quota) AS enrolled_seats,
       COUNT(DISTINCT pr.user_id) AS active_readers,
       COUNT(pr.id) AS publication_reads,
       COALESCE(ROUND(AVG(us.duration_seconds)), 0) AS avg_session_seconds
FROM public.commercial_partners cp
LEFT JOIN public.publication_reads pr ON pr.partner_id = cp.id AND pr.read_at BETWEEN $1 AND $2
LEFT JOIN public.user_sessions us ON us.partner_id = cp.id AND us.session_start BETWEEN $1 AND $2
GROUP BY cp.id ORDER BY publication_reads DESC;`,
        },
      };
    }

    // =========================================================================
    // 16. PARTNER QUOTA & USAGE
    // =========================================================================
    case 'partner_quota': {
      const partners = partnerFilter ? [partnerFilter] : MOCK_COMMERCIAL_PARTNERS;
      const rows = partners.map((p) => {
        const enrolled = p.subscriberQuota - p.remainingQuota;
        const utilPct = Number(((enrolled / Math.max(p.subscriberQuota, 1)) * 100).toFixed(1));
        return {
          partnerName: p.name,
          identifier: p.partnerIdentifier,
          planName: p.defaultSubscriptionPlanName,
          subscriberQuota: p.subscriberQuota,
          enrolledSeats: enrolled,
          remainingQuota: p.remainingQuota,
          utilizationPct: utilPct,
          subAccountEnabled: p.subAccountEnabled ? 'ENABLED' : 'MANUAL_INVOICE',
          status: utilPct >= 86 ? 'EXPANSION_READY' : 'HEALTHY',
        };
      });

      const totalQuota = rows.reduce((s, r) => s + r.subscriberQuota, 0);
      const totalEnrolled = rows.reduce((s, r) => s + r.enrolledSeats, 0);
      const overallUtil = Number(((totalEnrolled / Math.max(totalQuota, 1)) * 100).toFixed(1));

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Across ${rows.length} enterprise agreements totaling ${fmtInt(totalQuota)} contracted seats, ${fmtInt(totalEnrolled)} seats are actively provisioned (${overallUtil}% portfolio capacity utilization). MTN Ghana (86.3%) and Stanbic Bank (87.9%) are prime candidates for seat quota expansion amendments.`,
        kpis: [
          { key: 'total_quota', label: 'Total Contracted Quota', value: fmtInt(totalQuota), rawValue: totalQuota, changePercent: 16.7, changeDirection: 'up', positiveIsGood: true, subtitle: 'Licensed B2B seat pool', sparkline: [10500, 11800, 12500, 13400, totalQuota] },
          { key: 'enrolled_seats', label: 'Enrolled Partner Seats', value: fmtInt(totalEnrolled), rawValue: totalEnrolled, changePercent: 21.3, changeDirection: 'up', positiveIsGood: true, subtitle: `${fmtInt(totalQuota - totalEnrolled)} seats remaining`, sparkline: [8900, 9800, 10600, 11200, totalEnrolled] },
          { key: 'util_pct', label: 'Portfolio Utilization', value: `${overallUtil}%`, rawValue: overallUtil, changePercent: 4.1, changeDirection: 'up', positiveIsGood: true, subtitle: 'Target band: 75%–90%', sparkline: [76, 79, 81, 83, overallUtil] },
          { key: 'upsell_accts', label: 'Partners Above 85% Cap', value: '3 Partners', rawValue: 3, changePercent: 50.0, changeDirection: 'up', positiveIsGood: true, subtitle: 'MTN, GCB, Stanbic', sparkline: [1, 1, 2, 2, 3] },
        ],
        charts: [
          {
            id: 'partner-quota-stacked',
            title: 'Enrolled Seats vs Remaining Quota by Partner',
            subtitle: 'Direct view of `commercial_partners.subscriber_quota` & `remaining_quota`',
            chartTypeBadge: 'Stacked Bar',
            span: 'two-thirds',
            height: 310,
            option: {
              color: ['#dc2626', '#e2e8f0'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(rows.map((r) => r.identifier)),
              yAxis: valueYAxis('Seats'),
              series: [
                { name: 'Enrolled Members', type: 'bar', stack: 'q', barMaxWidth: 32, data: rows.map((r) => r.enrolledSeats) },
                { name: 'Remaining Quota', type: 'bar', stack: 'q', barMaxWidth: 32, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: rows.map((r) => r.remainingQuota) },
              ],
            },
          },
          {
            id: 'quota-gauge',
            title: 'Overall Seat Allocation Gauge',
            subtitle: 'Aggregate B2B seat pool fill rate',
            chartTypeBadge: 'Gauge Meter',
            span: 'third',
            height: 310,
            option: {
              tooltip: BASE_TOOLTIP,
              series: [
                {
                  type: 'gauge',
                  startAngle: 200,
                  endAngle: -20,
                  min: 0,
                  max: 100,
                  center: ['50%', '58%'],
                  radius: '88%',
                  progress: { show: true, width: 16, roundCap: true, itemStyle: { color: '#dc2626' } },
                  axisLine: { roundCap: true, lineStyle: { width: 16, color: [[1, '#f1f5f9']] } },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  axisLabel: { show: false },
                  pointer: { show: false },
                  title: { offsetCenter: [0, '24%'], fontSize: 12, color: '#64748b' },
                  detail: {
                    valueAnimation: true,
                    offsetCenter: [0, '-6%'],
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#0f172a',
                    formatter: '{value}%',
                  },
                  data: [{ value: overallUtil, name: 'Seats Provisioned' }],
                },
              ],
            },
          },
        ],
        tableTitle: 'Commercial Partner Quota & Subaccount Matrix (`public.commercial_partners`)',
        columns: [
          { key: 'partnerName', label: 'Partner Organization' },
          { key: 'planName', label: 'Assigned Plan' },
          { key: 'subscriberQuota', label: 'Total Quota', align: 'right', format: 'number' },
          { key: 'enrolledSeats', label: 'Enrolled', align: 'right', format: 'number' },
          { key: 'remainingQuota', label: 'Remaining', align: 'right', format: 'number' },
          { key: 'utilizationPct', label: 'Utilization', align: 'right', format: 'progress' },
          { key: 'subAccountEnabled', label: 'Billing Mode', align: 'center', format: 'badge' },
          { key: 'status', label: 'Capacity Signal', align: 'center', format: 'badge' },
        ],
        rows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/partner-quota',
          controllerMethod: 'ReportsController::generatePartnerQuotaReport',
          serviceMethod: 'ReportingService::getPartnerQuotaReport(const ReportDto &dto)',
          cppDtoFields: ['partnerId', 'status'],
          existingTables: [
            { table: 'commercial_partners', modelClass: 'drogon_model::Gnp::CommercialPartners', usedColumns: ['id', 'name', 'identifier', 'default_subscription_plan_description', 'subscriber_quota', 'remaining_quota', 'sub_account_enabled', 'status'] },
          ],
          schemaGaps: [],
          recommendedTables: [],
          sampleSqlQuery: `SELECT id, name, identifier, default_subscription_plan_description AS plan_name,
       subscriber_quota, (subscriber_quota - remaining_quota) AS enrolled_seats,
       remaining_quota, sub_account_enabled, status
FROM public.commercial_partners
ORDER BY (subscriber_quota - remaining_quota) DESC;`,
        },
      };
    }

    // =========================================================================
    // 17. PARTNER API USAGE STATS
    // =========================================================================
    case 'partner_api_usage': {
      const okCalls = win.buckets.map((b) => Math.round((4900 + rng() * 2100) * b.daysInBucket));
      const errCalls = win.buckets.map((b) => Math.round((42 + rng() * 38) * b.daysInBucket));
      const latencyP95 = win.buckets.map(() => Math.round(78 + rng() * 44));
      const totalCalls = okCalls.reduce((a, b) => a + b, 0) + errCalls.reduce((a, b) => a + b, 0);

      const endpointRows = [
        { endpoint: '/api/v1/partner-api/check-subscriber-status', method: 'GET', requests: Math.round(totalCalls * 0.56), successRate: 99.6, p50Ms: 31, p95Ms: 74, topPartner: 'MTN Ghana PLC' },
        { endpoint: '/api/v1/partner-api/retrieve-subscriber-details', method: 'GET', requests: Math.round(totalCalls * 0.24), successRate: 99.4, p50Ms: 42, p95Ms: 92, topPartner: 'GCB Bank PLC' },
        { endpoint: '/api/v1/partner-api/onboard-subscriber', method: 'POST', requests: Math.round(totalCalls * 0.14), successRate: 98.1, p50Ms: 68, p95Ms: 145, topPartner: 'MTN Ghana PLC' },
        { endpoint: '/api/v1/partners/bulk-upload-subscribers', method: 'POST', requests: Math.round(totalCalls * 0.04), successRate: 95.8, p50Ms: 184, p95Ms: 410, topPartner: 'GNAT' },
        { endpoint: '/api/v1/auth/verify-partner-otp', method: 'POST', requests: Math.round(totalCalls * 0.02), successRate: 97.9, p50Ms: 49, p95Ms: 112, topPartner: 'Stanbic Bank Ghana' },
      ];

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `External Partner B2B API handled ${fmtInt(totalCalls)} requests across ` + '`partner_api_request_logs`' + ` with 99.18% 2xx availability and 89 ms p95 Drogon coroutine response latency. Most non-2xx responses are HTTP 409 duplicate subscriber checks during telco batch syncs.`,
        kpis: [
          { key: 'api_calls', label: 'Total Partner API Calls', value: fmtInt(totalCalls), rawValue: totalCalls, changePercent: 24.6, changeDirection: 'up', positiveIsGood: true, subtitle: 'Logged in partner_api_request_logs', sparkline: okCalls.slice(-12) },
          { key: 'api_avail', label: '2xx Success Rate', value: '99.18%', rawValue: 99.18, changePercent: 0.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Exceeds 99.0% B2B SLA', sparkline: [98.7, 98.9, 99.0, 99.1, 99.18] },
          { key: 'p95_lat', label: 'p95 Response Latency', value: '89 ms', rawValue: 89, changePercent: -11.0, changeDirection: 'down', positiveIsGood: false, subtitle: 'Drogon async C++ engine', sparkline: latencyP95.slice(-12) },
          { key: 'err_4xx_5xx', label: '4xx / 5xx Responses', value: fmtInt(errCalls.reduce((a, b) => a + b, 0)), rawValue: errCalls.reduce((a, b) => a + b, 0), changePercent: -6.8, changeDirection: 'down', positiveIsGood: false, subtitle: 'Mostly 409 duplicate onboard', sparkline: errCalls.slice(-12), sparklineType: 'bar' },
        ],
        charts: [
          {
            id: 'partner-api-throughput-latency',
            title: 'Partner API Throughput vs p95 Latency (ms)',
            subtitle: 'Daily request volume alongside p95 `response_time_ms`',
            chartTypeBadge: 'Bar + Line Dual Axis',
            span: 'full',
            height: 300,
            option: {
              color: ['#2563eb', '#dc2626', '#059669'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: DUAL_AXIS_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: [valueYAxis('API Calls'), valueYAxis('Latency', '', 'ms')],
              series: [
                { name: '2xx Successful Calls', type: 'bar', stack: 'req', barMaxWidth: 20, data: okCalls },
                { name: '4xx / 5xx Errors', type: 'bar', stack: 'req', barMaxWidth: 20, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: errCalls },
                { name: 'p95 Latency (ms)', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 2.5 }, data: latencyP95 },
              ],
            },
          },
        ],
        tableTitle: 'B2B Partner API Endpoint Performance (`public.partner_api_request_logs`)',
        columns: [
          { key: 'endpoint', label: 'Endpoint Path', format: 'code' },
          { key: 'method', label: 'Method', align: 'center', format: 'badge' },
          { key: 'requests', label: 'Requests', align: 'right', format: 'number' },
          { key: 'p50Ms', label: 'p50 (ms)', align: 'right', format: 'number' },
          { key: 'p95Ms', label: 'p95 (ms)', align: 'right', format: 'number' },
          { key: 'successRate', label: 'Success Rate', align: 'right', format: 'progress' },
          { key: 'topPartner', label: 'Top Caller' },
        ],
        rows: endpointRows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/partner-api-usage',
          controllerMethod: 'ReportsController::generatePartnerApiUsageReport',
          serviceMethod: 'ReportingService::getPartnerApiUsageStats(const ReportDto &dto)',
          cppDtoFields: ['partnerId', 'startDate', 'endDate', 'status'],
          existingTables: [
            { table: 'partner_api_request_logs', modelClass: 'drogon_model::Gnp::PartnerApiRequestLogs', usedColumns: ['partner_id', 'api_key_id', 'endpoint', 'method', 'response_status_code', 'response_time_ms', 'is_successful', 'created_at'] },
          ],
          schemaGaps: [],
          recommendedTables: [],
          sampleSqlQuery: `SELECT endpoint, method, COUNT(*) AS requests,
       ROUND(100.0 * COUNT(*) FILTER (WHERE is_successful) / NULLIF(COUNT(*), 0), 2) AS success_rate,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_time_ms) AS p50_ms,
       PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) AS p95_ms
FROM public.partner_api_request_logs
WHERE created_at BETWEEN $1 AND $2 AND ($3 = '' OR partner_id::text = $3)
GROUP BY endpoint, method ORDER BY requests DESC;`,
        },
      };
    }

    // =========================================================================
    // 18. CAMPAIGN PERFORMANCE
    // =========================================================================
    case 'campaign_performance': {
      const campaigns = [
        { name: 'Morning Headlines 06:00 Digest', channel: 'email', audience: 'All Active Subscribers', reach: 18400, opened: 9940, clicks: 3120, conversions: 410, revenueGhs: 22550, status: 'ACTIVE' },
        { name: 'MoMo Pre-Expiry Renewal Reminder', channel: 'sms', audience: 'Expiring in 3 Days', reach: 6250, opened: 5980, clicks: 2190, conversions: 685, revenueGhs: 44525, status: 'ACTIVE' },
        { name: 'Breaking Budget Statement Alert', channel: 'push', audience: 'PWA Installed Readers', reach: 14900, opened: 7450, clicks: 4020, conversions: 295, revenueGhs: 14160, status: 'COMPLETED' },
        { name: 'Diaspora Annual Plan 20% Off', channel: 'email', audience: 'UK / US / EU Readers', reach: 7850, opened: 4160, clicks: 1490, conversions: 248, revenueGhs: 59520, status: 'ACTIVE' },
        { name: 'Graphic Business Tuesday Executive Brief', channel: 'email', audience: 'Corporate & Business Tier', reach: 9100, opened: 5640, clicks: 1980, conversions: 190, revenueGhs: 18050, status: 'ACTIVE' },
        { name: 'Weekend Mirror & Puzzles Push', channel: 'push', audience: 'Casual & Guest Buyers', reach: 11200, opened: 4920, clicks: 2150, conversions: 312, revenueGhs: 9360, status: 'COMPLETED' },
      ].filter((c) => !dto.channel || dto.channel === 'all' || c.channel === dto.channel);

      const totalReach = campaigns.reduce((s, c) => s + c.reach, 0);
      const totalOpened = campaigns.reduce((s, c) => s + c.opened, 0);
      const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
      const totalConv = campaigns.reduce((s, c) => s + c.conversions, 0);
      const totalRev = campaigns.reduce((s, c) => s + c.revenueGhs, 0);

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Omnichannel campaigns reached ${fmtInt(totalReach)} recipients, generating ${fmtInt(totalClicks)} clicks (${((totalClicks / Math.max(totalReach, 1)) * 100).toFixed(1)}% CTR) and ${fmtGhs(totalRev)} in attributed revenue across ${fmtInt(totalConv)} paid conversions. Hubtel SMS renewal reminders achieve an 11.0% direct payment conversion rate.`,
        kpis: [
          { key: 'camp_reach', label: 'Total Campaign Reach', value: fmtInt(totalReach), rawValue: totalReach, changePercent: 17.5, changeDirection: 'up', positiveIsGood: true, subtitle: 'Email + Hubtel SMS + PWA Push', sparkline: [52, 56, 60, 64, 67.7] },
          { key: 'camp_ctr', label: 'Blended Click-Through Rate', value: `${((totalClicks / Math.max(totalReach, 1)) * 100).toFixed(1)}%`, rawValue: (totalClicks / Math.max(totalReach, 1)) * 100, changePercent: 2.8, changeDirection: 'up', positiveIsGood: true, subtitle: `${fmtInt(totalClicks)} total clicks`, sparkline: [18.5, 19.4, 20.6, 21.3, 22.1] },
          { key: 'camp_conv', label: 'Paid Conversions', value: fmtInt(totalConv), rawValue: totalConv, changePercent: 24.1, changeDirection: 'up', positiveIsGood: true, subtitle: 'Direct checkout attribution', sparkline: [1480, 1690, 1820, 1990, totalConv] },
          { key: 'camp_rev', label: 'Attributed Campaign Revenue', value: fmtCompactGhs(totalRev), rawValue: totalRev, changePercent: 29.6, changeDirection: 'up', positiveIsGood: true, subtitle: '6.8x marketing spend ROI', sparkline: [115, 129, 144, 156, 168] },
        ],
        charts: [
          {
            id: 'campaign-funnel',
            title: 'Omnichannel Campaign Delivery-to-Revenue Funnel',
            subtitle: 'Tracks progression across `campaign_recipient_events`',
            chartTypeBadge: 'Funnel',
            span: 'half',
            height: 305,
            option: {
              color: ['#2563eb', '#0891b2', '#d97706', '#059669'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{c}</b>' },
              series: [
                {
                  type: 'funnel',
                  left: '10%',
                  top: 20,
                  bottom: 20,
                  width: '80%',
                  gap: 4,
                  label: { show: true, position: 'inside', color: '#fff', fontWeight: 600 },
                  data: [
                    { name: '1. Delivered Reach', value: totalReach },
                    { name: '2. Opened / Viewed', value: totalOpened },
                    { name: '3. Deep-Link Clicked', value: totalClicks },
                    { name: '4. Paid Conversion', value: totalConv },
                  ],
                },
              ],
            },
          },
          {
            id: 'campaign-roi-bar',
            title: 'Attributed Revenue by Campaign',
            subtitle: 'Compares GHS revenue unlocked per campaign',
            chartTypeBadge: 'Horizontal Bar',
            span: 'half',
            height: 305,
            option: {
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              grid: { top: 20, left: 16, right: 24, bottom: 24, containLabel: true },
              xAxis: valueYAxis('GHS', '₵'),
              yAxis: {
                type: 'category',
                inverse: true,
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: { fontSize: 11, color: '#334155' },
                data: campaigns.map((c) => c.name.slice(0, 26)),
              },
              series: [
                {
                  type: 'bar',
                  barMaxWidth: 20,
                  itemStyle: { color: barGradient('#dc2626', '#f97316'), borderRadius: [0, 6, 6, 0] },
                  data: campaigns.map((c) => c.revenueGhs),
                },
              ],
            },
          },
        ],
        tableTitle: 'Marketing Campaigns Performance Matrix (`campaigns` × `campaign_recipient_events`)',
        columns: [
          { key: 'name', label: 'Campaign Name' },
          { key: 'channel', label: 'Channel', align: 'center', format: 'badge' },
          { key: 'reach', label: 'Reach', align: 'right', format: 'number' },
          { key: 'opened', label: 'Opened', align: 'right', format: 'number' },
          { key: 'clicks', label: 'Clicks', align: 'right', format: 'number' },
          { key: 'conversions', label: 'Paid Orders', align: 'right', format: 'number' },
          { key: 'revenueGhs', label: 'Revenue (GHS)', align: 'right', format: 'currency' },
          { key: 'status', label: 'Status', align: 'center', format: 'badge' },
        ],
        rows: campaigns,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/campaign-performance',
          controllerMethod: 'ReportsController::generateCampaignPerformanceReport',
          serviceMethod: 'ReportingService::getCampaignPerformance(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'channel', 'status'],
          existingTables: [
            { table: 'campaigns', modelClass: 'drogon_model::Gnp::Campaigns', usedColumns: ['id', 'name', 'channel', 'target_audience', 'campaign_type', 'reach', 'clicks', 'status', 'scheduled_time'] },
          ],
          schemaGaps: [
            '`campaigns` only stores aggregate `reach` and `clicks`; add `public.campaign_recipient_events` for opens, bounces, unsubscribes, and payment attribution.',
          ],
          recommendedTables: [
            {
              table: 'public.campaign_recipient_events',
              changeType: 'new_table',
              summary: 'Per-recipient omnichannel delivery, open, click, and conversion revenue ledger.',
              keyColumns: ['campaign_id', 'channel', 'event_type', 'payment_id', 'attributed_revenue'],
              ddlSnippet: 'CREATE TABLE IF NOT EXISTS public.campaign_recipient_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), campaign_id UUID NOT NULL REFERENCES public.campaigns(id), channel VARCHAR(30) NOT NULL, event_type VARCHAR(30) NOT NULL, attributed_revenue NUMERIC(12,2) NOT NULL DEFAULT 0, occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW());',
            },
          ],
          sampleSqlQuery: `SELECT c.id, c.name, c.channel, c.status,
       COUNT(e.id) FILTER (WHERE e.event_type = 'delivered') AS reach,
       COUNT(e.id) FILTER (WHERE e.event_type = 'opened') AS opened,
       COUNT(e.id) FILTER (WHERE e.event_type = 'clicked') AS clicks,
       COUNT(e.id) FILTER (WHERE e.event_type = 'converted') AS conversions,
       COALESCE(SUM(e.attributed_revenue), 0) AS revenue_ghs
FROM public.campaigns c
LEFT JOIN public.campaign_recipient_events e ON e.campaign_id = c.id AND e.occurred_at BETWEEN $1 AND $2
GROUP BY c.id ORDER BY revenue_ghs DESC;`,
        },
      };
    }

    // =========================================================================
    // 19. COUPON USAGE & EFFECTIVENESS
    // =========================================================================
    case 'coupon_usage': {
      const coupons = [
        { code: 'DIASPORA20', description: '20% Off Annual All-Access', discountLabel: '20%', usageQuota: 500, usageCount: 418, discountGiven: 18810, netRevenueUnlocked: 75240, validTill: '2026-12-31', status: 'ACTIVE' },
        { code: 'CAMPUS50', description: '50% Student Verified Semester Pass', discountLabel: '50%', usageQuota: 1000, usageCount: 645, discountGiven: 19350, netRevenueUnlocked: 19350, validTill: '2026-11-30', status: 'ACTIVE' },
        { code: 'WELCOME15', description: 'First Subscription Welcome Offer', discountLabel: '15%', usageQuota: 2000, usageCount: 912, discountGiven: 8892, netRevenueUnlocked: 50388, validTill: '2026-12-31', status: 'ACTIVE' },
        { code: 'FOUNDERS25', description: 'Founders Day Special Promo', discountLabel: '25%', usageQuota: 400, usageCount: 400, discountGiven: 9500, netRevenueUnlocked: 28500, validTill: '2026-09-30', status: 'EXPIRED' },
        { code: 'VIPARCHIVE', description: '₵50 Flat Off Institutional Dossier', discountLabel: '₵50', usageQuota: 250, usageCount: 164, discountGiven: 8200, netRevenueUnlocked: 24600, validTill: '2026-12-15', status: 'ACTIVE' },
      ].map((c) => ({ ...c, quotaPct: Number(((c.usageCount / c.usageQuota) * 100).toFixed(1)) }));

      const totalDiscount = coupons.reduce((s, c) => s + c.discountGiven, 0);
      const totalUnlocked = coupons.reduce((s, c) => s + c.netRevenueUnlocked, 0);

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `${fmtInt(coupons.reduce((s, c) => s + c.usageCount, 0))} coupon redemptions granted ${fmtGhs(totalDiscount)} in promotional discounts while unlocking ${fmtGhs(totalUnlocked)} in net collected cash—a 3.06x net revenue multiplier per GHS discounted.`,
        kpis: [
          { key: 'redemptions', label: 'Total Redemptions', value: '2,539', rawValue: 2539, changePercent: 18.2, changeDirection: 'up', positiveIsGood: true, subtitle: 'Logged in coupon_usage', sparkline: [320, 410, 490, 560, 759] },
          { key: 'net_unlocked', label: 'Net Revenue Unlocked', value: fmtCompactGhs(totalUnlocked), rawValue: totalUnlocked, changePercent: 22.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Collected after discount', sparkline: [135, 152, 168, 184, 198] },
          { key: 'disc_cost', label: 'Promotional Discount Cost', value: fmtCompactGhs(totalDiscount), rawValue: totalDiscount, changePercent: 9.1, changeDirection: 'up', positiveIsGood: true, subtitle: '24.6% effective discount rate', sparkline: [48, 53, 57, 61, 64.7] },
          { key: 'roi_mult', label: 'Promo Revenue Multiplier', value: '3.06x', rawValue: 3.06, changePercent: 6.8, changeDirection: 'up', positiveIsGood: true, subtitle: 'Net cash / discount cost', sparkline: [2.6, 2.75, 2.88, 2.97, 3.06] },
        ],
        charts: [
          {
            id: 'coupon-roi-comparison',
            title: 'Net Revenue Unlocked vs Discount Cost by Promo Code',
            subtitle: 'Directly compares `payments.amount_paid` against `coupon_usage.discount_applied`',
            chartTypeBadge: 'Grouped Bar',
            span: 'full',
            height: 295,
            option: {
              color: ['#059669', '#f59e0b'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(coupons.map((c) => c.code)),
              yAxis: valueYAxis('GHS (₵)', '₵'),
              series: [
                { name: 'Net Cash Unlocked (GHS)', type: 'bar', barMaxWidth: 28, itemStyle: { borderRadius: [5, 5, 0, 0] }, data: coupons.map((c) => c.netRevenueUnlocked) },
                { name: 'Discount Foregone (GHS)', type: 'bar', barMaxWidth: 28, itemStyle: { borderRadius: [5, 5, 0, 0] }, data: coupons.map((c) => c.discountGiven) },
              ],
            },
          },
        ],
        tableTitle: 'Promotional Coupons Effectiveness (`coupons` × `coupon_usage`)',
        columns: [
          { key: 'code', label: 'Coupon Code', format: 'code' },
          { key: 'description', label: 'Offer Description' },
          { key: 'discountLabel', label: 'Discount', align: 'right' },
          { key: 'usageCount', label: 'Redeemed', align: 'right', format: 'number' },
          { key: 'usageQuota', label: 'Quota', align: 'right', format: 'number' },
          { key: 'quotaPct', label: 'Quota Burn', align: 'right', format: 'progress' },
          { key: 'discountGiven', label: 'Discount Cost', align: 'right', format: 'currency' },
          { key: 'netRevenueUnlocked', label: 'Net Cash (GHS)', align: 'right', format: 'currency' },
          { key: 'status', label: 'Status', align: 'center', format: 'badge' },
        ],
        rows: coupons,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/coupon-usage',
          controllerMethod: 'ReportsController::generateCouponUsageReport',
          serviceMethod: 'ReportingService::getCouponUsageEffectiveness(const ReportDto &dto)',
          cppDtoFields: ['status', 'startDate', 'endDate'],
          existingTables: [
            { table: 'coupons', modelClass: 'drogon_model::Gnp::Coupons', usedColumns: ['id', 'code', 'description', 'discount', 'discount_as_percentage', 'valid_till', 'usage_quota', 'usage_count', 'status'] },
            { table: 'coupon_usage', modelClass: 'drogon_model::Gnp::CouponUsage', usedColumns: ['coupon_id', 'payment_id', 'discount_applied', 'used_at'] },
            { table: 'payments', modelClass: 'drogon_model::Gnp::Payments', usedColumns: ['id', 'amount_paid'] },
          ],
          schemaGaps: [],
          recommendedTables: [],
          sampleSqlQuery: `SELECT c.code, c.description, c.usage_quota, COUNT(cu.id) AS usage_count,
       COALESCE(SUM(cu.discount_applied), 0) AS discount_given,
       COALESCE(SUM(p.amount_paid), 0) AS net_revenue_unlocked
FROM public.coupons c
LEFT JOIN public.coupon_usage cu ON cu.coupon_id = c.id AND cu.used_at BETWEEN $1 AND $2
LEFT JOIN public.payments p ON p.id = cu.payment_id AND p.status = 'SUCCESS'
GROUP BY c.id ORDER BY net_revenue_unlocked DESC;`,
        },
      };
    }

    // =========================================================================
    // 20. [NEW SUGGESTED] AFFILIATE PERFORMANCE & COMMISSIONS
    // =========================================================================
    case 'affiliate_performance': {
      const clicksSeries = win.buckets.map((b) => Math.round((1450 + rng() * 680) * b.daysInBucket));
      const commSeries = win.buckets.map((b) => Math.round((780 + rng() * 410) * b.daysInBucket));
      const totalClicks = clicksSeries.reduce((a, b) => a + b, 0);
      const totalComm = commSeries.reduce((a, b) => a + b, 0);

      const creators = [
        { affiliateCode: 'AFF-GH-014', name: 'Tech & Policy Digest GH', channel: 'X / Twitter', clicks: 12480, conversions: 492, convRate: 3.9, grossSalesGhs: 31980, commissionGhs: 4797, status: 'ACTIVE' },
        { affiliateCode: 'AFF-GH-029', name: 'Ama Mensah Media', channel: 'WhatsApp Channels', clicks: 9840, conversions: 418, convRate: 4.2, grossSalesGhs: 27170, commissionGhs: 4075, status: 'ACTIVE' },
        { affiliateCode: 'AFF-GH-041', name: 'Legon Law & Economics Club', channel: 'Direct / Telegram', clicks: 6720, conversions: 289, convRate: 4.3, grossSalesGhs: 18785, commissionGhs: 2817, status: 'ACTIVE' },
        { affiliateCode: 'AFF-UK-008', name: 'Accra-London Briefing', channel: 'Newsletter / Blog', clicks: 5490, conversions: 244, convRate: 4.4, grossSalesGhs: 23180, commissionGhs: 3477, status: 'ACTIVE' },
        { affiliateCode: 'AFF-GH-063', name: 'Kumasi Business Morning', channel: 'Facebook', clicks: 6150, conversions: 196, convRate: 3.2, grossSalesGhs: 12740, commissionGhs: 1911, status: 'ACTIVE' },
      ];

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `164 active affiliates drove ${fmtInt(totalClicks)} referral clicks and 1,639 paid subscriptions, unlocking ~${fmtGhs(totalComm * 6.67)} in gross subscription revenue at an effective 15.0% commission cost (${fmtGhs(totalComm)})—zero upfront customer acquisition spend.`,
        kpis: [
          { key: 'aff_clicks', label: 'Referral Link Clicks', value: fmtInt(totalClicks), rawValue: totalClicks, changePercent: 23.4, changeDirection: 'up', positiveIsGood: true, subtitle: '3.98% click-to-paid conversion', sparkline: clicksSeries.slice(-12) },
          { key: 'aff_comm', label: 'Commissions Earned', value: fmtCompactGhs(totalComm), rawValue: totalComm, changePercent: 19.8, changeDirection: 'up', positiveIsGood: true, subtitle: '15% default commission rate', sparkline: commSeries.slice(-12) },
          { key: 'aff_sales', label: 'Attributed Gross Sales', value: fmtCompactGhs(Math.round(totalComm * 6.67)), rawValue: Math.round(totalComm * 6.67), changePercent: 21.1, changeDirection: 'up', positiveIsGood: true, subtitle: '6.67x commission ROI', sparkline: commSeries.slice(-12).map((x) => Math.round(x * 6.67)) },
          { key: 'epc', label: 'Avg Earnings Per Click (EPC)', value: `₵${(totalComm / Math.max(totalClicks, 1)).toFixed(2)}`, rawValue: Number((totalComm / Math.max(totalClicks, 1)).toFixed(2)), changePercent: 5.2, changeDirection: 'up', positiveIsGood: true, subtitle: 'Strong creator unit economics', sparkline: [0.46, 0.49, 0.51, 0.53, 0.55] },
        ],
        charts: [
          {
            id: 'aff-clicks-comm-combo',
            title: 'Referral Clicks vs Commission Earnings Over Time',
            subtitle: 'Combines `affiliate_referral_clicks` volume with `affiliate_commissions`',
            chartTypeBadge: 'Bar + Smooth Line',
            span: 'two-thirds',
            height: 305,
            option: {
              color: ['#2563eb', '#059669'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: DUAL_AXIS_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: [valueYAxis('Clicks'), valueYAxis('Commissions (₵)', '₵')],
              series: [
                { name: 'Referral Clicks', type: 'bar', barMaxWidth: 18, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: clicksSeries },
                { name: 'Commissions (GHS)', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 3 }, data: commSeries },
              ],
            },
          },
          {
            id: 'aff-traffic-channels',
            title: 'Affiliate Traffic by Channel',
            subtitle: 'Social & messaging referral sources',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 305,
            option: {
              color: GNP_PALETTE,
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{d}%</b> ({c} clicks)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'X / Twitter', value: Math.round(totalClicks * 0.36) },
                    { name: 'WhatsApp Channels', value: Math.round(totalClicks * 0.28) },
                    { name: 'Facebook', value: Math.round(totalClicks * 0.16) },
                    { name: 'Blogs / Newsletters', value: Math.round(totalClicks * 0.12) },
                    { name: 'Instagram & Other', value: Math.round(totalClicks * 0.08) },
                  ],
                },
              ],
            },
          },
        ],
        tableTitle: 'Top Performing Affiliates Leaderboard',
        columns: [
          { key: 'affiliateCode', label: 'Code', format: 'code' },
          { key: 'name', label: 'Affiliate / Creator' },
          { key: 'channel', label: 'Primary Channel' },
          { key: 'clicks', label: 'Clicks', align: 'right', format: 'number' },
          { key: 'conversions', label: 'Paid Subs', align: 'right', format: 'number' },
          { key: 'convRate', label: 'Conv %', align: 'right', format: 'percent' },
          { key: 'grossSalesGhs', label: 'Gross Sales', align: 'right', format: 'currency' },
          { key: 'commissionGhs', label: 'Commission', align: 'right', format: 'currency' },
          { key: 'status', label: 'Status', align: 'center', format: 'badge' },
        ],
        rows: creators,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/affiliate-performance',
          controllerMethod: 'ReportsController::generateAffiliatePerformanceReport',
          serviceMethod: 'ReportingService::getAffiliatePerformance(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'affiliateId', 'status'],
          existingTables: [
            { table: 'affiliates', modelClass: 'drogon_model::Gnp::Affiliates', usedColumns: ['id', 'affiliate_id', 'first_name', 'last_name', 'status', 'total_earnings', 'wallet_balance'] },
            { table: 'affiliate_commissions', modelClass: 'drogon_model::Gnp::AffiliateCommissions', usedColumns: ['affiliate_id', 'amount', 'order_id', 'status', 'created_at'] },
          ],
          schemaGaps: [
            'Requires `public.affiliate_referral_clicks` table—currently `gnp-api` has no table tracking link clicks, visitors, traffic sources, or devices.',
          ],
          recommendedTables: [
            {
              table: 'public.affiliate_referral_clicks',
              changeType: 'new_table',
              summary: 'Tracks referral link hits, unique visitor hashes, social sources, devices, and conversions.',
              keyColumns: ['affiliate_id', 'visitor_hash', 'traffic_source', 'device_type', 'converted', 'clicked_at'],
              ddlSnippet: 'CREATE TABLE IF NOT EXISTS public.affiliate_referral_clicks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), affiliate_id UUID NOT NULL REFERENCES public.affiliates(id), visitor_hash CHAR(64) NOT NULL, traffic_source VARCHAR(50) NOT NULL, device_type VARCHAR(20) NOT NULL, converted BOOLEAN NOT NULL DEFAULT FALSE, clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW());',
            },
          ],
          sampleSqlQuery: `SELECT a.affiliate_id, a.first_name || ' ' || a.last_name AS name,
       COUNT(c.id) AS clicks,
       COUNT(DISTINCT ac.id) AS conversions,
       COALESCE(SUM(ac.amount), 0) AS commission_ghs
FROM public.affiliates a
LEFT JOIN public.affiliate_referral_clicks c ON c.affiliate_id = a.id AND c.clicked_at BETWEEN $1 AND $2
LEFT JOIN public.affiliate_commissions ac ON ac.affiliate_id = a.id AND ac.created_at BETWEEN $1 AND $2
GROUP BY a.id ORDER BY commission_ghs DESC;`,
        },
      };
    }

    // =========================================================================
    // 21. [NEW SUGGESTED] AFFILIATE PAYOUTS & WALLET LIABILITY
    // =========================================================================
    case 'affiliate_payout_reconciliation': {
      const payouts = [
        { payoutDate: '2026-10-18', affiliateName: 'Tech & Policy Digest GH', accountProvider: 'MTN MoMo', accountType: 'Mobile Money', totalAmount: 4250, status: 'PAID' },
        { payoutDate: '2026-10-18', affiliateName: 'Ama Mensah Media', accountProvider: 'MTN MoMo', accountType: 'Mobile Money', totalAmount: 3680, status: 'PAID' },
        { payoutDate: '2026-10-20', affiliateName: 'Accra-London Briefing', accountProvider: 'Stanbic Bank', accountType: 'Bank Transfer', totalAmount: 3120, status: 'PROCESSING' },
        { payoutDate: '2026-10-21', affiliateName: 'Legon Law & Economics Club', accountProvider: 'Telecel Cash', accountType: 'Mobile Money', totalAmount: 2490, status: 'PENDING' },
        { payoutDate: '2026-10-21', affiliateName: 'Kumasi Business Morning', accountProvider: 'GCB Bank', accountType: 'Bank Transfer', totalAmount: 1760, status: 'PAID' },
      ];

      const paidSeries = win.buckets.map((b) => Math.round((620 + rng() * 340) * b.daysInBucket));
      const liabilitySeries = win.buckets.map((_, i) => Math.round(14800 - (i % 4) * 1400 + rng() * 900));

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Disbursed ${fmtGhs(paidSeries.reduce((a, b) => a + b, 0))} across bulk and individual payouts (` + '`affiliate_payouts`' + `), while current unpaid wallet liability across active affiliates (` + '`affiliates.wallet_balance`' + `) stands at ₵12,840.00 across 19 eligible accounts above minimum threshold.`,
        kpis: [
          { key: 'paid_out', label: 'Total Payouts Disbursed', value: fmtCompactGhs(paidSeries.reduce((a, b) => a + b, 0)), rawValue: paidSeries.reduce((a, b) => a + b, 0), changePercent: 16.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Settled to MoMo & Bank', sparkline: paidSeries.slice(-12) },
          { key: 'wallet_liab', label: 'Unpaid Wallet Liability', value: '₵12,840.00', rawValue: 12840, changePercent: -9.2, changeDirection: 'down', positiveIsGood: true, subtitle: 'Sum of affiliates.wallet_balance', sparkline: liabilitySeries.slice(-12) },
          { key: 'bulk_eligible', label: 'Eligible for Bulk Payout', value: '19 Affiliates', rawValue: 19, changePercent: 5.5, changeDirection: 'up', positiveIsGood: true, subtitle: 'Balance >= min threshold', sparkline: [14, 16, 17, 18, 19] },
          { key: 'momo_payout_share', label: 'Instant MoMo Payout Share', value: '71.4%', rawValue: 71.4, changePercent: 6.2, changeDirection: 'up', positiveIsGood: true, subtitle: 'MTN MoMo + Telecel Cash', sparkline: [64, 66, 68, 70, 71.4] },
        ],
        charts: [
          {
            id: 'payouts-vs-liability',
            title: 'Disbursed Payouts vs Accrued Unpaid Wallet Liability',
            subtitle: 'Reconciles `affiliate_payouts.total_amount` with `affiliates.wallet_balance`',
            chartTypeBadge: 'Bar + Line',
            span: 'two-thirds',
            height: 295,
            option: {
              color: ['#059669', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: DUAL_AXIS_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: [valueYAxis('Paid Out (₵)', '₵'), valueYAxis('Liability (₵)', '₵')],
              series: [
                { name: 'Disbursed Payouts', type: 'bar', barMaxWidth: 20, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: paidSeries },
                { name: 'Wallet Liability', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 2.5 }, data: liabilitySeries },
              ],
            },
          },
          {
            id: 'payout-provider-donut',
            title: 'Settlement Rail Distribution',
            subtitle: 'By `affiliate_payouts.account_provider`',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 295,
            option: {
              color: ['#eab308', '#dc2626', '#2563eb', '#059669'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>₵{c}</b> ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'MTN Mobile Money', value: 14800 },
                    { name: 'Telecel Cash', value: 4900 },
                    { name: 'Stanbic / Ecobank', value: 5100 },
                    { name: 'GCB Bank Transfer', value: 2800 },
                  ],
                },
              ],
            },
          },
        ],
        tableTitle: 'Affiliate Disbursement & Liability Ledger (`public.affiliate_payouts`)',
        columns: [
          { key: 'payoutDate', label: 'Date', format: 'date' },
          { key: 'affiliateName', label: 'Affiliate' },
          { key: 'accountType', label: 'Rail' },
          { key: 'accountProvider', label: 'Provider' },
          { key: 'totalAmount', label: 'Amount (GHS)', align: 'right', format: 'currency' },
          { key: 'status', label: 'Settlement Status', align: 'center', format: 'badge' },
        ],
        rows: payouts,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/affiliate-payouts',
          controllerMethod: 'ReportsController::generateAffiliatePayoutsReport',
          serviceMethod: 'ReportingService::getAffiliatePayoutReconciliation(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'status'],
          existingTables: [
            { table: 'affiliate_payouts', modelClass: 'drogon_model::Gnp::AffiliatePayouts', usedColumns: ['id', 'affiliate_id', 'affiliate_name', 'total_amount', 'account_type', 'account_provider', 'status', 'created_at'] },
            { table: 'affiliates', modelClass: 'drogon_model::Gnp::Affiliates', usedColumns: ['wallet_balance', 'total_earnings'] },
            { table: 'affiliate_program_settings', modelClass: 'drogon_model::Gnp::AffiliateProgramSettings', usedColumns: ['minimum_payout_amount', 'default_commission_rate'] },
          ],
          schemaGaps: [],
          recommendedTables: [],
          sampleSqlQuery: `SELECT ap.id, ap.affiliate_name, ap.account_type, ap.account_provider, ap.total_amount, ap.status, ap.created_at
FROM public.affiliate_payouts ap
WHERE ap.created_at BETWEEN $1 AND $2 ORDER BY ap.created_at DESC;`,
        },
      };
    }

    // =========================================================================
    // 22. [NEW SUGGESTED] NEWSROOM GAMES & HABIT RETENTION IMPACT
    // =========================================================================
    case 'games_engagement_retention': {
      const gameRows = [
        { gameTitle: 'Newsroom Crossword', sourceCorpus: 'Daily Graphic & Business Headlines', sessionsStarted: 18420, completed: 14920, completionPct: 81.0, avgDurationSec: 342, subscriberRenewalRate: 95.4 },
        { gameTitle: 'Letter Sudoku', sourceCorpus: '9-Letter Edition Theme Words', sessionsStarted: 22150, completed: 17280, completionPct: 78.0, avgDurationSec: 418, subscriberRenewalRate: 94.8 },
        { gameTitle: 'Edition Word Search', sourceCorpus: 'Graphic Showbiz & Sports Corpus', sessionsStarted: 16890, completed: 14860, completionPct: 88.0, avgDurationSec: 215, subscriberRenewalRate: 93.2 },
        { gameTitle: 'Newsroom Riddles & Anagrams', sourceCorpus: 'The Mirror Cloze Sentences', sessionsStarted: 12340, completed: 10365, completionPct: 84.0, avgDurationSec: 184, subscriberRenewalRate: 93.9 },
        { gameTitle: 'Daily Challenge (200 Bonus Pts)', sourceCorpus: 'Today’s Morning Edition', sessionsStarted: 24600, completed: 21400, completionPct: 87.0, avgDurationSec: 295, subscriberRenewalRate: 96.8 },
      ];

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Subscribers who play at least 2 Newsroom Games weekly exhibit a 95.2% monthly subscription renewal rate vs 84.1% among non-players (+11.1 percentage point retention lift!). Daily Challenges (` + '`daily_challenge_completions`' + `) drive 21,400 completed habit sessions with a median 9-day streak.`,
        kpis: [
          { key: 'game_sessions', label: 'Completed Puzzle Sessions', value: '78,825', rawValue: 78825, changePercent: 34.2, changeDirection: 'up', positiveIsGood: true, subtitle: '83.5% session completion rate', sparkline: [11200, 13400, 15100, 18200, 20925] },
          { key: 'retention_lift', label: 'Subscriber Renewal Lift', value: '+11.1 pts', rawValue: 11.1, changePercent: 2.3, changeDirection: 'up', positiveIsGood: true, subtitle: '95.2% players vs 84.1% non-players', sparkline: [8.4, 9.1, 9.8, 10.5, 11.1] },
          { key: 'daily_streaks', label: 'Readers on 7+ Day Streak', value: '3,480', rawValue: 3480, changePercent: 28.9, changeDirection: 'up', positiveIsGood: true, subtitle: 'Tracked in user_game_stats', sparkline: [1900, 2300, 2750, 3120, 3480] },
          { key: 'multiplayer', label: 'Multiplayer Rivalry Matches', value: '4,910', rawValue: 4910, changePercent: 44.0, changeDirection: 'up', positiveIsGood: true, subtitle: 'Organic peer referrals', sparkline: [2100, 2700, 3400, 4150, 4910] },
        ],
        charts: [
          {
            id: 'games-volume-bar',
            title: 'Started vs Completed Sessions by Puzzle Type',
            subtitle: 'Built directly from published newspaper corpus (`game_sessions`)',
            chartTypeBadge: 'Grouped Bar',
            span: 'two-thirds',
            height: 305,
            option: {
              color: ['#94a3b8', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(['Crossword', 'Sudoku', 'Word Search', 'Riddles', 'Daily Challenge']),
              yAxis: valueYAxis('Sessions'),
              series: [
                { name: 'Sessions Started', type: 'bar', barMaxWidth: 24, data: gameRows.map((g) => g.sessionsStarted) },
                { name: 'Completed', type: 'bar', barMaxWidth: 24, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: gameRows.map((g) => g.completed) },
              ],
            },
          },
          {
            id: 'games-retention-impact',
            title: '30-Day Renewal Rate by Weekly Game Habit',
            subtitle: 'Proves causal link between daily puzzle habit & low churn',
            chartTypeBadge: 'Retention Bar',
            span: 'third',
            height: 305,
            option: {
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              grid: BASE_GRID,
              xAxis: categoryXAxis(['0 Games', '1–2 / wk', '3–5 / wk', 'Daily Streak']),
              yAxis: { ...valueYAxis('Renewal %', '', '%'), min: 75, max: 100 },
              series: [
                {
                  type: 'bar',
                  barMaxWidth: 30,
                  itemStyle: { color: barGradient('#059669', '#10b981'), borderRadius: [6, 6, 0, 0] },
                  data: [84.1, 91.4, 95.2, 97.6],
                },
              ],
            },
          },
        ],
        tableTitle: 'Newsroom Games Engagement & Subscriber Retention Table',
        columns: [
          { key: 'gameTitle', label: 'Puzzle Mode' },
          { key: 'sourceCorpus', label: 'Newspaper Corpus Source' },
          { key: 'sessionsStarted', label: 'Started', align: 'right', format: 'number' },
          { key: 'completed', label: 'Completed', align: 'right', format: 'number' },
          { key: 'completionPct', label: 'Completion', align: 'right', format: 'progress' },
          { key: 'avgDurationSec', label: 'Avg Time (s)', align: 'right', format: 'number' },
          { key: 'subscriberRenewalRate', label: 'Player Renewal %', align: 'right', format: 'percent' },
        ],
        rows: gameRows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/games-engagement',
          controllerMethod: 'ReportsController::generateGamesEngagementReport',
          serviceMethod: 'ReportingService::getGamesEngagementAndRetention(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'gameType'],
          existingTables: [
            { table: 'game_sessions', modelClass: 'drogon_model::Gnp::GameSessions', usedColumns: ['user_id', 'game_type', 'is_multiplayer', 'is_complete', 'total_points_earned', 'completion_time_seconds', 'start_time'] },
            { table: 'daily_challenge_completions', modelClass: 'drogon_model::Gnp::DailyChallengeCompletions', usedColumns: ['user_id', 'challenge_id', 'completed_at', 'bonus_earned'] },
            { table: 'user_game_stats', modelClass: 'drogon_model::Gnp::UserGameStats', usedColumns: ['user_id', 'games_played', 'current_streak', 'longest_streak'] },
            { table: 'user_subscriptions', modelClass: 'drogon_model::Gnp::UserSubscriptions', usedColumns: ['user_id', 'is_active'] },
          ],
          schemaGaps: [],
          recommendedTables: [],
          sampleSqlQuery: `SELECT gs.game_type, COUNT(gs.id) AS sessions_started,
       COUNT(gs.id) FILTER (WHERE gs.is_complete) AS completed,
       ROUND(AVG(gs.completion_time_seconds)) AS avg_duration_sec,
       ROUND(100.0 * COUNT(DISTINCT us.user_id) FILTER (WHERE us.is_active) / NULLIF(COUNT(DISTINCT gs.user_id), 0), 1) AS active_sub_pct
FROM public.game_sessions gs
LEFT JOIN public.user_subscriptions us ON us.user_id = gs.user_id
WHERE gs.start_time BETWEEN $1 AND $2
GROUP BY gs.game_type;`,
        },
      };
    }

    // =========================================================================
    // 23. ADMIN ROLES & ACCESS AUDIT
    // =========================================================================
    case 'admin_roles': {
      const roleRows = [
        { roleName: 'Super Administrator', groupName: 'Executive & Platform Engineering', assignedAdmins: 3, wildcardAccess: 'YES (*)', permissionsCount: 42, twoFactorEnforced: '100% Passkey + 2FA', status: 'COMPLIANT' },
        { roleName: 'Editorial & Pre-Press Manager', groupName: 'Newsroom Operations', assignedAdmins: 9, wildcardAccess: 'Scoped', permissionsCount: 14, twoFactorEnforced: '100% 2FA', status: 'COMPLIANT' },
        { roleName: 'Finance & Partner Billing Officer', groupName: 'Accounts & Revenue', assignedAdmins: 5, wildcardAccess: 'Scoped', permissionsCount: 11, twoFactorEnforced: '100% Passkey + 2FA', status: 'COMPLIANT' },
        { roleName: 'Archive & RAG Curator', groupName: 'Library & Research Unit', assignedAdmins: 4, wildcardAccess: 'Scoped', permissionsCount: 9, twoFactorEnforced: '75% 2FA (1 Pending)', status: 'REVIEW_DUE' },
        { roleName: 'Marketing & Affiliate Coordinator', groupName: 'Growth & Campaigns', assignedAdmins: 6, wildcardAccess: 'Scoped', permissionsCount: 10, twoFactorEnforced: '100% 2FA', status: 'COMPLIANT' },
        { roleName: 'Customer Support Agent', groupName: 'Subscriber Helpdesk', assignedAdmins: 8, wildcardAccess: 'Scoped', permissionsCount: 7, twoFactorEnforced: '100% 2FA', status: 'COMPLIANT' },
      ];

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `35 back-office staff accounts (` + '`users.is_admin_user = true`' + `) are governed across 6 RBAC roles (` + '`roles`' + `) and 6 ` + '`user_groups`' + `. Wildcard ` + '`*`' + ` super-admin privileges are tightly restricted to 3 principal accounts (8.6%), with 97.1% 2FA/Passkey enforcement.`,
        kpis: [
          { key: 'admin_total', label: 'Active Admin Accounts', value: '35', rawValue: 35, changePercent: 2.9, changeDirection: 'up', positiveIsGood: true, subtitle: '2 blocked inactive staff', sparkline: [32, 33, 34, 34, 35] },
          { key: 'super_admins', label: 'Wildcard (*) Super-Admins', value: '3 Accounts', rawValue: 3, changePercent: 0, changeDirection: 'flat', positiveIsGood: true, subtitle: 'Least-privilege compliant', sparkline: [3, 3, 3, 3, 3] },
          { key: 'mfa_rate', label: 'Admin 2FA / Passkey Rate', value: '97.1%', rawValue: 97.1, changePercent: 5.8, changeDirection: 'up', positiveIsGood: true, subtitle: '34 of 35 MFA enrolled', sparkline: [88, 91, 94, 97.1] },
          { key: 'pending_inv', label: 'Pending Staff Invitations', value: '2', rawValue: 2, changePercent: -50, changeDirection: 'down', positiveIsGood: true, subtitle: 'admin_user_invitations', sparkline: [5, 4, 3, 2] },
        ],
        charts: [
          {
            id: 'admin-roles-bar',
            title: 'Admin Staff Headcount & Permission Scope Width by Role',
            subtitle: 'Compares assigned staff count against granted permission scope count (`roles.permissions`)',
            chartTypeBadge: 'Grouped Bar',
            span: 'full',
            height: 295,
            option: {
              color: ['#2563eb', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(roleRows.map((r) => r.roleName.split(' ')[0] + ' ' + (r.roleName.split(' ')[1] || ''))),
              yAxis: valueYAxis('Count'),
              series: [
                { name: 'Assigned Admin Staff', type: 'bar', barMaxWidth: 26, data: roleRows.map((r) => r.assignedAdmins) },
                { name: 'Granted Permissions Count', type: 'bar', barMaxWidth: 26, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: roleRows.map((r) => r.permissionsCount) },
              ],
            },
          },
        ],
        tableTitle: 'RBAC Roles, User Groups & Privilege Matrix (`roles` × `user_groups` × `users`)',
        columns: [
          { key: 'roleName', label: 'Role Name' },
          { key: 'groupName', label: 'User Group' },
          { key: 'assignedAdmins', label: 'Admins', align: 'right', format: 'number' },
          { key: 'permissionsCount', label: 'Scopes', align: 'right', format: 'number' },
          { key: 'wildcardAccess', label: 'Wildcard *' },
          { key: 'twoFactorEnforced', label: 'MFA / Passkey Posture' },
          { key: 'status', label: 'Compliance', align: 'center', format: 'badge' },
        ],
        rows: roleRows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/admin-roles-audit',
          controllerMethod: 'ReportsController::generateAdminRolesReport',
          serviceMethod: 'ReportingService::getAdminRolesAudit(const ReportDto &dto)',
          cppDtoFields: ['status'],
          existingTables: [
            { table: 'roles', modelClass: 'drogon_model::Gnp::Roles', usedColumns: ['id', 'name', 'description', 'permissions'] },
            { table: 'user_groups', modelClass: 'drogon_model::Gnp::UserGroups', usedColumns: ['id', 'title', 'roles', 'active_users', 'blocked_users'] },
            { table: 'users', modelClass: 'drogon_model::Gnp::Users', usedColumns: ['id', 'email', 'is_admin_user', 'is_active', 'credential_id', 'roles', 'user_groups'] },
            { table: 'admin_user_invitations', modelClass: 'drogon_model::Gnp::AdminUserInvitations', usedColumns: ['email', 'status', 'expires_at'] },
          ],
          schemaGaps: [],
          recommendedTables: [],
          sampleSqlQuery: `SELECT r.id, r.name, jsonb_array_length(r.permissions) AS permissions_count,
       COUNT(u.id) FILTER (WHERE u.is_admin_user AND u.is_active) AS assigned_admins
FROM public.roles r
LEFT JOIN public.users u ON u.roles @> to_jsonb(r.id::text)
WHERE r.partner_id IS NULL GROUP BY r.id;`,
        },
      };
    }

    // =========================================================================
    // 24. PARTNER API KEY AUDIT
    // =========================================================================
    case 'api_key_audit': {
      const keys = [
        { clientId: 'gnp_live_mtn_991a', partnerName: 'MTN Ghana PLC', label: 'Prod Telco Bundle Provisioner', scopesCount: 5, ipAllowlist: '3 CIDR blocks', calls30d: 89420, lastUsedAt: '2026-10-22 08:41', expiresAt: '2027-04-01', status: 'ACTIVE' },
        { clientId: 'gnp_live_gcb_442c', partnerName: 'GCB Bank PLC', label: 'HR Intranet SSO & Seat Sync', scopesCount: 3, ipAllowlist: '2 CIDR blocks', calls30d: 31280, lastUsedAt: '2026-10-22 07:55', expiresAt: '2026-11-02', status: 'EXPIRING_SOON' },
        { clientId: 'gnp_live_gnat_108f', partnerName: 'GNAT', label: 'Member Portal Verification', scopesCount: 2, ipAllowlist: 'Unrestricted (0.0.0.0/0)', calls30d: 14650, lastUsedAt: '2026-10-21 19:12', expiresAt: '2027-01-19', status: 'OPEN_IP_WARN' },
        { clientId: 'gnp_live_stbg_774d', partnerName: 'Stanbic Bank Ghana', label: 'Wealth App Entitlement Check', scopesCount: 3, ipAllowlist: '2 CIDR blocks', calls30d: 18910, lastUsedAt: '2026-10-22 08:19', expiresAt: '2027-02-08', status: 'ACTIVE' },
        { clientId: 'gnp_live_ug_310e', partnerName: 'University of Ghana', label: 'Balme Library EZProxy Key', scopesCount: 2, ipAllowlist: 'Campus /16 CIDR', calls30d: 9420, lastUsedAt: '2026-10-22 06:30', expiresAt: '2027-03-02', status: 'ACTIVE' },
        { clientId: 'gnp_old_mtn_002b', partnerName: 'MTN Ghana PLC', label: 'Legacy Staging Key (Rotated)', scopesCount: 4, ipAllowlist: '1 CIDR block', calls30d: 0, lastUsedAt: '2026-08-14 11:05', expiresAt: '2026-09-15', status: 'REVOKED' },
      ];

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Audited 14 registered B2B API keys across ` + '`commercial_partner_api_keys`' + `: 10 active compliant, 1 expiring within 11 days (GCB Bank PLC — rotation reminder queued), 1 active key missing IP CIDR restriction (GNAT), and 2 revoked legacy credentials.`,
        kpis: [
          { key: 'active_keys', label: 'Active Production Keys', value: '11 Keys', rawValue: 11, changePercent: 10.0, changeDirection: 'up', positiveIsGood: true, subtitle: 'SHA-256 hashed secrets', sparkline: [8, 9, 10, 11, 11] },
          { key: 'expiring_keys', label: 'Expiring Within 14 Days', value: '1 Key', rawValue: 1, changePercent: 0, changeDirection: 'flat', positiveIsGood: false, subtitle: 'GCB Bank rotation scheduled', sparkline: [2, 1, 1, 1] },
          { key: 'open_ip', label: 'Keys Without IP Allowlist', value: '1 Key', rawValue: 1, changePercent: -50, changeDirection: 'down', positiveIsGood: false, subtitle: '91% CIDR restricted', sparkline: [3, 2, 2, 1] },
          { key: 'revoked_keys', label: 'Revoked / Expired Keys', value: '3 Keys', rawValue: 3, changePercent: 50, changeDirection: 'up', positiveIsGood: true, subtitle: 'Zero unauthorized hits', sparkline: [1, 2, 2, 3] },
        ],
        charts: [
          {
            id: 'apikey-health-donut',
            title: 'API Key Security Posture Breakdown',
            subtitle: 'Classification across rotation, CIDR restriction, and activity',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 295,
            option: {
              color: ['#059669', '#f59e0b', '#dc2626', '#64748b'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{c} keys</b> ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'Compliant Active', value: 9 },
                    { name: 'Expiring < 14d', value: 1 },
                    { name: 'Missing CIDR Allowlist', value: 1 },
                    { name: 'Revoked / Rotated', value: 3 },
                  ],
                },
              ],
            },
          },
          {
            id: 'apikey-volume-bar',
            title: '30-Day Request Volume per Client Key',
            subtitle: 'Identifies high-traffic production keys vs dormant credentials',
            chartTypeBadge: 'Horizontal Bar',
            span: 'two-thirds',
            height: 295,
            option: {
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              grid: { top: 20, left: 16, right: 24, bottom: 24, containLabel: true },
              xAxis: valueYAxis('API Calls'),
              yAxis: {
                type: 'category',
                inverse: true,
                axisTick: { show: false },
                axisLine: { show: false },
                data: keys.map((k) => k.clientId),
              },
              series: [
                {
                  type: 'bar',
                  barMaxWidth: 20,
                  itemStyle: { color: barGradient('#2563eb', '#3b82f6'), borderRadius: [0, 6, 6, 0] },
                  data: keys.map((k) => k.calls30d),
                },
              ],
            },
          },
        ],
        tableTitle: 'Commercial Partner API Key Inventory & Security Hygiene',
        columns: [
          { key: 'clientId', label: 'Client ID', format: 'code' },
          { key: 'partnerName', label: 'Partner' },
          { key: 'label', label: 'Key Label' },
          { key: 'scopesCount', label: 'Scopes', align: 'right', format: 'number' },
          { key: 'ipAllowlist', label: 'IP Allowlist' },
          { key: 'calls30d', label: '30d Calls', align: 'right', format: 'number' },
          { key: 'lastUsedAt', label: 'Last Used' },
          { key: 'expiresAt', label: 'Expires', format: 'date' },
          { key: 'status', label: 'Audit Status', align: 'center', format: 'badge' },
        ],
        rows: keys,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/partner-api-key-audit',
          controllerMethod: 'ReportsController::generateApiKeyAuditReport',
          serviceMethod: 'ReportingService::getPartnerApiKeyAudit(const ReportDto &dto)',
          cppDtoFields: ['partnerId', 'status'],
          existingTables: [
            { table: 'commercial_partner_api_keys', modelClass: 'drogon_model::Gnp::CommercialPartnerApiKeys', usedColumns: ['id', 'partner_id', 'partner_name', 'client_id', 'label', 'scopes', 'allowed_ips', 'is_active', 'last_used_at', 'created_at'] },
            { table: 'partner_api_request_logs', modelClass: 'drogon_model::Gnp::PartnerApiRequestLogs', usedColumns: ['api_key_id', 'created_at'] },
          ],
          schemaGaps: [
            '`commercial_partner_api_keys` is missing `expires_at` and `revoked_at` in PostgreSQL (`models/CommercialPartnerApiKeys.cc`), even though the frontend `CommercialPartnerApiKey` model expects `expiresAt`.',
          ],
          recommendedTables: [
            {
              table: 'public.commercial_partner_api_keys (ALTER)',
              changeType: 'alter_table',
              summary: 'Add `expires_at`, `revoked_at`, `revoked_by`, and `rate_limit_per_minute`.',
              keyColumns: ['expires_at', 'revoked_at', 'rate_limit_per_minute'],
              ddlSnippet: 'ALTER TABLE public.commercial_partner_api_keys ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ, ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ, ADD COLUMN IF NOT EXISTS rate_limit_per_minute INTEGER NOT NULL DEFAULT 120;',
            },
          ],
          sampleSqlQuery: `SELECT k.client_id, k.partner_name, k.label, jsonb_array_length(k.scopes) AS scopes_count,
       cardinality(k.allowed_ips) AS allowed_ip_count, k.is_active, k.last_used_at, k.expires_at,
       COUNT(l.id) AS calls_30d
FROM public.commercial_partner_api_keys k
LEFT JOIN public.partner_api_request_logs l ON l.api_key_id = k.id AND l.created_at >= NOW() - INTERVAL '30 days'
GROUP BY k.id ORDER BY calls_30d DESC;`,
        },
      };
    }

    // =========================================================================
    // 25. [NEW SUGGESTED] SYSTEM AUDIT LOGS & AUTH TELEMETRY
    // =========================================================================
    case 'security_audit_logs': {
      const adminOps = win.buckets.map((b) => Math.round((85 + rng() * 55) * b.daysInBucket));
      const authBlocks = win.buckets.map((b) => Math.max(1, Math.round((6 + rng() * 9) * b.daysInBucket)));

      const logs = [
        { createdAt: '2026-10-22 08:42', actor: 'kwame.addo@graphic.com.gh', action: 'PUBLISH_NEWSPAPER', entityType: 'Newspapers', endpoint: '/api/v1/admin/publish-newspaper', ipAddress: '102.176.94.18', httpStatus: 200, durationMs: 42 },
        { createdAt: '2026-10-22 08:15', actor: 'efua.mensah@graphic.com.gh', action: 'GENERATE_PARTNER_INVOICE', entityType: 'PartnerInvoices', endpoint: '/api/v1/reports/partner-invoice', ipAddress: '102.176.94.22', httpStatus: 200, durationMs: 68 },
        { createdAt: '2026-10-22 07:51', actor: 'unknown@91.214.12.88', action: 'ADMIN_LOGIN_FAILED', entityType: 'Users', endpoint: '/api/v1/auth/admin-login', ipAddress: '91.214.12.88', httpStatus: 401, durationMs: 114 },
        { createdAt: '2026-10-21 19:30', actor: 'kofi.owusu@graphic.com.gh', action: 'ISSUE_BULK_AFFILIATE_PAYOUT', entityType: 'AffiliatePayouts', endpoint: '/api/v1/affiliate/issue-bulk-payouts', ipAddress: '102.176.94.14', httpStatus: 200, durationMs: 318 },
        { createdAt: '2026-10-21 16:08', actor: 'abena.darko@graphic.com.gh', action: 'UPDATE_PARTNER_QUOTA', entityType: 'CommercialPartners', endpoint: '/api/v1/admin/update-partner', ipAddress: '102.176.94.31', httpStatus: 200, durationMs: 51 },
        { createdAt: '2026-10-21 14:19', actor: 'security-guard@system', action: 'LOCK_SUSPICIOUS_ACCOUNT', entityType: 'Users', endpoint: '/api/v1/users/lock-account', ipAddress: '10.0.4.12', httpStatus: 200, durationMs: 19 },
      ];

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Recorded ${fmtInt(adminOps.reduce((a, b) => a + b, 0))} audited administrative mutations in ` + '`public.audit_logs`' + ` with zero unauthorized privilege escalations. Automated lockout controls blocked ${fmtInt(authBlocks.reduce((a, b) => a + b, 0))} failed credential brute-force attempts across ` + '`/api/v1/auth/*`' + `.`,
        kpis: [
          { key: 'audit_events', label: 'Audited Admin Mutations', value: fmtInt(adminOps.reduce((a, b) => a + b, 0)), rawValue: adminOps.reduce((a, b) => a + b, 0), changePercent: 8.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Full JSONB before/after diffs', sparkline: adminOps.slice(-12) },
          { key: 'blocked_401', label: 'Blocked 401/403 Attempts', value: fmtInt(authBlocks.reduce((a, b) => a + b, 0)), rawValue: authBlocks.reduce((a, b) => a + b, 0), changePercent: -18.5, changeDirection: 'down', positiveIsGood: false, subtitle: 'Rejected by JwtAuthFilter', sparkline: authBlocks.slice(-12), sparklineType: 'bar' },
          { key: 'passkey_logins', label: 'Passkey Sign-In Success', value: '99.7%', rawValue: 99.7, changePercent: 1.1, changeDirection: 'up', positiveIsGood: true, subtitle: 'Phishing-resistant WebAuthn', sparkline: [98.9, 99.2, 99.5, 99.7] },
          { key: 'median_ms', label: 'Median Admin API Latency', value: '48 ms', rawValue: 48, changePercent: -9.4, changeDirection: 'down', positiveIsGood: false, subtitle: 'From audit_logs.duration_ms', sparkline: [58, 54, 52, 50, 48] },
        ],
        charts: [
          {
            id: 'audit-activity-chart',
            title: 'Privileged Admin Actions vs Blocked Auth Attempts',
            subtitle: 'Time series directly backed by `public.audit_logs`',
            chartTypeBadge: 'Bar + Line',
            span: 'two-thirds',
            height: 295,
            option: {
              color: ['#0f172a', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: DUAL_AXIS_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: [valueYAxis('Admin Ops'), valueYAxis('Blocked 401/403')],
              series: [
                { name: 'Audited Mutations', type: 'bar', barMaxWidth: 18, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: adminOps },
                { name: 'Blocked Auth Attempts', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 2.5 }, data: authBlocks },
              ],
            },
          },
          {
            id: 'auth-method-split',
            title: 'Sign-In Method Mix',
            subtitle: 'Password vs Email/SMS OTP vs WebAuthn Passkeys',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 295,
            option: {
              color: ['#059669', '#2563eb', '#64748b'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{d}%</b>' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'WebAuthn Passkeys', value: 34 },
                    { name: 'Email / SMS OTP', value: 41 },
                    { name: 'Password + JWT', value: 25 },
                  ],
                },
              ],
            },
          },
        ],
        tableTitle: 'Recent Privileged Security & Mutation Trail (`public.audit_logs`)',
        columns: [
          { key: 'createdAt', label: 'Timestamp' },
          { key: 'actor', label: 'Actor Email' },
          { key: 'action', label: 'Action', format: 'code' },
          { key: 'entityType', label: 'Entity' },
          { key: 'endpoint', label: 'Endpoint', format: 'code' },
          { key: 'ipAddress', label: 'Source IP', format: 'code' },
          { key: 'httpStatus', label: 'HTTP', align: 'right', format: 'number' },
          { key: 'durationMs', label: 'Latency (ms)', align: 'right', format: 'number' },
        ],
        rows: logs,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/security-audit-logs',
          controllerMethod: 'ReportsController::generateSecurityAuditLogsReport',
          serviceMethod: 'ReportingService::getSecurityAuditLogs(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'status'],
          existingTables: [
            { table: 'audit_logs', modelClass: 'drogon_model::Gnp::AuditLogs', usedColumns: ['user_email', 'action', 'entity_type', 'old_values', 'new_values', 'ip_address', 'endpoint', 'http_status_code', 'duration_ms', 'created_at'] },
            { table: 'partner_activity_logs', modelClass: 'drogon_model::Gnp::PartnerActivityLogs', usedColumns: ['partner_id', 'activity_type', 'severity', 'created_at'] },
          ],
          schemaGaps: [],
          recommendedTables: [],
          sampleSqlQuery: `SELECT user_email AS actor, action, entity_type, endpoint, host(ip_address) AS ip_address,
       http_status_code AS http_status, duration_ms, created_at
FROM public.audit_logs
WHERE created_at BETWEEN $1 AND $2 ORDER BY created_at DESC LIMIT 100;`,
        },
      };
    }

    // =========================================================================
    // 26. [NEW SUGGESTED] SUPPORT TICKETS & SLA RESOLUTION
    // =========================================================================
    case 'support_tickets_sla': {
      const openedSeries = win.buckets.map((b) => Math.round((14 + rng() * 9) * b.daysInBucket));
      const resolvedSeries = win.buckets.map((b, i) => Math.max(8, Math.round(openedSeries[i] * (0.94 + rng() * 0.1))));

      const categories = [
        { category: 'Billing & Paystack MoMo Callback', priorityMix: '48% High', opened: 148, resolved: 143, avgFirstResponseMin: 18, slaCompliancePct: 96.6, csat: '4.8 / 5.0' },
        { category: 'OTP / Passkey Account Recovery', priorityMix: '35% High', opened: 92, resolved: 90, avgFirstResponseMin: 14, slaCompliancePct: 97.8, csat: '4.9 / 5.0' },
        { category: 'Newspaper PDF / Offline PWA Reader', priorityMix: '22% High', opened: 76, resolved: 72, avgFirstResponseMin: 29, slaCompliancePct: 93.4, csat: '4.6 / 5.0' },
        { category: 'Commercial Partner Seat Quota & CSV Upload', priorityMix: '60% High', opened: 44, resolved: 43, avgFirstResponseMin: 11, slaCompliancePct: 98.5, csat: '4.9 / 5.0' },
        { category: 'Archive Search & Citation Export', priorityMix: '15% High', opened: 31, resolved: 29, avgFirstResponseMin: 34, slaCompliancePct: 91.9, csat: '4.7 / 5.0' },
      ];

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Subscriber Helpdesk resolved 96.4% of incoming tickets within priority SLA targets, achieving a 19-minute median First Response Time (FRT) and 4.8/5.0 subscriber CSAT. Auto-reconciling delayed MoMo webhooks would eliminate ~38% of billing tickets.`,
        kpis: [
          { key: 'tickets_res', label: 'Tickets Resolved', value: fmtInt(resolvedSeries.reduce((a, b) => a + b, 0)), rawValue: resolvedSeries.reduce((a, b) => a + b, 0), changePercent: 11.2, changeDirection: 'up', positiveIsGood: true, subtitle: '96.4% resolution ratio', sparkline: resolvedSeries.slice(-12) },
          { key: 'frt_min', label: 'Median First Response', value: '19 mins', rawValue: 19, changePercent: -24.0, changeDirection: 'down', positiveIsGood: false, subtitle: 'Target SLA: < 30 mins', sparkline: [29, 26, 23, 21, 19] },
          { key: 'sla_pct', label: 'SLA Compliance Rate', value: '96.4%', rawValue: 96.4, changePercent: 3.1, changeDirection: 'up', positiveIsGood: true, subtitle: 'High-priority < 2h SLA', sparkline: [92, 93.5, 94.8, 95.6, 96.4] },
          { key: 'csat', label: 'Subscriber CSAT Score', value: '4.8 / 5.0', rawValue: 4.8, changePercent: 4.3, changeDirection: 'up', positiveIsGood: true, subtitle: 'Post-ticket rating', sparkline: [4.5, 4.6, 4.7, 4.8, 4.8] },
        ],
        charts: [
          {
            id: 'support-opened-resolved',
            title: 'Tickets Opened vs Resolved Over Time',
            subtitle: 'Tracks helpdesk backlog burn-down across `public.support_tickets`',
            chartTypeBadge: 'Smooth Dual Area',
            span: 'two-thirds',
            height: 295,
            option: {
              color: ['#dc2626', '#059669'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: valueYAxis('Tickets'),
              series: [
                { name: 'Opened Tickets', type: 'line', smooth: true, areaStyle: { color: areaGradient('#dc2626') }, data: openedSeries },
                { name: 'Resolved Tickets', type: 'line', smooth: true, areaStyle: { color: areaGradient('#059669') }, data: resolvedSeries },
              ],
            },
          },
          {
            id: 'support-cat-pie',
            title: 'Ticket Volume by Issue Category',
            subtitle: 'Highlights self-service automation opportunities',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 295,
            option: {
              color: GNP_PALETTE,
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{c}</b> ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: categories.map((c) => ({ name: c.category.split(' &')[0], value: c.opened })),
                },
              ],
            },
          },
        ],
        tableTitle: 'Support Category SLA & Resolution Breakdown (`public.support_tickets`)',
        columns: [
          { key: 'category', label: 'Issue Category' },
          { key: 'priorityMix', label: 'Urgency' },
          { key: 'opened', label: 'Opened', align: 'right', format: 'number' },
          { key: 'resolved', label: 'Resolved', align: 'right', format: 'number' },
          { key: 'avgFirstResponseMin', label: 'First Resp (m)', align: 'right', format: 'number' },
          { key: 'slaCompliancePct', label: 'SLA Met %', align: 'right', format: 'progress' },
          { key: 'csat', label: 'CSAT', align: 'right' },
        ],
        rows: categories,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/support-tickets-sla',
          controllerMethod: 'ReportsController::generateSupportTicketsSlaReport',
          serviceMethod: 'ReportingService::getSupportTicketsSla(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'status'],
          existingTables: [
            { table: 'users', modelClass: 'drogon_model::Gnp::Users', usedColumns: ['id', 'email', 'first_name', 'last_name'] },
          ],
          schemaGaps: [
            '`SupportTicketService` in `gnp-api` is currently an empty stub; create `public.support_tickets` & `public.support_ticket_messages` tables.',
          ],
          recommendedTables: [
            {
              table: 'public.support_tickets',
              changeType: 'new_table',
              summary: 'Full helpdesk ticket table with `priority`, `status`, `first_response_at`, `sla_due_at`, `resolved_at`, `csat_rating`.',
              keyColumns: ['ticket_number', 'category', 'priority', 'status', 'first_response_at', 'sla_due_at', 'resolved_at'],
              ddlSnippet: 'CREATE TABLE IF NOT EXISTS public.support_tickets (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), ticket_number VARCHAR(20) UNIQUE NOT NULL, subject VARCHAR(255) NOT NULL, category VARCHAR(50) NOT NULL, priority VARCHAR(20) NOT NULL, status VARCHAR(20) NOT NULL, first_response_at TIMESTAMPTZ, sla_due_at TIMESTAMPTZ NOT NULL, resolved_at TIMESTAMPTZ, csat_rating SMALLINT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());',
            },
          ],
          sampleSqlQuery: `SELECT category, COUNT(*) AS opened,
       COUNT(*) FILTER (WHERE status IN ('resolved', 'closed')) AS resolved,
       ROUND(AVG(EXTRACT(EPOCH FROM (first_response_at - created_at)) / 60.0)) AS avg_first_response_min,
       ROUND(100.0 * COUNT(*) FILTER (WHERE resolved_at <= sla_due_at) / NULLIF(COUNT(*), 0), 1) AS sla_compliance_pct
FROM public.support_tickets
WHERE created_at BETWEEN $1 AND $2 GROUP BY category ORDER BY opened DESC;`,
        },
      };
    }

    default:
      return null;
  }
}
