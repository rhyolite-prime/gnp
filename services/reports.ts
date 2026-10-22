import { getMockReportData, MOCK_PARTNERS_LIST } from '~/mocks/reports/index.js';

export interface ReportFilterDto {
  startDate?: string;
  endDate?: string;
  partnerId?: string;
  publicationId?: string;
  status?: string;
  plan?: string;
  channel?: string;
}

/**
 * Unified report service layer backed by plain JavaScript mock objects & arrays (`~/mocks/reports`).
 * When `gnp-api` C++ endpoints are ready on `https://api.graphicnewsplus.com/api/v1/reports/*`,
 * simply swap each handler to `const res = await apiPost('/reports/<slug>', dto); return res.result;`
 */
export const runReportById = async (reportId: string, dto: ReportFilterDto = {}) => {
  return getMockReportData(reportId, dto);
};

// 1. Revenue & Financial
export const generateSalesReport = async (dto: ReportFilterDto) => getMockReportData('sales_revenue', dto);
export const generatePaymentTransactionsReport = async (dto: ReportFilterDto) => getMockReportData('payment_transactions', dto);
export const generatePartnerInvoice = async (dto: ReportFilterDto) => getMockReportData('partner_invoices', dto);
export const generateSubscriptionRenewalsReport = async (dto: ReportFilterDto) => getMockReportData('subscription_renewals', dto);
export const generateSingleCopyFunnelReport = async (dto: ReportFilterDto) => getMockReportData('single_copy_paywall_funnel', dto);

// 2. User & Subscriber
export const generateSubscriberDemographicsReport = async (dto: ReportFilterDto) => getMockReportData('subscriber_demographics', dto);
export const generatePlanDistributionReport = async (dto: ReportFilterDto) => getMockReportData('plan_distribution', dto);
export const generateSubscriberRetentionReport = async (dto: ReportFilterDto) => getMockReportData('subscriber_retention_cohorts', dto);

// 3. Content & Newspaper
export const generateNewspaperEngagementReport = async (dto: ReportFilterDto) => getMockReportData('newspaper_engagement', dto);
export const generateContentInventoryReport = async (dto: ReportFilterDto) => getMockReportData('content_inventory', dto);
export const generateIngestionJobLogsReport = async (dto: ReportFilterDto) => getMockReportData('ingestion_jobs', dto);
export const generateMultimediaOriginalsReport = async (dto: ReportFilterDto) => getMockReportData('multimedia_originals_performance', dto);

// 4. Commercial Partner (B2B)
export const generatePartnerEngagementReport = async (dto: ReportFilterDto) => getMockReportData('partner_engagement', dto);
export const generatePartnerQuotaReport = async () => getMockReportData('partner_quota', {});
export const generatePartnerApiUsageReport = async (dto: ReportFilterDto) => getMockReportData('partner_api_usage', dto);

// 5. Marketing & Campaigns
export const generateCampaignPerformanceReport = async (dto: ReportFilterDto) => getMockReportData('campaign_performance', dto);
export const generateCouponUsageReport = async (dto: ReportFilterDto) => getMockReportData('coupon_usage', dto);
export const generateAffiliatePerformanceReport = async (dto: ReportFilterDto) => getMockReportData('affiliate_performance', dto);
export const generateAffiliatePayoutReport = async (dto: ReportFilterDto) => getMockReportData('affiliate_payout_reconciliation', dto);
export const generatePushNotificationReport = async (dto: ReportFilterDto) => getMockReportData('push_notification_analytics', dto);

// 6. Historical Archives & AI RAG
export const generateArchiveRagReport = async (dto: ReportFilterDto) => getMockReportData('archive_rag_intelligence', dto);
export const generateInstitutionalArchiveCreditsReport = async (dto: ReportFilterDto) => getMockReportData('institutional_archive_credits', dto);

// 7. Interactive Games & Puzzles
export const generateGamesEngagementReport = async (dto: ReportFilterDto) => getMockReportData('games_engagement_retention', dto);

// 8. Admin & Security Audits
export const generateAdminRolesReport = async () => getMockReportData('admin_roles', {});
export const generateApiKeyAuditReport = async (dto: ReportFilterDto) => getMockReportData('api_key_audit', dto);
export const generateSecurityAuditLogsReport = async (dto: ReportFilterDto) => getMockReportData('security_audit_logs', dto);
export const generateSupportTicketsSlaReport = async (dto: ReportFilterDto) => getMockReportData('support_tickets_sla', dto);

export const sendPartnerInvoiceAsEmail = async (_payload: ReportFilterDto) => {
  return true;
};

export const getMockPartnersDirectory = () => MOCK_PARTNERS_LIST;
