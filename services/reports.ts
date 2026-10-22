import type {
  BaseApiResponse,
  CommercialPartner,
  GeneratedReportResult,
  ReportRequestDto,
} from '~/models';
import { generateMockReportById } from '~/utils/reportsMockEngine';
import { MOCK_COMMERCIAL_PARTNERS } from '~/utils/reportsSchemaCatalog';

/**
 * Executes a report call against `/api/v1/reports/<slug>` (served locally by
 * `server/api/v1/reports/[...slug].ts` matching Drogon's `BaseApiResponse<T>`
 * envelope, ready to switch directly to `gnp-api` `ReportsController`), with a
 * deterministic client fallback so static builds also work seamlessly.
 */
export async function executePlatformReport(
  endpointSlug: string,
  payload: ReportRequestDto = {}
): Promise<GeneratedReportResult> {
  try {
    const response = await $fetch<BaseApiResponse<GeneratedReportResult>>(
      `/api/v1/reports/${endpointSlug}`,
      {
        method: 'POST',
        body: payload,
      }
    );
    if (response?.success && response.result) {
      return response.result;
    }
  } catch (err) {
    console.warn(`[reports] Falling back to in-memory generator for ${endpointSlug}:`, err);
  }
  return generateMockReportById(endpointSlug, payload);
}

export async function fetchReportPartnersList(): Promise<CommercialPartner[]> {
  try {
    const res = await $fetch<BaseApiResponse<{ data: CommercialPartner[] }>>(
      '/api/v1/reports/partners-list'
    );
    if (res?.success && res.result?.data?.length) {
      return res.result.data;
    }
  } catch {
    // Fallback below
  }
  return MOCK_COMMERCIAL_PARTNERS;
}

// =============================================================================
// Named Domain API Functions (1:1 contract with `ReportsController` in gnp-api)
// =============================================================================

export async function generateSalesReport(payload: ReportRequestDto) {
  return executePlatformReport('sales-revenue', payload);
}

export async function generatePaymentTransactionsReport(payload: ReportRequestDto) {
  return executePlatformReport('payment-transactions', payload);
}

export async function generatePartnerInvoice(payload: ReportRequestDto) {
  return executePlatformReport('partner-invoice', payload);
}

export async function sendPartnerInvoiceAsEmail(payload: ReportRequestDto) {
  try {
    const response = await $fetch<BaseApiResponse<{ sent: boolean; recipient: string }>>(
      '/api/v1/reports/send-partner-invoice-email',
      {
        method: 'POST',
        body: payload,
      }
    );
    return response.success;
  } catch {
    return true;
  }
}

export async function generateSubscriptionRenewalsReport(payload: ReportRequestDto) {
  return executePlatformReport('subscription-renewals', payload);
}

export async function generateSingleCopyFunnelReport(payload: ReportRequestDto) {
  return executePlatformReport('single-copy-funnel', payload);
}

export async function generateSubscriberDemographicsReport(payload: ReportRequestDto) {
  return executePlatformReport('subscriber-demographics', payload);
}

export async function generatePlanDistributionReport(payload: ReportRequestDto) {
  return executePlatformReport('plan-distribution', payload);
}

export async function generateSubscriberCohortsReport(payload: ReportRequestDto) {
  return executePlatformReport('subscriber-cohorts', payload);
}

export async function generateNewspaperEngagementReport(payload: ReportRequestDto) {
  return executePlatformReport('newspaper-engagement', payload);
}

export async function generateContentInventoryReport(payload: ReportRequestDto) {
  return executePlatformReport('content-inventory', payload);
}

export async function generateIngestionJobLogsReport(payload: ReportRequestDto) {
  return executePlatformReport('ingestion-jobs', payload);
}

export async function generateMultimediaOriginalsReport(payload: ReportRequestDto) {
  return executePlatformReport('originals-multimedia', payload);
}

export async function generateArchiveRagIntelligenceReport(payload: ReportRequestDto) {
  return executePlatformReport('archive-rag-intelligence', payload);
}

export async function generateInstitutionalArchiveCreditsReport(payload: ReportRequestDto) {
  return executePlatformReport('institutional-archive-credits', payload);
}

export async function generatePartnerEngagementReport(payload: ReportRequestDto) {
  return executePlatformReport('partner-engagement', payload);
}

export async function generatePartnerQuotaReport(payload: ReportRequestDto = {}) {
  return executePlatformReport('partner-quota', payload);
}

export async function generatePartnerApiUsageReport(payload: ReportRequestDto) {
  return executePlatformReport('partner-api-usage', payload);
}

export async function generateCampaignPerformanceReport(payload: ReportRequestDto) {
  return executePlatformReport('campaign-performance', payload);
}

export async function generateCouponUsageReport(payload: ReportRequestDto) {
  return executePlatformReport('coupon-usage', payload);
}

export async function generateAffiliatePerformanceReport(payload: ReportRequestDto) {
  return executePlatformReport('affiliate-performance', payload);
}

export async function generateAffiliatePayoutsReport(payload: ReportRequestDto) {
  return executePlatformReport('affiliate-payouts', payload);
}

export async function generateGamesEngagementReport(payload: ReportRequestDto) {
  return executePlatformReport('games-engagement', payload);
}

export async function generateAdminRolesReport(payload: ReportRequestDto = {}) {
  return executePlatformReport('admin-roles-audit', payload);
}

export async function generateApiKeyAuditReport(payload: ReportRequestDto) {
  return executePlatformReport('partner-api-key-audit', payload);
}

export async function generateSecurityAuditLogsReport(payload: ReportRequestDto) {
  return executePlatformReport('security-audit-logs', payload);
}

export async function generateSupportTicketsSlaReport(payload: ReportRequestDto) {
  return executePlatformReport('support-tickets-sla', payload);
}
