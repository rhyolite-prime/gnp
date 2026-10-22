// Central Plain-JavaScript Mock Registry for Graphic NewsPlus Platform Reports
// Used directly by the Report Viewer UI and as exact JSON contract examples for `gnp-api` (C++ Drogon + PostgreSQL).

import { FINANCIAL_REPORTS_MOCK, MOCK_PARTNERS_LIST } from './financialReports.js';
import { USER_AND_CONTENT_REPORTS_MOCK } from './userAndContentReports.js';
import { PARTNER_AND_MARKETING_REPORTS_MOCK } from './partnerAndMarketingReports.js';
import { ARCHIVE_GAMES_ADMIN_REPORTS_MOCK } from './archiveGamesAndAdminReports.js';

export { MOCK_PARTNERS_LIST };

export const MOCK_REPORTS_BY_ID = {
  ...FINANCIAL_REPORTS_MOCK,
  ...USER_AND_CONTENT_REPORTS_MOCK,
  ...PARTNER_AND_MARKETING_REPORTS_MOCK,
  ...ARCHIVE_GAMES_ADMIN_REPORTS_MOCK,
};

export const MOCK_REPORT_GROUPS = [
  {
    id: 'financial',
    title: 'Revenue & Financial',
    description: 'Track sales, subscriptions, invoices, and overall platform revenue.',
    reports: [
      { id: 'sales_revenue', name: 'Sales & Revenue Overview', description: 'Breakdown of total revenue generated over time.', parameters: ['dateRange', 'plan'] },
      { id: 'payment_transactions', name: 'Payment Transactions Log', description: 'Detailed log of all payments grouped by status.', parameters: ['dateRange', 'status'] },
      { id: 'partner_invoices', name: 'Partner Invoices', description: 'B2B/Commercial Partner financials and outstanding balances.', parameters: ['partner', 'dateRange', 'status'] },
      { id: 'subscription_renewals', name: 'Subscription Renewals & Churn', description: 'Analysis of active subscriptions and churn rates.', parameters: ['dateRange'] },
      { id: 'single_copy_paywall_funnel', name: 'Single-Copy Paywall Funnel', description: 'Edition paywall impressions, guest checkouts, and plan upsells.', parameters: ['dateRange'] },
    ],
  },
  {
    id: 'users',
    title: 'User & Subscriber',
    description: 'Analyze user demographics, account statuses, and plan distributions.',
    reports: [
      { id: 'subscriber_demographics', name: 'Subscriber Demographics & Status', description: 'Summary of all registered users and their account states.', parameters: ['status', 'dateRange'] },
      { id: 'plan_distribution', name: 'Subscription Plan Distribution', description: 'Number of subscribers per plan type.', parameters: ['plan'] },
      { id: 'subscriber_retention_cohorts', name: 'Subscriber Retention Cohorts', description: 'Month-over-month retention cohorts and lifetime value.', parameters: ['dateRange', 'plan'] },
    ],
  },
  {
    id: 'content',
    title: 'Content & Newspaper',
    description: 'Monitor publication engagement, sales, and catalog inventory.',
    reports: [
      { id: 'newspaper_engagement', name: 'Newspaper Engagement & Sales', description: 'Metrics on individual publications views and sales.', parameters: ['dateRange'] },
      { id: 'content_inventory', name: 'Content Inventory Status', description: 'Overview of the newspaper catalog (Archived, Published, etc).', parameters: ['status'] },
      { id: 'ingestion_jobs', name: 'Ingestion Job Logs', description: 'Track the status of daily newspaper uploads.', parameters: ['dateRange', 'status'] },
      { id: 'multimedia_originals_performance', name: 'Multimedia & Originals Performance', description: 'Video documentaries, podcasts, audio briefings, and Originals longform.', parameters: ['dateRange'] },
    ],
  },
  {
    id: 'partners',
    title: 'Commercial Partner (B2B)',
    description: 'Insights into partner engagement, API usage, and member quotas.',
    reports: [
      { id: 'partner_engagement', name: 'Partner Sub-account Engagement', description: 'Granular insights into reads and active sessions per partner.', parameters: ['dateRange'] },
      { id: 'partner_quota', name: 'Partner Quota & Usage', description: 'Tracking of assigned quotas vs remaining allocations.', parameters: [] },
      { id: 'partner_api_usage', name: 'Partner API Usage Stats', description: 'Metrics on API requests, latency, and success rates.', parameters: ['dateRange'] },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing & Campaigns',
    description: 'Evaluate campaign performance, push alerts, affiliates, and coupon redemptions.',
    reports: [
      { id: 'campaign_performance', name: 'Campaign Performance', description: 'Track reach, clicks, and engagement across marketing channels.', parameters: ['dateRange', 'channel'] },
      { id: 'coupon_usage', name: 'Coupon Usage & Effectiveness', description: 'Track issued coupons and redemption rates.', parameters: ['status', 'dateRange'] },
      { id: 'affiliate_performance', name: 'Affiliate Referral Performance', description: 'Referral clicks, paid conversions, and commissions by affiliate.', parameters: ['dateRange'] },
      { id: 'affiliate_payout_reconciliation', name: 'Affiliate Payout Reconciliation', description: 'MTN MoMo & bank disbursements and withholding tax summary.', parameters: ['dateRange', 'status'] },
      { id: 'push_notification_analytics', name: 'Push Notification Analytics', description: 'Browser Web Push delivery rates, CTR by topic, and browser split.', parameters: ['dateRange'] },
    ],
  },
  {
    id: 'archives',
    title: 'Historical Archives & AI RAG',
    description: 'Search demand across 1950–2026 digitized archives, AI citations, and institutional credits.',
    reports: [
      { id: 'archive_rag_intelligence', name: 'Archive Search & AI RAG Intelligence', description: 'Keyword searches, pgvector similarity quality, and decade demand.', parameters: ['dateRange'] },
      { id: 'institutional_archive_credits', name: 'Institutional Archive Credit Ledger', description: 'University and research institution credit balances and exports.', parameters: ['dateRange', 'status'] },
    ],
  },
  {
    id: 'games',
    title: 'Games & Puzzles',
    description: 'Track daily crosswords, word puzzles, Sudoku completions, and reader streaks.',
    reports: [
      { id: 'games_engagement_retention', name: 'Daily Games & Puzzles Engagement', description: 'Puzzle starts, completion rates, solve times, and streak lift.', parameters: ['dateRange'] },
    ],
  },
  {
    id: 'admin',
    title: 'Admin & Security Audits',
    description: 'Review admin roles, permissions, support SLAs, and partner API key accesses.',
    reports: [
      { id: 'admin_roles', name: 'Admin Roles & Access', description: 'Audit of current admin users and their assigned permissions.', parameters: [] },
      { id: 'api_key_audit', name: 'Partner API Key Audit', description: 'List of active, expired, and recently used API keys.', parameters: ['status'] },
      { id: 'security_audit_logs', name: 'Security & Admin Audit Trail', description: 'Privileged admin actions across billing, quotas, and roles.', parameters: ['dateRange', 'status'] },
      { id: 'support_tickets_sla', name: 'Support Tickets & SLA Report', description: 'Ticket resolution SLA compliance, first response time, and CSAT.', parameters: ['dateRange', 'status'] },
    ],
  },
];

const SLUG_TO_ID_MAP = {};
for (const [id, data] of Object.entries(MOCK_REPORTS_BY_ID)) {
  const slug = String(data.endpoint || '').replace('/api/v1/reports/', '');
  if (slug) SLUG_TO_ID_MAP[slug] = id;
  SLUG_TO_ID_MAP[id] = id;
}

export function getMockReportData(reportIdOrSlug, params = {}) {
  const resolvedId = SLUG_TO_ID_MAP[reportIdOrSlug] || 'sales_revenue';
  const base = MOCK_REPORTS_BY_ID[resolvedId];
  const clone = JSON.parse(JSON.stringify(base));

  // Special handling for Partner Invoice report
  if (resolvedId === 'partner_invoices') {
    const partnerId = params.partnerId || 'p-mtn-001';
    const selectedInvoice =
      clone.invoicesByPartner[partnerId] || clone.invoicesByPartner['p-mtn-001'];
    return {
      ...selectedInvoice,
      charts: clone.charts,
    };
  }

  // Apply clean row filtering on ordinary JS arrays when filter parameters are passed
  if (Array.isArray(clone.rows)) {
    clone.rows = clone.rows.filter((row) => {
      if (params.status && params.status !== 'all') {
        if (row.status && String(row.status).toLowerCase() !== String(params.status).toLowerCase()) {
          return false;
        }
      }
      if (params.plan && params.plan !== 'all') {
        if (row.plan && String(row.plan).toLowerCase() !== String(params.plan).toLowerCase()) {
          return false;
        }
      }
      if (params.channel && params.channel !== 'all') {
        if (row.channel && String(row.channel).toLowerCase() !== String(params.channel).toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }

  return clone;
}
