import type { GeneratedReportResult, ReportRequestDto } from '~/models/reports';
import { REPORT_GROUPS } from '~/utils/reportsSchemaCatalog';
import { generatePart1Report } from '~/utils/reportsGeneratorsPart1';
import { generatePart2Report } from '~/utils/reportsGeneratorsPart2';
import { createSeededRng } from '~/utils/echartsHelpers';
import dayjs from 'dayjs';

export function findReportByIdOrSlug(idOrSlug: string) {
  for (const group of REPORT_GROUPS) {
    for (const report of group.reports) {
      const slug = report.endpoint.replace('/api/v1/reports/', '');
      if (report.id === idOrSlug || slug === idOrSlug) {
        return { report, group };
      }
    }
  }
  return null;
}

export function generateMockReportById(
  idOrSlug: string,
  dto: ReportRequestDto = {}
): GeneratedReportResult {
  const match = findReportByIdOrSlug(idOrSlug) || {
    report: REPORT_GROUPS[0].reports[0],
    group: REPORT_GROUPS[0],
  };

  const res =
    generatePart1Report(match.report.id, match.report, match.group, dto) ||
    generatePart2Report(match.report.id, match.report, match.group, dto);

  if (!res) {
    throw new Error(`No generator registered for report: ${match.report.id}`);
  }
  return res;
}

/**
 * Rich realistic mock generator for the Partner B2B Portal `/partners/dashboard/reports`
 * matching `PartnerEngagementReport`, `PartnerAnalyticsCharts`, and `ApiUsageStats`.
 */
export function buildPartnerPortalAnalyticsMock(range = '30d') {
  const days = range === '7d' ? 7 : range === '3m' ? 12 : range === 'ytd' ? 10 : 14;
  const rng = createSeededRng(`partner-portal|${range}`);
  const mult = range === '7d' ? 0.26 : range === '3m' ? 2.9 : range === 'ytd' ? 8.4 : 1;

  const engagementData = Array.from({ length: days }, (_, idx) => {
    const label =
      range === 'ytd'
        ? dayjs('2026-01-01').add(idx, 'month').format('MMM')
        : range === '3m'
        ? `Wk ${idx + 1}`
        : dayjs('2026-10-22').subtract(days - 1 - idx, 'day').format('DD MMM');
    const reads = Math.round((1380 + rng() * 640) * (range === 'ytd' ? 18 : range === '3m' ? 5.5 : 1));
    const activeReaders = Math.round(reads * (0.41 + rng() * 0.08));
    return { date: label, reads, activeReaders };
  });

  const totalReads = Math.round(42580 * mult);

  return {
    engagementReport: {
      totalReads,
      totalReadsChange: 18.4,
      totalReadsChangeType: 'increase',
      avgSessionDuration: range === '7d' ? '8m 44s' : '8m 19s',
      avgSessionDurationChange: '+1m 52s',
      avgSessionDurationChangeType: 'increase',
      newMembersOnboarded: Math.round(342 * mult),
      newMembersOnboardedChange: '+14% onboarding velocity',
      newMembersOnboardedChangeType: 'increase',
      activeReaders: Math.min(4315, Math.round(2180 * (range === '7d' ? 0.78 : 1.12))),
      activeReadersChange: 11.6,
      activeReadersChangeType: 'increase',
    },
    analyticsCharts: {
      partnerEmail: 'enterprise-digital@mtn.com.gh',
      fullName: 'MTN Ghana PLC',
      engagementData,
      topPublications: [
        { name: 'Daily Graphic', reads: Math.round(totalReads * 0.41), change: 16.2 },
        { name: 'Graphic Business', reads: Math.round(totalReads * 0.29), change: 22.8 },
        { name: 'Graphic Sports', reads: Math.round(totalReads * 0.13), change: 9.4 },
        { name: 'The Mirror', reads: Math.round(totalReads * 0.1), change: 5.1 },
        { name: 'Graphic Showbiz', reads: Math.round(totalReads * 0.07), change: -2.3 },
      ],
    },
    apiStats: {
      totalRequests: Math.round(89420 * mult),
      successRate: 99.2,
      avgLatency: 54,
      errorCount: Math.round(715 * mult),
      usageByEndpoint: [
        { endpoint: '/api/v1/partner-api/check-subscriber-status', count: Math.round(51200 * mult), successRate: 99.6, avgLatencyMs: 34 },
        { endpoint: '/api/v1/partner-api/retrieve-subscriber-details', count: Math.round(21900 * mult), successRate: 99.3, avgLatencyMs: 46 },
        { endpoint: '/api/v1/partner-api/onboard-subscriber', count: Math.round(12400 * mult), successRate: 98.4, avgLatencyMs: 71 },
        { endpoint: '/api/v1/auth/partner-login', count: Math.round(2480 * mult), successRate: 98.9, avgLatencyMs: 52 },
        { endpoint: '/api/v1/partners/bulk-upload-subscribers', count: Math.round(1440 * mult), successRate: 95.8, avgLatencyMs: 178 },
      ],
      usageOverTime: engagementData.map((d) => ({
        date: d.date,
        count: Math.round(d.reads * 2.1),
        errors: Math.max(2, Math.round(d.reads * 0.017)),
        latencyMs: Math.round(44 + rng() * 24),
      })),
    },
  };
}
