import { defineEventHandler } from 'h3';
import dayjs from 'dayjs';

export default defineEventHandler((event) => {
  const slugParam = event.context.params?.slug;
  const route = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || '';

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
    message: `Unknown admin analytics route: ${route}`,
    unAuthorizedRequest: false,
    error: { code: 404, message: 'Not Found' },
    result: null,
  };
});
