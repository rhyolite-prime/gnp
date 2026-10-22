import { defineEventHandler, getQuery } from 'h3';
import { buildPartnerPortalAnalyticsMock } from '~/utils/reportsMockEngine';
import dayjs from 'dayjs';

export default defineEventHandler((event) => {
  const slugParam = event.context.params?.slug;
  const route = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || '';
  const query = getQuery(event);
  const range = String(query.range || '30d');

  if (route === 'partner-reports') {
    return {
      success: true,
      message: 'Partner analytics bundle retrieved successfully.',
      unAuthorizedRequest: false,
      error: null,
      result: buildPartnerPortalAnalyticsMock(range),
    };
  }

  if (route === 'affiliate-stats') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const earningsOverTime = [1180, 1490, 1820, 2140, 2060, 2590, 2940, 3280, 3610, 4120];
    const clicksOverTime = [490, 610, 740, 860, 815, 980, 1120, 1290, 1410, 1625];
    const signupsOverTime = [29, 36, 44, 52, 48, 61, 69, 78, 86, 98];

    return {
      success: true,
      message: 'Affiliate telemetry retrieved successfully.',
      unAuthorizedRequest: false,
      error: null,
      result: {
        affiliateCode: 'KWAME2026',
        tier: 'Gold Tier (18%)',
        totalClicks: clicksOverTime.reduce((a, b) => a + b, 0),
        totalSignups: signupsOverTime.reduce((a, b) => a + b, 0),
        conversionRate: 6.05,
        totalEarnings: earningsOverTime.reduce((a, b) => a + b, 0),
        pendingEarnings: 1485.0,
        paidEarnings: 23745.0,
        months,
        earningsOverTime,
        clicksOverTime,
        signupsOverTime,
        conversionsByPlan: [
          { plan: 'Standard Monthly (GHS 65)', signups: 342, revenueGhs: 22230, commissionGhs: 10944 },
          { plan: 'Annual Pro (GHS 720)', signups: 118, revenueGhs: 84960, commissionGhs: 9126 },
          { plan: 'Weekly Pass (GHS 18)', signups: 96, revenueGhs: 1728, commissionGhs: 1940 },
          { plan: 'Institutional Lead Referral', signups: 45, revenueGhs: 32400, commissionGhs: 3220 },
        ],
        recentCommissions: [
          { id: 'COM-9941', date: '2026-10-22', subscriberMasked: 'a.mensah***@gmail.com', plan: 'Annual Pro', subscriptionAmount: 720, commissionRate: '18%', commissionAmount: 129.6, status: 'PENDING' },
          { id: 'COM-9918', date: '2026-10-20', subscriberMasked: 'k.owusu***@yahoo.com', plan: 'Standard Monthly', subscriptionAmount: 65, commissionRate: '18%', commissionAmount: 11.7, status: 'PENDING' },
          { id: 'COM-9872', date: '2026-10-16', subscriberMasked: 'efua.d***@ug.edu.gh', plan: 'Annual Pro', subscriptionAmount: 720, commissionRate: '18%', commissionAmount: 129.6, status: 'APPROVED' },
          { id: 'COM-9815', date: '2026-10-11', subscriberMasked: 'nana.b***@mtn.com.gh', plan: 'Standard Monthly', subscriptionAmount: 65, commissionRate: '18%', commissionAmount: 11.7, status: 'PAID' },
          { id: 'COM-9764', date: '2026-10-05', subscriberMasked: 's.adjei***@gcgl.com.gh', plan: 'Annual Pro', subscriptionAmount: 720, commissionRate: '18%', commissionAmount: 129.6, status: 'PAID' },
        ],
      },
    };
  }

  if (route === 'admin-executive-summary') {
    const days = Array.from({ length: 14 }, (_, i) =>
      dayjs('2026-10-22').subtract(13 - i, 'day').format('DD MMM')
    );
    return {
      success: true,
      message: 'Executive dashboard analytics loaded.',
      unAuthorizedRequest: false,
      error: null,
      result: {
        totalUsers: 28450,
        activeSubscriptions: 15820,
        monthlyRevenue: 312480,
        totalPartners: 14,
        userGrowthPct: 14.8,
        revenueGrowthPct: 21.3,
        days,
        dailyRevenue: [9420, 10180, 9860, 11240, 12650, 8920, 8410, 10940, 11680, 12390, 13120, 14480, 10290, 11850],
        dailySignups: [64, 72, 68, 85, 94, 58, 52, 79, 84, 91, 97, 112, 74, 88],
        revenueByStream: [
          { name: 'Individual Subscriptions', value: 148200 },
          { name: 'B2B Partner Bulk Invoices', value: 96400 },
          { name: 'Institutional Archive Credits', value: 42800 },
          { name: 'Single-Copy Paystack Purchases', value: 25080 },
        ],
        recentActivities: [
          { id: 'ACT-1', time: '12 mins ago', actor: 'Paystack Webhook', event: 'Settled 48 recurring MTN MoMo renewals (GHS 3,120.00)', badge: 'FINANCE' },
          { id: 'ACT-2', time: '41 mins ago', actor: 'MTN Ghana PLC', event: 'Onboarded 24 corporate subscribers via Partner API v1', badge: 'PARTNER' },
          { id: 'ACT-3', time: '1 hr ago', actor: 'OCR Worker #2', event: 'Indexed Daily Graphic 22 Oct 2026 (48 pages, 168 articles, embeddings stored)', badge: 'INGESTION' },
          { id: 'ACT-4', time: '3 hrs ago', actor: 'University of Ghana', event: 'Topped up +2,500 Archive Research Credits (INV-ARC-412)', badge: 'ARCHIVES' },
          { id: 'ACT-5', time: '5 hrs ago', actor: 'Ama Serwaa (Finance)', event: 'Dispatched Oct 2026 VAT/GETFund Invoice to GCB Bank PLC', badge: 'BILLING' },
        ],
      },
    };
  }

  return {
    success: false,
    message: `Unknown portal analytics route: ${route}`,
    unAuthorizedRequest: false,
    error: { code: 404, message: 'Not Found' },
    result: null,
  };
});
