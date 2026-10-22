import dayjs from 'dayjs';
import type {
  GeneratedReportResult,
  PartnerInvoiceDocument,
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

export function generatePart1Report(
  reportId: string,
  def: ReportDefinition,
  group: ReportGroupDefinition,
  dto: ReportRequestDto
): GeneratedReportResult | null {
  const win = normalizeReportWindow(reportId, dto);
  const rng = createSeededRng(win.seedKey);
  const labels = win.buckets.map((b) => b.label);
  const planScale =
    dto.plan === 'corporate' ? 0.42 : dto.plan === 'premium' ? 0.34 : dto.plan === 'standard' ? 0.24 : 1.0;
  const selectedPartner =
    MOCK_COMMERCIAL_PARTNERS.find((p) => p.id === dto.partnerId) || MOCK_COMMERCIAL_PARTNERS[0];
  const selectedPub = GRAPHIC_PUBLICATIONS.find(
    (p) => p.id === dto.publicationId || p.name.toLowerCase() === dto.publicationId?.toLowerCase()
  );

  switch (reportId) {
    // =========================================================================
    // 1. SALES & REVENUE OVERVIEW
    // =========================================================================
    case 'sales_revenue': {
      const b2cSeries: number[] = [];
      const b2bSeries: number[] = [];
      const singleCopySeries: number[] = [];
      const archiveDossierSeries: number[] = [];

      const rows = win.buckets.map((b, i) => {
        const mult = b.daysInBucket * planScale * (1 + i * 0.012);
        const b2c = Math.round((2450 + rng() * 920) * mult);
        const b2b = Math.round((1980 + rng() * 780) * mult);
        const single = Math.round((640 + rng() * 310) * mult);
        const archive = Math.round((390 + rng() * 220) * mult);
        const gross = b2c + b2b + single + archive;
        const fees = Math.round(gross * 0.0195 * 100) / 100;
        const net = Math.round((gross - fees) * 100) / 100;

        b2cSeries.push(b2c);
        b2bSeries.push(b2b);
        singleCopySeries.push(single);
        archiveDossierSeries.push(archive);

        return {
          period: b.isoDate,
          label: b.label,
          b2cSubscriptions: b2c,
          b2bPartnerBilling: b2b,
          singleCopySales: single,
          archiveAndRag: archive,
          grossRevenue: gross,
          gatewayFees: fees,
          netSettlement: net,
        };
      });

      const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
      const totalB2c = sum(b2cSeries);
      const totalB2b = sum(b2bSeries);
      const totalSingle = sum(singleCopySeries);
      const totalArchive = sum(archiveDossierSeries);
      const totalGross = totalB2c + totalB2b + totalSingle + totalArchive;
      const totalNet = Math.round(totalGross * (1 - 0.0195));

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Total verified platform revenue across ${win.totalDays} days reached ${fmtGhs(totalGross)} (${fmtGhs(totalNet)} net after Paystack settlement fees). B2C recurring plans (${Math.round((totalB2c / totalGross) * 100)}%) and B2B Commercial Partner contracts (${Math.round((totalB2b / totalGross) * 100)}%) anchor recurring predictability, complemented by single-edition impulse buys and Executive RAG Dossier exports.`,
        kpis: [
          {
            key: 'gross_rev',
            label: 'Gross Platform Revenue',
            value: fmtCompactGhs(totalGross),
            rawValue: totalGross,
            changePercent: 14.8,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'All verified streams (GHS)',
            sparkline: rows.slice(-12).map((r) => r.grossRevenue),
          },
          {
            key: 'net_rev',
            label: 'Net Settled Revenue',
            value: fmtCompactGhs(totalNet),
            rawValue: totalNet,
            changePercent: 15.2,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Less 1.95% Paystack & MoMo fees',
            sparkline: rows.slice(-12).map((r) => r.netSettlement),
          },
          {
            key: 'recurring_share',
            label: 'Recurring Revenue Share',
            value: `${(((totalB2c + totalB2b) / Math.max(totalGross, 1)) * 100).toFixed(1)}%`,
            rawValue: ((totalB2c + totalB2b) / Math.max(totalGross, 1)) * 100,
            changePercent: 3.4,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'B2C Plans + B2B Seats',
            sparkline: b2cSeries.slice(-12),
          },
          {
            key: 'arpu',
            label: 'Blended Subscriber ARPU',
            value: '₵48.60',
            rawValue: 48.6,
            changePercent: 6.1,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Monthly revenue per active user',
            sparkline: [42, 43.5, 44.1, 45.2, 46.0, 46.8, 47.4, 48.6],
          },
        ],
        charts: [
          {
            id: 'rev-stacked-area',
            title: 'Revenue Composition Over Time',
            subtitle: 'Stacked GHS contribution by GNP monetization pillar',
            chartTypeBadge: 'Stacked Area',
            span: 'two-thirds',
            height: 320,
            option: {
              color: GNP_PALETTE,
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: valueYAxis('GHS (₵)', '₵'),
              series: [
                {
                  name: 'B2C Subscriptions',
                  type: 'line',
                  stack: 'rev',
                  smooth: true,
                  showSymbol: false,
                  areaStyle: { color: areaGradient('#dc2626', 0.45, 0.08) },
                  data: b2cSeries,
                },
                {
                  name: 'B2B Partner Contracts',
                  type: 'line',
                  stack: 'rev',
                  smooth: true,
                  showSymbol: false,
                  areaStyle: { color: areaGradient('#2563eb', 0.45, 0.08) },
                  data: b2bSeries,
                },
                {
                  name: 'Single-Copy Sales',
                  type: 'line',
                  stack: 'rev',
                  smooth: true,
                  showSymbol: false,
                  areaStyle: { color: areaGradient('#059669', 0.45, 0.08) },
                  data: singleCopySeries,
                },
                {
                  name: 'Archive & RAG Dossiers',
                  type: 'line',
                  stack: 'rev',
                  smooth: true,
                  showSymbol: false,
                  areaStyle: { color: areaGradient('#d97706', 0.45, 0.08) },
                  data: archiveDossierSeries,
                },
              ],
            },
          },
          {
            id: 'rev-stream-donut',
            title: 'Revenue Share by Pillar',
            subtitle: 'Proportional revenue distribution across streams',
            chartTypeBadge: 'Donut Breakdown',
            span: 'third',
            height: 320,
            option: {
              color: GNP_PALETTE,
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>₵{c}</b> ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  name: 'Revenue Stream',
                  type: 'pie',
                  radius: ['46%', '72%'],
                  center: ['50%', '44%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold' } },
                  data: [
                    { name: 'B2C Subscriptions', value: totalB2c },
                    { name: 'B2B Partners', value: totalB2b },
                    { name: 'Single-Copy Editions', value: totalSingle },
                    { name: 'Archive & AI Dossiers', value: totalArchive },
                  ],
                },
              ],
            },
          },
          {
            id: 'rev-pub-contribution',
            title: 'Attributed Revenue by Graphic Publication Brand',
            subtitle: 'Combined single-copy + subscription entitlement weight per brand',
            chartTypeBadge: 'Horizontal Bar',
            span: 'full',
            height: 260,
            option: {
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              grid: { top: 20, left: 16, right: 28, bottom: 24, containLabel: true },
              xAxis: valueYAxis('', '₵'),
              yAxis: {
                type: 'category',
                inverse: true,
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: { color: '#334155', fontWeight: 600, fontSize: 12 },
                data: GRAPHIC_PUBLICATIONS.map((p) => p.name),
              },
              series: [
                {
                  name: 'Revenue (GHS)',
                  type: 'bar',
                  barMaxWidth: 22,
                  itemStyle: { color: barGradient('#dc2626', '#ef4444'), borderRadius: [0, 6, 6, 0] },
                  data: [0.36, 0.24, 0.14, 0.11, 0.09, 0.06].map((w) => Math.round(totalGross * w)),
                },
              ],
            },
          },
        ],
        tableTitle: 'Revenue Stream Ledger by Period',
        tableSubtitle: 'Reconciled gross collections, Paystack gateway charges, and net bank settlement in GHS',
        columns: [
          { key: 'period', label: 'Period Date', format: 'date' },
          { key: 'b2cSubscriptions', label: 'B2C Plans', align: 'right', format: 'currency' },
          { key: 'b2bPartnerBilling', label: 'B2B Partners', align: 'right', format: 'currency' },
          { key: 'singleCopySales', label: 'Single Copies', align: 'right', format: 'currency' },
          { key: 'archiveAndRag', label: 'Archives / RAG', align: 'right', format: 'currency' },
          { key: 'grossRevenue', label: 'Gross Total', align: 'right', format: 'currency' },
          { key: 'gatewayFees', label: 'Gateway Fee', align: 'right', format: 'currency' },
          { key: 'netSettlement', label: 'Net Settled', align: 'right', format: 'currency' },
        ],
        rows: [...rows].reverse(),
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/sales-revenue',
          controllerMethod: 'ReportsController::generateSalesRevenueReport',
          serviceMethod: 'ReportingService::getSalesRevenueOverview(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'plan', 'granularity'],
          existingTables: [
            { table: 'payments', modelClass: 'drogon_model::Gnp::Payments', usedColumns: ['id', 'amount_paid', 'package_name', 'status', 'created_at'] },
            { table: 'partner_invoice_payments', modelClass: 'drogon_model::Gnp::PartnerInvoicePayments', usedColumns: ['amount_paid', 'payment_date', 'payment_status'] },
            { table: 'subscription_renewal_history', modelClass: 'drogon_model::Gnp::SubscriptionRenewalHistory', usedColumns: ['amount_paid', 'subscription_plan_id', 'created_at'] },
          ],
          schemaGaps: [
            '`payments` currently lacks `payment_type`, `subscription_plan_id`, `gateway_fee`, and `net_amount`, forcing fragile string matching on `package_name`.',
          ],
          recommendedTables: [
            {
              table: 'public.payments (ALTER)',
              changeType: 'alter_table',
              summary: 'Add `payment_type`, `payment_channel`, `gateway_fee`, `net_amount`, `subscription_plan_id`, `newspaper_id`, `partner_id`.',
              keyColumns: ['payment_type', 'gateway_fee', 'net_amount', 'subscription_plan_id'],
              ddlSnippet: "ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_type VARCHAR(40) NOT NULL DEFAULT 'subscription_new', ADD COLUMN IF NOT EXISTS gateway_fee NUMERIC(12,2) NOT NULL DEFAULT 0, ADD COLUMN IF NOT EXISTS net_amount NUMERIC(12,2);",
            },
          ],
          sampleSqlQuery: `SELECT DATE_TRUNC($3, p.created_at)::date AS bucket_date,
       SUM(p.amount_paid) FILTER (WHERE p.payment_type IN ('subscription_new', 'subscription_renewal')) AS b2c_subscriptions,
       COALESCE(SUM(pip.amount_paid), 0) AS b2b_partner_billing,
       SUM(p.amount_paid) FILTER (WHERE p.payment_type IN ('single_copy', 'guest_onetime')) AS single_copy_sales,
       SUM(p.amount_paid) FILTER (WHERE p.payment_type IN ('archive_credit', 'pdf_dossier')) AS archive_and_rag,
       SUM(p.amount_paid) AS gross_revenue,
       SUM(p.gateway_fee) AS gateway_fees,
       SUM(COALESCE(p.net_amount, p.amount_paid - p.gateway_fee)) AS net_settlement
FROM public.payments p
LEFT JOIN public.partner_invoice_payments pip ON DATE_TRUNC($3, pip.payment_date) = DATE_TRUNC($3, p.created_at)
WHERE p.status = 'SUCCESS' AND p.created_at BETWEEN $1 AND $2
GROUP BY bucket_date ORDER BY bucket_date ASC;`,
        },
      };
    }

    // =========================================================================
    // 2. PAYMENT TRANSACTIONS LOG
    // =========================================================================
    case 'payment_transactions': {
      const ghanaBuyers = [
        ['Kwame Mensah', 'kwame.mensah@gmail.com'],
        ['Abena Osei-Bonsu', 'abena.osei@ug.edu.gh'],
        ['Kofi Boateng', 'kboateng@gcbbank.com.gh'],
        ['Ama Serwaa Darko', 'ama.serwaa@outlook.com'],
        ['Nii Armah Tetteh', 'nii.tetteh@mtn.com.gh'],
        ['Efua Quansah', 'efua.quansah@yahoo.com'],
        ['Yaw Asamoah', 'yaw.asamoah@stanbic.com.gh'],
        ['Adwoa Pokua Nyamekye', 'apokua@graphic.com.gh'],
        ['Kojo Antwi-Boasiako', 'kojo.antwi@gmail.com'],
        ['Akua Mansa Agyeman', 'akua.agyeman@telecel.com.gh'],
        ['Selorm Gbeho', 'selorm.gbeho@ecobank.com'],
        ['Nana Yaa Konadu', 'nykonadu@vra.com'],
      ];
      const channels = ['MTN MoMo', 'MTN MoMo', 'Telecel Cash', 'Visa / Mastercard', 'AT Money', 'Paystack Subaccount'];
      const packages = ['Premium Monthly Plan', 'Daily Graphic Single Copy', 'Corporate Annual Seat', 'Standard Monthly Plan', 'Graphic Business Single Copy', 'Archive Research Credit Pack'];

      const settledSeries = win.buckets.map((b) => Math.round((3800 + rng() * 1900) * b.daysInBucket));
      const failedCountSeries = win.buckets.map((b) => Math.max(1, Math.round((3 + rng() * 7) * b.daysInBucket)));

      const allTxRows = Array.from({ length: 18 }, (_, i) => {
        const [userName, userEmail] = ghanaBuyers[i % ghanaBuyers.length];
        const statusPool = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'FAILED', 'PENDING'];
        const rawStatus = statusPool[(i + Math.floor(rng() * 3)) % statusPool.length];
        const channel = channels[i % channels.length];
        const pkg = packages[i % packages.length];
        const amount = pkg.includes('Corporate') ? 480 : pkg.includes('Premium') ? 95 : pkg.includes('Credit') ? 250 : pkg.includes('Standard') ? 55 : 12;
        return {
          createdAt: dayjs(win.endDate).subtract(i * Math.max(1, Math.floor(win.totalDays / 18)), 'day').hour(8 + (i % 12)).minute((i * 13) % 60).format('YYYY-MM-DD HH:mm'),
          receiptNo: `RCP-2026-${(84120 + i).toString()}`,
          transactionReference: `PSK-GH-${(9910420 + i * 37).toString()}`,
          userName,
          userEmail,
          packageName: pkg,
          channel,
          amountPaid: amount,
          status: rawStatus,
        };
      }).filter((row) => {
        if (!dto.status || dto.status === 'all') return true;
        if (dto.status === 'active') return row.status === 'COMPLETED';
        if (dto.status === 'inactive') return row.status === 'FAILED';
        return row.status.toLowerCase() === dto.status.toLowerCase();
      });

      const totalSettled = settledSeries.reduce((a, b) => a + b, 0);
      const totalFailedCount = failedCountSeries.reduce((a, b) => a + b, 0);

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Processed ${fmtInt(Math.round(totalSettled / 62))} payment attempts totaling ${fmtGhs(totalSettled)} in verified settlements with a 96.4% Paystack authorization rate. Mobile Money (MTN MoMo + Telecel Cash + AT Money) accounts for 68% of transaction volume across Ghana.`,
        kpis: [
          {
            key: 'settled_vol',
            label: 'Verified Payment Volume',
            value: fmtCompactGhs(totalSettled),
            rawValue: totalSettled,
            changePercent: 12.4,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Paystack + Bank settled',
            sparkline: settledSeries.slice(-12),
          },
          {
            key: 'auth_rate',
            label: 'Gateway Success Rate',
            value: '96.4%',
            rawValue: 96.4,
            changePercent: 1.8,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'First-attempt completion',
            sparkline: [94.8, 95.1, 95.5, 95.9, 96.2, 96.4],
          },
          {
            key: 'failed_tx',
            label: 'Failed / Abandoned Attempts',
            value: fmtInt(totalFailedCount),
            rawValue: totalFailedCount,
            changePercent: -8.3,
            changeDirection: 'down',
            positiveIsGood: false,
            subtitle: 'Down from prior window',
            sparkline: failedCountSeries.slice(-12),
            sparklineType: 'bar',
          },
          {
            key: 'momo_share',
            label: 'Mobile Money Share',
            value: '68.0%',
            rawValue: 68,
            changePercent: 4.1,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'MTN MoMo leads at 51%',
            sparkline: [62, 64, 65, 66, 67, 68],
          },
        ],
        charts: [
          {
            id: 'tx-combo',
            title: 'Daily Settled Volume vs Failed Attempts',
            subtitle: 'Dual-axis view tracking settlement throughput against Paystack failures',
            chartTypeBadge: 'Bar + Line Dual Axis',
            span: 'two-thirds',
            height: 310,
            option: {
              color: ['#059669', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: DUAL_AXIS_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: [valueYAxis('Settled (₵)', '₵'), valueYAxis('Failed Tx')],
              series: [
                {
                  name: 'Settled Volume (GHS)',
                  type: 'bar',
                  barMaxWidth: 20,
                  itemStyle: { color: barGradient('#059669', '#10b981'), borderRadius: [4, 4, 0, 0] },
                  data: settledSeries,
                },
                {
                  name: 'Failed Attempts',
                  type: 'line',
                  yAxisIndex: 1,
                  smooth: true,
                  lineStyle: { width: 2.5 },
                  data: failedCountSeries,
                },
              ],
            },
          },
          {
            id: 'tx-channel-pie',
            title: 'Payment Method Mix',
            subtitle: 'Share of settled value by payment rail',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 310,
            option: {
              color: ['#eab308', '#dc2626', '#2563eb', '#7c3aed', '#0891b2'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{d}%</b> (₵{c})' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'MTN MoMo', value: Math.round(totalSettled * 0.51) },
                    { name: 'Visa / Mastercard', value: Math.round(totalSettled * 0.22) },
                    { name: 'Telecel Cash', value: Math.round(totalSettled * 0.12) },
                    { name: 'Paystack Subaccount', value: Math.round(totalSettled * 0.1) },
                    { name: 'AT Money', value: Math.round(totalSettled * 0.05) },
                  ],
                },
              ],
            },
          },
        ],
        tableTitle: 'Payment Ledger (`public.payments`)',
        tableSubtitle: 'Individual Paystack & bank transactions filtered by selected date range and status',
        columns: [
          { key: 'createdAt', label: 'Timestamp' },
          { key: 'receiptNo', label: 'Receipt #', format: 'code' },
          { key: 'transactionReference', label: 'Paystack Ref', format: 'code' },
          { key: 'userName', label: 'Customer' },
          { key: 'packageName', label: 'Package / Item' },
          { key: 'channel', label: 'Channel' },
          { key: 'amountPaid', label: 'Amount', align: 'right', format: 'currency' },
          { key: 'status', label: 'Status', align: 'center', format: 'badge' },
        ],
        rows: allTxRows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/payment-transactions',
          controllerMethod: 'ReportsController::generatePaymentTransactionsReport',
          serviceMethod: 'ReportingService::getPaymentTransactionsLog(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'status', 'plan', 'pageNo', 'pageSize'],
          existingTables: [
            { table: 'payments', modelClass: 'drogon_model::Gnp::Payments', usedColumns: ['id', 'user_id', 'user_name', 'user_email', 'package_name', 'amount_paid', 'receipt_no', 'transaction_reference', 'status', 'created_at'] },
            { table: 'purchase_attempts', modelClass: 'drogon_model::Gnp::PurchaseAttempts', usedColumns: ['attempt_reference', 'status', 'failure_reason'] },
          ],
          schemaGaps: [
            '`payments` does not persist Paystack `channel` (`mobile_money`, `card`) or `bank`/`provider` returned inside `VerifyPayResponse.h`.',
          ],
          recommendedTables: [
            {
              table: 'public.payments (ALTER)',
              changeType: 'alter_table',
              summary: 'Persist `payment_channel`, `payment_provider`, and `gateway_fee` during `SubscriptionService` payment verification.',
              keyColumns: ['payment_channel', 'payment_provider', 'gateway_fee'],
              ddlSnippet: 'ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_channel VARCHAR(40), ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50);',
            },
          ],
          sampleSqlQuery: `SELECT id, user_name, user_email, package_name, payment_channel, payment_provider,
       amount_paid, gateway_fee, receipt_no, transaction_reference, status, created_at
FROM public.payments
WHERE created_at BETWEEN $1 AND $2
  AND ($3 = '' OR LOWER(status) = LOWER($3))
ORDER BY created_at DESC LIMIT $4 OFFSET $5;`,
        },
      };
    }

    // =========================================================================
    // 3. PARTNER INVOICES & TAX STATEMENT
    // =========================================================================
    case 'partner_invoices': {
      const enrolledSeats = selectedPartner.subscriberQuota - selectedPartner.remainingQuota;
      const unitSeatPrice = selectedPartner.accountType.includes('Telco') ? 18.5 : 26.0;
      const apiOverageCalls = Math.round(12 + rng() * 24);
      const archivePackQty = selectedPartner.name.includes('University') ? 8 : 3;

      const items = [
        {
          description: `${selectedPartner.defaultSubscriptionPlanName} — Active Corporate Seats`,
          details: `Contracted quota ${fmtInt(selectedPartner.subscriberQuota)} seats • ${fmtInt(enrolledSeats)} enrolled members`,
          quantity: enrolledSeats,
          unitPrice: unitSeatPrice,
          amount: Math.round(enrolledSeats * unitSeatPrice * 100) / 100,
        },
        {
          description: 'Dedicated Partner B2B API Provisioning & Webhook SLA',
          details: `High-throughput subscriber onboarding & entitlement status checks (${apiOverageCalls}k extra bursts)`,
          quantity: apiOverageCalls,
          unitPrice: 45,
          amount: apiOverageCalls * 45,
        },
        {
          description: 'Graphic Digital Archive & Research Intelligence Pack',
          details: 'Institutional OCR full-text & cited RAG research access allocation',
          quantity: archivePackQty,
          unitPrice: 350,
          amount: archivePackQty * 350,
        },
      ];

      const subtotal = Math.round(items.reduce((s, it) => s + it.amount, 0) * 100) / 100;
      const vat = Math.round(subtotal * 0.15 * 100) / 100;
      const getflNhil = Math.round(subtotal * 0.05 * 100) / 100;
      const discount = subtotal > 25000 ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
      // Fixes bug in CommercialPartnerService.cc:3679 so totalDue accurately includes NHIL+GETFund and subtracts discount!
      const totalDue = Math.round((subtotal + vat + getflNhil - discount) * 100) / 100;
      const amountPaid = Math.round(totalDue * 0.65 * 100) / 100;
      const balanceDue = Math.round((totalDue - amountPaid) * 100) / 100;

      const invoiceDoc: PartnerInvoiceDocument = {
        invoiceNo: `INV-${dayjs(win.endDate).format('YYYYMM')}-${selectedPartner.partnerIdentifier}`,
        date: dayjs().format('DD MMM YYYY'),
        dueDate: dayjs().add(14, 'day').format('DD MMM YYYY'),
        status: balanceDue > 0 ? 'PARTIALLY_PAID' : 'PAID',
        billingPeriod: `${dayjs(win.startDate).format('DD MMM YYYY')} – ${dayjs(win.endDate).format('DD MMM YYYY')}`,
        billedTo: {
          partnerId: selectedPartner.id,
          name: selectedPartner.name,
          identifier: selectedPartner.partnerIdentifier,
          contactName: selectedPartner.contactName,
          address: `Corporate Headquarters, Ridge / Airport City, Accra, Ghana`,
          email: selectedPartner.billingEmail,
          phone: selectedPartner.contactPhone,
          currency: selectedPartner.currency || 'GHS',
        },
        items,
        subtotal,
        vat,
        getflNhil,
        discount,
        amountPaid,
        totalDue,
        balanceDue,
      };

      const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const billedHist = months.map((_, idx) => Math.round(totalDue * (0.82 + idx * 0.036 + rng() * 0.04)));
      const collectedHist = billedHist.map((v, idx) => (idx < 4 ? v : Math.round(v * (idx === 4 ? 0.92 : 0.65))));

      const allPartnerLedger = MOCK_COMMERCIAL_PARTNERS.map((p, idx) => {
        const seats = p.subscriberQuota - p.remainingQuota;
        const invAmt = Math.round(seats * (idx === 0 ? 18.5 : 25) * 1.2);
        const statuses = ['PAID', 'PARTIALLY_PAID', 'PAID', 'PENDING', 'PAID', 'OVERDUE'];
        const st = statuses[idx % statuses.length];
        const bal = st === 'PAID' ? 0 : st === 'PARTIALLY_PAID' ? Math.round(invAmt * 0.35) : invAmt;
        return {
          invoiceNumber: `INV-202610-${p.partnerIdentifier}`,
          partnerName: p.name,
          billingEmail: p.billingEmail,
          activeSeats: seats,
          invoiceAmount: invAmt,
          amountPaid: invAmt - bal,
          balance: bal,
          dueDate: dayjs(win.endDate).add(14 - idx * 5, 'day').format('YYYY-MM-DD'),
          status: st,
        };
      });

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Generated GRA-compliant tax invoice ${invoiceDoc.invoiceNo} for ${selectedPartner.name} totaling ${fmtGhs(totalDue)} (inclusive of 15% VAT and 5% NHIL + GETFund levies across ${fmtInt(enrolledSeats)} enrolled corporate seats). Outstanding balance stands at ${fmtGhs(balanceDue)}.`,
        kpis: [
          {
            key: 'inv_total',
            label: 'Total Invoice Amount',
            value: fmtCompactGhs(totalDue),
            rawValue: totalDue,
            changePercent: 8.6,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: `Invoice ${invoiceDoc.invoiceNo}`,
            sparkline: billedHist,
          },
          {
            key: 'tax_levies',
            label: 'VAT (15%) + NHIL/GETFL (5%)',
            value: fmtCompactGhs(vat + getflNhil),
            rawValue: vat + getflNhil,
            changePercent: 8.6,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Statutory GRA levies',
            sparkline: billedHist.map((x) => Math.round(x * 0.17)),
          },
          {
            key: 'collected_amt',
            label: 'Payments Reconciled',
            value: fmtCompactGhs(amountPaid),
            rawValue: amountPaid,
            changePercent: 11.2,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Settled via GCB / Paystack',
            sparkline: collectedHist,
          },
          {
            key: 'outstanding_bal',
            label: 'Balance Receivable',
            value: fmtCompactGhs(balanceDue),
            rawValue: balanceDue,
            changePercent: -14.5,
            changeDirection: 'down',
            positiveIsGood: false,
            subtitle: `Due ${invoiceDoc.dueDate}`,
            sparkline: [52, 48, 44, 39, 35, 31],
          },
        ],
        charts: [
          {
            id: 'partner-billing-history',
            title: `${selectedPartner.name} — 6-Month Invoiced vs Collected Trend`,
            subtitle: 'Compares monthly B2B invoices generated against settled payments (`partner_invoice_payments`)',
            chartTypeBadge: 'Grouped Bar',
            span: 'two-thirds',
            height: 290,
            option: {
              color: ['#dc2626', '#059669'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(months),
              yAxis: valueYAxis('GHS (₵)', '₵'),
              series: [
                {
                  name: 'Invoiced Total',
                  type: 'bar',
                  barMaxWidth: 22,
                  itemStyle: { borderRadius: [5, 5, 0, 0] },
                  data: billedHist,
                },
                {
                  name: 'Collected Payment',
                  type: 'bar',
                  barMaxWidth: 22,
                  itemStyle: { borderRadius: [5, 5, 0, 0] },
                  data: collectedHist,
                },
              ],
            },
          },
          {
            id: 'invoice-composition-pie',
            title: 'Invoice Cost & Tax Breakdown',
            subtitle: 'Net services vs statutory GRA levies',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 290,
            option: {
              color: ['#2563eb', '#dc2626', '#d97706', '#0891b2'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>₵{c}</b> ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['44%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'Seat Subscriptions', value: items[0].amount },
                    { name: 'GRA VAT (15%)', value: vat },
                    { name: 'NHIL + GETFund (5%)', value: getflNhil },
                    { name: 'API & Archive Add-ons', value: items[1].amount + items[2].amount },
                  ],
                },
              ],
            },
          },
        ],
        tableTitle: 'All Commercial Partner Invoices Aging Summary',
        tableSubtitle: 'Cross-partner receivables across `partner_invoices` & `partner_invoice_payments`',
        columns: [
          { key: 'invoiceNumber', label: 'Invoice #', format: 'code' },
          { key: 'partnerName', label: 'Commercial Partner' },
          { key: 'activeSeats', label: 'Billed Seats', align: 'right', format: 'number' },
          { key: 'invoiceAmount', label: 'Invoiced (GHS)', align: 'right', format: 'currency' },
          { key: 'amountPaid', label: 'Paid (GHS)', align: 'right', format: 'currency' },
          { key: 'balance', label: 'Balance Due', align: 'right', format: 'currency' },
          { key: 'dueDate', label: 'Due Date', format: 'date' },
          { key: 'status', label: 'Status', align: 'center', format: 'badge' },
        ],
        rows: allPartnerLedger,
        invoice: invoiceDoc,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/partner-invoice',
          controllerMethod: 'ReportsController::generatePartnerInvoice',
          serviceMethod: 'CommercialPartnerService::getPartnerInvoiceGenerationReport(const ReportDto &dto)',
          cppDtoFields: ['partnerId', 'startDate', 'endDate', 'status'],
          existingTables: [
            { table: 'commercial_partners', modelClass: 'drogon_model::Gnp::CommercialPartners', usedColumns: ['id', 'name', 'billing_email', 'subscriber_quota', 'remaining_quota', 'cost_per_head', 'currency'] },
            { table: 'partner_invoices', modelClass: 'drogon_model::Gnp::PartnerInvoices', usedColumns: ['invoice_number', 'unit_price', 'invoice_amount', 'balance', 'due_date', 'status'] },
            { table: 'partner_invoice_payments', modelClass: 'drogon_model::Gnp::PartnerInvoicePayments', usedColumns: ['invoice_id', 'amount_paid', 'payment_date', 'payment_method'] },
          ],
          schemaGaps: [
            'BUG FIX NEEDED in `CommercialPartnerService.cc:3679`: change `totalDue = subtotal + vat` to `subtotal + vat + getflNhil - discount`.',
            'BUG FIX NEEDED in `ReportsController.cc:51`: wire `sendPartnerInvoiceEmail` to `sendPartnerInvoiceByMail(dto)`.',
          ],
          recommendedTables: [],
          sampleSqlQuery: `SELECT pi.id, pi.invoice_number, pi.unit_price, pi.invoice_amount, pi.balance, pi.status, pi.due_date,
       COALESCE(SUM(pip.amount_paid), 0) AS settled_amount
FROM public.partner_invoices pi
LEFT JOIN public.partner_invoice_payments pip ON pip.invoice_id = pi.id AND pip.payment_status = 'COMPLETED'
WHERE pi.partner_id = $1 AND pi.created_at BETWEEN $2 AND $3
GROUP BY pi.id ORDER BY pi.created_at DESC;`,
        },
      };
    }

    // =========================================================================
    // 4. SUBSCRIPTION RENEWALS & CHURN
    // =========================================================================
    case 'subscription_renewals': {
      const openingMrr = Math.round(168400 * planScale);
      const newMrr = Math.round(28400 * planScale);
      const expansionMrr = Math.round(9600 * planScale);
      const contractionMrr = Math.round(3100 * planScale);
      const voluntaryChurnMrr = Math.round(4800 * planScale);
      const involuntaryChurnMrr = Math.round(3900 * planScale);
      const closingMrr = openingMrr + newMrr + expansionMrr - contractionMrr - voluntaryChurnMrr - involuntaryChurnMrr;

      // ECharts Waterfall assist series
      const waterfallBase = [
        0,
        openingMrr,
        openingMrr + newMrr,
        openingMrr + newMrr + expansionMrr - contractionMrr,
        openingMrr + newMrr + expansionMrr - contractionMrr - voluntaryChurnMrr,
        openingMrr + newMrr + expansionMrr - contractionMrr - voluntaryChurnMrr - involuntaryChurnMrr,
        0,
      ];
      const waterfallValues = [
        openingMrr,
        newMrr,
        expansionMrr,
        contractionMrr,
        voluntaryChurnMrr,
        involuntaryChurnMrr,
        closingMrr,
      ];
      const waterfallColors = ['#475569', '#059669', '#2563eb', '#f59e0b', '#dc2626', '#e11d48', '#0f172a'];

      const renewalsSeries = win.buckets.map((b) => Math.round((42 + rng() * 19) * b.daysInBucket * planScale));
      const churnSeries = win.buckets.map((b) => Math.max(1, Math.round((4 + rng() * 5) * b.daysInBucket * planScale)));

      const rows = win.buckets.map((b, i) => {
        const renewed = renewalsSeries[i];
        const churned = churnSeries[i];
        const churnRate = Number(((churned / Math.max(renewed + churned, 1)) * 100).toFixed(1));
        return {
          date: b.isoDate,
          renewalsCount: renewed,
          churnedCount: churned,
          renewalRevenue: renewed * 68,
          netMrrDelta: renewed * 68 - churned * 62,
          churnRate,
          dunningRecovered: Math.max(1, Math.round(churned * 0.42)),
        };
      });

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Net Monthly Recurring Revenue expanded from ${fmtGhs(openingMrr)} to ${fmtGhs(closingMrr)} (+${(((closingMrr - openingMrr) / openingMrr) * 100).toFixed(1)}% Net MRR Growth). Gross logo churn stands at 2.3%, with 44.8% of churn stemming from involuntary failed Mobile Money renewals recoverable via pre-expiry Hubtel SMS dunning.`,
        kpis: [
          {
            key: 'closing_mrr',
            label: 'Closing Active MRR',
            value: fmtCompactGhs(closingMrr),
            rawValue: closingMrr,
            changePercent: 15.6,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: `+${fmtCompactGhs(closingMrr - openingMrr)} net expansion`,
            sparkline: [168, 173, 179, 184, 190, 194.6],
          },
          {
            key: 'renewal_rate',
            label: 'On-Time Renewal Rate',
            value: '91.8%',
            rawValue: 91.8,
            changePercent: 2.4,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Auto-renew + manual renewals',
            sparkline: renewalsSeries.slice(-12),
          },
          {
            key: 'logo_churn',
            label: 'Monthly Churn Rate',
            value: '2.3%',
            rawValue: 2.3,
            changePercent: -0.6,
            changeDirection: 'down',
            positiveIsGood: false,
            subtitle: 'Improved from 2.9% last month',
            sparkline: [3.1, 2.9, 2.8, 2.6, 2.5, 2.3],
          },
          {
            key: 'nrr',
            label: 'Net Revenue Retention (NRR)',
            value: '103.8%',
            rawValue: 103.8,
            changePercent: 1.9,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Upgrades outweigh contractions',
            sparkline: [100.4, 101.2, 102.0, 102.9, 103.8],
          },
        ],
        charts: [
          {
            id: 'mrr-waterfall',
            title: 'MRR Movement Waterfall (GHS)',
            subtitle: 'Decomposes Opening MRR into New, Expansion, Contraction, Voluntary & Involuntary Churn',
            chartTypeBadge: 'Waterfall',
            span: 'two-thirds',
            height: 310,
            option: {
              tooltip: {
                ...BASE_TOOLTIP,
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: any[]) => {
                  const p = params.find((x) => x.seriesName === 'MRR Component') || params[0];
                  return `<b>${p.name}</b><br/>Amount: <b>₵${Number(p.value).toLocaleString()}</b>`;
                },
              },
              grid: BASE_GRID,
              xAxis: categoryXAxis(['Opening MRR', '+ New MRR', '+ Upgrades', '- Downgrades', '- Voluntary', '- Failed Pay', 'Closing MRR']),
              yAxis: valueYAxis('MRR (₵)', '₵'),
              series: [
                {
                  name: 'Base',
                  type: 'bar',
                  stack: 'mrr',
                  silent: true,
                  itemStyle: { borderColor: 'transparent', color: 'transparent' },
                  emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
                  data: waterfallBase,
                },
                {
                  name: 'MRR Component',
                  type: 'bar',
                  stack: 'mrr',
                  barMaxWidth: 34,
                  data: waterfallValues.map((val, idx) => ({
                    value: val,
                    itemStyle: { color: waterfallColors[idx], borderRadius: [4, 4, 0, 0] },
                  })),
                },
              ],
            },
          },
          {
            id: 'churn-reasons-donut',
            title: 'Churn Root-Cause Breakdown',
            subtitle: 'Voluntary cancellations vs involuntary payment failures',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 310,
            option: {
              color: ['#dc2626', '#f59e0b', '#2563eb', '#7c3aed', '#64748b'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{d}%</b> ({c} subs)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'Failed MoMo / Card Dunning', value: 86 },
                    { name: 'Price Sensitivity', value: 44 },
                    { name: 'Moved to Corporate Partner', value: 29 },
                    { name: 'Switched to Single-Copy', value: 21 },
                    { name: 'Seasonal / Other', value: 12 },
                  ],
                },
              ],
            },
          },
          {
            id: 'renewals-vs-churn-trend',
            title: 'Renewals vs Churned Subscriptions Trend',
            subtitle: 'Period-by-period volume comparison',
            chartTypeBadge: 'Smooth Dual Line',
            span: 'full',
            height: 260,
            option: {
              color: ['#059669', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: valueYAxis('Subscribers'),
              series: [
                { name: 'Successful Renewals', type: 'line', smooth: true, areaStyle: { color: areaGradient('#059669') }, data: renewalsSeries },
                { name: 'Churned Subscriptions', type: 'line', smooth: true, areaStyle: { color: areaGradient('#dc2626') }, data: churnSeries },
              ],
            },
          },
        ],
        tableTitle: 'Subscription Renewal & Churn Period Breakdown',
        columns: [
          { key: 'date', label: 'Period Date', format: 'date' },
          { key: 'renewalsCount', label: 'Renewed Subs', align: 'right', format: 'number' },
          { key: 'churnedCount', label: 'Churned Subs', align: 'right', format: 'number' },
          { key: 'dunningRecovered', label: 'Dunning Recovered', align: 'right', format: 'number' },
          { key: 'renewalRevenue', label: 'Renewal Cash (GHS)', align: 'right', format: 'currency' },
          { key: 'netMrrDelta', label: 'Net MRR Delta', align: 'right', format: 'currency' },
          { key: 'churnRate', label: 'Churn %', align: 'right', format: 'percent' },
        ],
        rows: [...rows].reverse(),
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/subscription-renewals',
          controllerMethod: 'ReportsController::generateSubscriptionRenewalsReport',
          serviceMethod: 'ReportingService::getSubscriptionRenewalsAndChurn(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'plan', 'granularity'],
          existingTables: [
            { table: 'subscription_renewal_history', modelClass: 'drogon_model::Gnp::SubscriptionRenewalHistory', usedColumns: ['subscription_plan_name', 'past_billing_cycle', 'current_billing_cycle', 'transaction_status', 'amount_paid', 'created_at'] },
            { table: 'user_subscriptions', modelClass: 'drogon_model::Gnp::UserSubscriptions', usedColumns: ['id', 'is_active', 'start_date', 'end_date', 'billing_cycle'] },
          ],
          schemaGaps: [
            '`user_subscriptions` has no `cancelled_at`, `cancellation_type`, or `churn_reason`, and no lifecycle event table records upgrades/downgrades vs involuntary churn.',
          ],
          recommendedTables: [
            {
              table: 'public.subscription_lifecycle_events',
              changeType: 'new_table',
              summary: 'Append-only MRR event log (`activated`, `renewed`, `upgraded`, `downgraded`, `churned_voluntary`, `churned_involuntary`).',
              keyColumns: ['subscription_id', 'event_type', 'mrr_delta', 'reason_code', 'occurred_at'],
              ddlSnippet: 'CREATE TABLE IF NOT EXISTS public.subscription_lifecycle_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), subscription_id UUID NOT NULL REFERENCES public.user_subscriptions(id), event_type VARCHAR(40) NOT NULL, mrr_delta NUMERIC(12,2) NOT NULL, reason_code VARCHAR(100), occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW());',
            },
          ],
          sampleSqlQuery: `SELECT event_type, COUNT(*) AS events_count, SUM(mrr_delta) AS total_mrr_impact
FROM public.subscription_lifecycle_events
WHERE occurred_at BETWEEN $1 AND $2
GROUP BY event_type;`,
        },
      };
    }

    // =========================================================================
    // 5. [NEW SUGGESTED] SINGLE-COPY PAYWALL & CHECKOUT FUNNEL
    // =========================================================================
    case 'single_copy_paywall_funnel': {
      const paywallViews = Math.round(48200 * (win.totalDays / 30));
      const checkoutClicks = Math.round(paywallViews * 0.24);
      const paystackInit = Math.round(checkoutClicks * 0.76);
      const settledCopies = Math.round(paystackInit * 0.69);
      const recoveredRevenue = Math.round((paystackInit - settledCopies) * 12 * 0.35);

      const editionRows = GRAPHIC_PUBLICATIONS.map((pub, idx) => {
        const attempts = Math.round((2600 - idx * 340 + rng() * 180) * (win.totalDays / 30));
        const completed = Math.round(attempts * (0.64 + (idx % 3) * 0.05));
        const failed = attempts - completed;
        return {
          publication: pub.name,
          coverPrice: pub.unitPrice,
          attempts,
          completedCopies: completed,
          abandonedOrFailed: failed,
          conversionRate: Number(((completed / Math.max(attempts, 1)) * 100).toFixed(1)),
          guestSharePct: 58 - idx * 4,
          revenueCollected: completed * pub.unitPrice,
        };
      }).filter((r) => !selectedPub || r.publication === selectedPub.name);

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Out of ${fmtInt(paywallViews)} gated edition previews, ${fmtInt(settledCopies)} single-copy purchases completed (${((settledCopies / Math.max(paywallViews, 1)) * 100).toFixed(1)}% end-to-end paywall conversion), with Guest One-Time Checkout driving 54% of volume. Automated WhatsApp/SMS retry links on ${fmtInt(paystackInit - settledCopies)} incomplete ` + '`purchase_attempts`' + ` represent an estimated ${fmtGhs(recoveredRevenue)} immediate recovery opportunity.`,
        kpis: [
          {
            key: 'copies_sold',
            label: 'Single Copies Settled',
            value: fmtInt(settledCopies),
            rawValue: settledCopies,
            changePercent: 19.4,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Guest + Registered one-time buys',
            sparkline: [180, 195, 210, 205, 228, 244, 260],
          },
          {
            key: 'checkout_conv',
            label: 'Paystack Completion Rate',
            value: '69.0%',
            rawValue: 69.0,
            changePercent: 4.2,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Initiated -> Paid conversion',
            sparkline: [63, 64.5, 66, 67.2, 68.1, 69.0],
          },
          {
            key: 'guest_share',
            label: 'Guest One-Time Share',
            value: '54.2%',
            rawValue: 54.2,
            changePercent: 7.1,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'Via /subscription/guest-onetime-buy',
            sparkline: [47, 49, 50, 52, 53, 54.2],
          },
          {
            key: 'recovery_opp',
            label: 'Recoverable Failed Carts',
            value: fmtCompactGhs(recoveredRevenue),
            rawValue: recoveredRevenue,
            changePercent: -5.4,
            changeDirection: 'down',
            positiveIsGood: false,
            subtitle: '35% recoverable via retry prompt',
            sparkline: [4200, 4050, 3900, 3780, 3620],
          },
        ],
        charts: [
          {
            id: 'paywall-funnel-chart',
            title: 'Single-Copy Paywall Conversion Funnel',
            subtitle: 'Reader progression from Redacted Teaser View to Settled Edition Entitlement',
            chartTypeBadge: 'Conversion Funnel',
            span: 'half',
            height: 310,
            option: {
              color: ['#dc2626', '#2563eb', '#d97706', '#059669'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{c}</b> readers' },
              series: [
                {
                  name: 'Paywall Funnel',
                  type: 'funnel',
                  left: '10%',
                  top: 20,
                  bottom: 20,
                  width: '80%',
                  sort: 'descending',
                  gap: 4,
                  label: { show: true, position: 'inside', color: '#fff', fontWeight: 600, fontSize: 11.5 },
                  itemStyle: { borderColor: '#fff', borderWidth: 1, borderRadius: 4 },
                  data: [
                    { name: '1. Redacted Preview Hits', value: paywallViews },
                    { name: '2. Clicked "Buy Copy"', value: checkoutClicks },
                    { name: '3. Paystack Session Init', value: paystackInit },
                    { name: '4. Paid & Unlocked Copy', value: settledCopies },
                  ],
                },
              ],
            },
          },
          {
            id: 'failure-reasons-bar',
            title: 'Checkout Drop-off & Failure Diagnostics',
            subtitle: 'Breakdown of `purchase_attempts.failure_reason`',
            chartTypeBadge: 'Horizontal Bar',
            span: 'half',
            height: 310,
            option: {
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              grid: { top: 20, left: 16, right: 24, bottom: 24, containLabel: true },
              xAxis: valueYAxis('Attempts'),
              yAxis: {
                type: 'category',
                inverse: true,
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: { color: '#334155', fontSize: 11.5 },
                data: ['MoMo Prompt Timeout', 'Abandoned Checkout Modal', 'Insufficient Wallet Funds', 'Card 3DS Declined', 'Network Callback Delay'],
              },
              series: [
                {
                  type: 'bar',
                  barMaxWidth: 20,
                  itemStyle: { color: barGradient('#e11d48', '#fb7185'), borderRadius: [0, 6, 6, 0] },
                  data: [1120, 840, 530, 290, 145].map((v) => Math.round(v * (win.totalDays / 30))),
                },
              ],
            },
          },
        ],
        tableTitle: 'Single-Copy Funnel Performance by Publication Brand',
        columns: [
          { key: 'publication', label: 'Publication' },
          { key: 'coverPrice', label: 'Cover Price', align: 'right', format: 'currency' },
          { key: 'attempts', label: 'Purchase Attempts', align: 'right', format: 'number' },
          { key: 'completedCopies', label: 'Settled Copies', align: 'right', format: 'number' },
          { key: 'abandonedOrFailed', label: 'Failed / Abandoned', align: 'right', format: 'number' },
          { key: 'guestSharePct', label: 'Guest %', align: 'right', format: 'percent' },
          { key: 'conversionRate', label: 'Completion %', align: 'right', format: 'progress' },
          { key: 'revenueCollected', label: 'Revenue (GHS)', align: 'right', format: 'currency' },
        ],
        rows: editionRows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/single-copy-funnel',
          controllerMethod: 'ReportsController::generateSingleCopyFunnelReport',
          serviceMethod: 'ReportingService::getSingleCopyPaywallFunnel(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'publicationId', 'status'],
          existingTables: [
            { table: 'purchase_attempts', modelClass: 'drogon_model::Gnp::PurchaseAttempts', usedColumns: ['newspaper_id', 'user_id', 'amount', 'status', 'failure_reason', 'created_at'] },
            { table: 'newspapers', modelClass: 'drogon_model::Gnp::Newspapers', usedColumns: ['id', 'title', 'publication_id', 'publication_name', 'price', 'views'] },
          ],
          schemaGaps: [
            '`purchase_attempts` currently requires `user_id NOT NULL`, so anonymous guest checkout attempts via `/subscription/guest-onetime-buy` should either allow nullable `user_id` + `guest_email` or log directly into `edition_sales_ledger`.',
          ],
          recommendedTables: [
            {
              table: 'public.edition_sales_ledger',
              changeType: 'new_table',
              summary: 'Records every completed guest and registered single-edition sale with `sold_at`, `is_guest_purchase`, and `payment_id`.',
              keyColumns: ['newspaper_id', 'is_guest_purchase', 'amount_paid', 'sold_at'],
              ddlSnippet: 'CREATE TABLE IF NOT EXISTS public.edition_sales_ledger (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), newspaper_id UUID NOT NULL REFERENCES public.newspapers(id), publication_id UUID NOT NULL REFERENCES public.publications(id), is_guest_purchase BOOLEAN NOT NULL DEFAULT FALSE, amount_paid NUMERIC(10,2) NOT NULL, sold_at TIMESTAMPTZ NOT NULL DEFAULT NOW());',
            },
          ],
          sampleSqlQuery: `SELECT n.publication_name, COUNT(pa.id) AS attempts,
       COUNT(pa.id) FILTER (WHERE pa.status = 'SUCCESS') AS completed_copies,
       COUNT(pa.id) FILTER (WHERE pa.status <> 'SUCCESS') AS failed_attempts,
       COALESCE(SUM(pa.amount) FILTER (WHERE pa.status = 'SUCCESS'), 0) AS revenue_collected
FROM public.purchase_attempts pa
JOIN public.newspapers n ON n.id = pa.newspaper_id
WHERE pa.created_at BETWEEN $1 AND $2
GROUP BY n.publication_name ORDER BY revenue_collected DESC;`,
        },
      };
    }

    // =========================================================================
    // 6. SUBSCRIBER DEMOGRAPHICS & ACCOUNT STATUS
    // =========================================================================
    case 'subscriber_demographics': {
      const signupsSeries = win.buckets.map((b) => Math.round((34 + rng() * 21) * b.daysInBucket));
      const activeSeries = win.buckets.map((_, i) => 11850 + i * 48 + Math.round(rng() * 60));
      const totalSignups = signupsSeries.reduce((a, b) => a + b, 0);

      const geoRows = [
        { country: 'Ghana (Domestic)', flag: 'GH', totalUsers: 14820, activeSubscribers: 8940, passkeyEnabled: 3410, lockedAccounts: 42, conversionRate: 60.3, avgRevenueGhs: 44.5 },
        { country: 'United Kingdom (Diaspora)', flag: 'GB', totalUsers: 3290, activeSubscribers: 2410, passkeyEnabled: 1290, lockedAccounts: 8, conversionRate: 73.3, avgRevenueGhs: 68.0 },
        { country: 'United States (Diaspora)', flag: 'US', totalUsers: 2840, activeSubscribers: 2120, passkeyEnabled: 1180, lockedAccounts: 6, conversionRate: 74.6, avgRevenueGhs: 71.2 },
        { country: 'Germany & EU', flag: 'DE', totalUsers: 1190, activeSubscribers: 830, passkeyEnabled: 410, lockedAccounts: 3, conversionRate: 69.7, avgRevenueGhs: 64.0 },
        { country: 'Canada', flag: 'CA', totalUsers: 860, activeSubscribers: 615, passkeyEnabled: 295, lockedAccounts: 2, conversionRate: 71.5, avgRevenueGhs: 66.4 },
        { country: 'Nigeria & ECOWAS', flag: 'NG', totalUsers: 940, activeSubscribers: 510, passkeyEnabled: 185, lockedAccounts: 5, conversionRate: 54.3, avgRevenueGhs: 39.0 },
      ];

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Platform user base reached 23,940 registered accounts (+${fmtInt(totalSignups)} new signups in window), with 15,425 active subscribers (64.4% activation). While Ghana represents 61.9% of users, UK/US/EU Diaspora readers convert at 73.1% and deliver 53% higher ARPU.`,
        kpis: [
          {
            key: 'total_users',
            label: 'Registered Accounts',
            value: '23,940',
            rawValue: 23940,
            changePercent: 11.4,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: `+${fmtInt(totalSignups)} added in period`,
            sparkline: signupsSeries.slice(-12),
          },
          {
            key: 'active_accounts',
            label: 'Active Verified Users',
            value: '19,810',
            rawValue: 19810,
            changePercent: 9.8,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: '82.7% email/phone verified',
            sparkline: activeSeries.slice(-12),
          },
          {
            key: 'diaspora_share',
            label: 'Diaspora Reader Share',
            value: '38.1%',
            rawValue: 38.1,
            changePercent: 4.5,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: 'UK, US, EU, Canada & ECOWAS',
            sparkline: [33, 34.2, 35.5, 36.8, 37.4, 38.1],
          },
          {
            key: 'passkey_adoption',
            label: 'Passkey (WebAuthn) Users',
            value: '6,770',
            rawValue: 6770,
            changePercent: 28.4,
            changeDirection: 'up',
            positiveIsGood: true,
            subtitle: '28.3% passwordless adoption',
            sparkline: [4100, 4650, 5120, 5780, 6290, 6770],
          },
        ],
        charts: [
          {
            id: 'user-growth-combo',
            title: 'New Signups Velocity & Active Reader Base',
            subtitle: 'Tracks daily onboarding (`users.created_at`) alongside active user progression',
            chartTypeBadge: 'Bar + Area Line',
            span: 'two-thirds',
            height: 310,
            option: {
              color: ['#2563eb', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: DUAL_AXIS_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: [valueYAxis('New Signups'), valueYAxis('Active Base')],
              series: [
                { name: 'New Signups', type: 'bar', barMaxWidth: 18, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: signupsSeries },
                { name: 'Active Users', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 3 }, data: activeSeries },
              ],
            },
          },
          {
            id: 'user-geo-donut',
            title: 'Geographic Audience Split',
            subtitle: 'Domestic Ghana vs international Diaspora markets',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 310,
            option: {
              color: GNP_PALETTE,
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{c}</b> ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['44%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: geoRows.map((g) => ({ name: g.country.split(' (')[0], value: g.totalUsers })),
                },
              ],
            },
          },
        ],
        tableTitle: 'Subscriber Demographics & Auth Posture by Region (`public.users`)',
        columns: [
          { key: 'country', label: 'Country / Region' },
          { key: 'totalUsers', label: 'Registered Users', align: 'right', format: 'number' },
          { key: 'activeSubscribers', label: 'Paid Subscribers', align: 'right', format: 'number' },
          { key: 'passkeyEnabled', label: 'Passkey Enabled', align: 'right', format: 'number' },
          { key: 'lockedAccounts', label: 'Locked Out', align: 'right', format: 'number' },
          { key: 'conversionRate', label: 'Paid Conversion', align: 'right', format: 'progress' },
          { key: 'avgRevenueGhs', label: 'Avg ARPU', align: 'right', format: 'currency' },
        ],
        rows: geoRows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/subscriber-demographics',
          controllerMethod: 'ReportsController::generateSubscriberDemographicsReport',
          serviceMethod: 'ReportingService::getSubscriberDemographics(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'status', 'granularity'],
          existingTables: [
            { table: 'users', modelClass: 'drogon_model::Gnp::Users', usedColumns: ['id', 'country', 'is_active', 'is_locked_out', 'email_verified_at', 'credential_id', 'partner_id', 'created_at', 'last_active'] },
            { table: 'user_subscriptions', modelClass: 'drogon_model::Gnp::UserSubscriptions', usedColumns: ['user_id', 'is_active'] },
          ],
          schemaGaps: [
            '`users.country` is nullable on guest/OTP signups—populate GeoIP fallback on account creation so regional breakdowns have 100% coverage.',
          ],
          recommendedTables: [],
          sampleSqlQuery: `SELECT COALESCE(NULLIF(u.country, ''), 'Ghana') AS country,
       COUNT(u.id) AS total_users,
       COUNT(u.id) FILTER (WHERE u.is_active = TRUE) AS active_users,
       COUNT(u.id) FILTER (WHERE u.credential_id IS NOT NULL) AS passkey_enabled,
       COUNT(u.id) FILTER (WHERE u.is_locked_out = TRUE) AS locked_accounts
FROM public.users u
WHERE u.is_admin_user = FALSE
GROUP BY 1 ORDER BY total_users DESC;`,
        },
      };
    }

    // =========================================================================
    // 7. SUBSCRIPTION PLAN DISTRIBUTION
    // =========================================================================
    case 'plan_distribution': {
      const plans = [
        { key: 'standard', planName: 'Standard Reader Plan', planType: 'B2C Individual', monthlySubs: 3420, quarterlySubs: 890, annualSubs: 640, monthlyPrice: 35, mrrContribution: 221400, churnPct: 3.1 },
        { key: 'premium', planName: 'Premium All-Publications + Archive', planType: 'B2C Power Reader', monthlySubs: 2180, quarterlySubs: 760, annualSubs: 910, monthlyPrice: 65, mrrContribution: 304850, churnPct: 1.9 },
        { key: 'corporate', planName: 'Corporate Partner Seat Bundle', planType: 'B2B Enterprise', monthlySubs: 1950, quarterlySubs: 2400, annualSubs: 7340, monthlyPrice: 24, mrrContribution: 280560, churnPct: 0.8 },
        { key: 'academic', planName: 'Campus & Institutional Research', planType: 'B2B Academic', monthlySubs: 310, quarterlySubs: 520, annualSubs: 1840, monthlyPrice: 19, mrrContribution: 50730, churnPct: 0.6 },
      ].filter((p) => !dto.plan || dto.plan === 'all' || p.key === dto.plan);

      const rows = plans.map((p) => {
        const totalSubs = p.monthlySubs + p.quarterlySubs + p.annualSubs;
        return { ...p, totalSubs };
      });
      const totalAllSubs = rows.reduce((s, r) => s + r.totalSubs, 0);
      const totalMrr = rows.reduce((s, r) => s + r.mrrContribution, 0);

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Across ${fmtInt(totalAllSubs)} active entitlements generating ${fmtGhs(totalMrr)} in normalized MRR, Annual billing cycles account for ${Math.round((rows.reduce((s, r) => s + r.annualSubs, 0) / Math.max(totalAllSubs, 1)) * 100)}% of seats—dramatically compressing churn on Premium (1.9%) and Corporate (0.8%) tiers.`,
        kpis: [
          { key: 'active_entitlements', label: 'Active Plan Seats', value: fmtInt(totalAllSubs), rawValue: totalAllSubs, changePercent: 13.2, changeDirection: 'up', positiveIsGood: true, subtitle: 'B2C + B2B combined', sparkline: [19400, 20200, 21100, 21900, 22600, totalAllSubs] },
          { key: 'plan_mrr', label: 'Total Plan MRR', value: fmtCompactGhs(totalMrr), rawValue: totalMrr, changePercent: 16.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Normalized monthly value', sparkline: [720, 755, 790, 815, 840, 857] },
          { key: 'annual_mix', label: 'Annual Billing Share', value: '46.3%', rawValue: 46.3, changePercent: 5.7, changeDirection: 'up', positiveIsGood: true, subtitle: 'Highest retention lock-in', sparkline: [39, 41, 42.5, 44, 45.1, 46.3] },
          { key: 'top_tier', label: 'Highest Revenue Tier', value: 'Premium All-Access', rawValue: 304850, changePercent: 18.9, changeDirection: 'up', positiveIsGood: true, subtitle: '35.5% of total MRR', sparkline: [240, 258, 271, 285, 296, 305] },
        ],
        charts: [
          {
            id: 'plan-rose-chart',
            title: 'Subscriber Share by Plan Tier',
            subtitle: 'Active subscriber distribution (`user_subscriptions`)',
            chartTypeBadge: 'Nightingale Rose',
            span: 'half',
            height: 310,
            option: {
              color: GNP_PALETTE,
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{c}</b> subscribers ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  roseType: 'radius',
                  radius: ['28%', '70%'],
                  center: ['50%', '44%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: rows.map((r) => ({ name: r.planName, value: r.totalSubs })),
                },
              ],
            },
          },
          {
            id: 'billing-cycle-stacked',
            title: 'Billing Cycle Mix per Plan (Monthly vs Quarterly vs Annual)',
            subtitle: 'Highlights long-term lock-in across each pricing tier',
            chartTypeBadge: 'Stacked Bar',
            span: 'half',
            height: 310,
            option: {
              color: ['#dc2626', '#2563eb', '#059669'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(rows.map((r) => r.planName.split(' ')[0])),
              yAxis: valueYAxis('Subscribers'),
              series: [
                { name: 'Monthly', type: 'bar', stack: 'cycle', barMaxWidth: 32, data: rows.map((r) => r.monthlySubs) },
                { name: 'Quarterly', type: 'bar', stack: 'cycle', barMaxWidth: 32, data: rows.map((r) => r.quarterlySubs) },
                { name: 'Annual', type: 'bar', stack: 'cycle', barMaxWidth: 32, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: rows.map((r) => r.annualSubs) },
              ],
            },
          },
        ],
        tableTitle: 'Subscription Plans Performance Matrix (`subscription_plans` × `user_subscriptions`)',
        columns: [
          { key: 'planName', label: 'Subscription Plan' },
          { key: 'planType', label: 'Segment' },
          { key: 'monthlySubs', label: 'Monthly', align: 'right', format: 'number' },
          { key: 'quarterlySubs', label: 'Quarterly', align: 'right', format: 'number' },
          { key: 'annualSubs', label: 'Annual', align: 'right', format: 'number' },
          { key: 'totalSubs', label: 'Total Active', align: 'right', format: 'number' },
          { key: 'mrrContribution', label: 'Normalized MRR', align: 'right', format: 'currency' },
          { key: 'churnPct', label: 'Monthly Churn', align: 'right', format: 'percent' },
        ],
        rows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/plan-distribution',
          controllerMethod: 'ReportsController::generatePlanDistributionReport',
          serviceMethod: 'ReportingService::getPlanDistribution(const ReportDto &dto)',
          cppDtoFields: ['plan', 'startDate', 'endDate'],
          existingTables: [
            { table: 'subscription_plans', modelClass: 'drogon_model::Gnp::SubscriptionPlans', usedColumns: ['id', 'name', 'plan_type', 'pricing', 'target_publications'] },
            { table: 'user_subscriptions', modelClass: 'drogon_model::Gnp::UserSubscriptions', usedColumns: ['subscription_plan_id', 'billing_cycle', 'is_active', 'partner_id'] },
          ],
          schemaGaps: [
            'Storing `plan_fee` on `user_subscriptions` avoids re-parsing JSONB `subscription_plans.pricing[billing_cycle]` during SQL aggregations.',
          ],
          recommendedTables: [],
          sampleSqlQuery: `SELECT sp.id, sp.name, sp.plan_type,
       COUNT(us.id) FILTER (WHERE LOWER(us.billing_cycle) = 'monthly') AS monthly_subs,
       COUNT(us.id) FILTER (WHERE LOWER(us.billing_cycle) = 'quarterly') AS quarterly_subs,
       COUNT(us.id) FILTER (WHERE LOWER(us.billing_cycle) = 'annual') AS annual_subs,
       COUNT(us.id) AS total_subs
FROM public.subscription_plans sp
LEFT JOIN public.user_subscriptions us ON us.subscription_plan_id = sp.id AND us.is_active = TRUE
GROUP BY sp.id, sp.name, sp.plan_type ORDER BY total_subs DESC;`,
        },
      };
    }

    // =========================================================================
    // 8. [NEW SUGGESTED] SUBSCRIBER RETENTION COHORTS & LTV
    // =========================================================================
    case 'subscriber_retention_cohorts': {
      const cohortMonths = ['Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];
      const horizons = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];
      const matrix = [
        [100, 86, 79, 74, 71, 69],
        [100, 88, 81, 76, 73, null],
        [100, 89, 83, 79, null, null],
        [100, 90, 85, null, null, null],
        [100, 92, null, null, null, null],
        [100, null, null, null, null, null],
      ];

      const heatmapData: [number, number, number][] = [];
      matrix.forEach((row, yIdx) => {
        row.forEach((val, xIdx) => {
          if (val !== null) heatmapData.push([xIdx, yIdx, val]);
        });
      });

      const cohortRows = cohortMonths.map((m, idx) => ({
        cohort: m,
        initialSignups: 620 + idx * 55,
        m1Retention: matrix[idx][1] ?? 100,
        m3Retention: matrix[idx][3] ?? matrix[idx][1] ?? 100,
        cumulativeLtvGhs: Math.round((410 - idx * 38) * planScale),
        topAcquisitionChannel: idx % 2 === 0 ? 'B2B Partner + Organic Search' : 'Affiliate Creators + Archive Search',
      }));

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Month-1 paid retention improved steadily from 86% (Apr 2026 cohort) to 92% (Aug 2026 cohort) following Passkey login rollout and Daily Newsroom Games launch. Subscribers acquired via Archive Search & B2B Partners exhibit a 12-month projected LTV of ₵612 vs ₵384 for promo-only signups.`,
        kpis: [
          { key: 'm1_ret', label: 'Latest M1 Cohort Survival', value: '92.0%', rawValue: 92, changePercent: 6.0, changeDirection: 'up', positiveIsGood: true, subtitle: 'Up from 86% in Apr 2026', sparkline: [86, 88, 89, 90, 92] },
          { key: 'm5_ret', label: '6-Month Stabilized Retention', value: '69.0%', rawValue: 69, changePercent: 4.5, changeDirection: 'up', positiveIsGood: true, subtitle: 'Strong habit plateau after M3', sparkline: [63, 65, 66.5, 68, 69] },
          { key: 'avg_ltv', label: 'Projected 12-Month LTV', value: '₵528.00', rawValue: 528, changePercent: 14.1, changeDirection: 'up', positiveIsGood: true, subtitle: '7.4x Customer Acquisition Cost', sparkline: [450, 470, 488, 505, 528] },
          { key: 'payback', label: 'CAC Payback Window', value: '1.4 Months', rawValue: 1.4, changePercent: -12.5, changeDirection: 'down', positiveIsGood: false, subtitle: 'Affiliate + Campaign blended', sparkline: [1.9, 1.8, 1.6, 1.5, 1.4] },
        ],
        charts: [
          {
            id: 'cohort-heatmap',
            title: 'Monthly Subscriber Cohort Survival Heatmap (%)',
            subtitle: 'Percentage of paid subscribers remaining active from M0 through M5',
            chartTypeBadge: 'Cohort Heatmap',
            span: 'two-thirds',
            height: 320,
            option: {
              tooltip: {
                ...BASE_TOOLTIP,
                position: 'top',
                formatter: (p: any) => `<b>${cohortMonths[p.value[1]]}</b> at <b>${horizons[p.value[0]]}</b>: <b>${p.value[2]}%</b> active`,
              },
              grid: { top: 20, left: 16, right: 20, bottom: 48, containLabel: true },
              xAxis: { type: 'category', data: horizons, splitArea: { show: true }, axisTick: { show: false } },
              yAxis: { type: 'category', data: cohortMonths, inverse: true, splitArea: { show: true }, axisTick: { show: false } },
              visualMap: {
                min: 60,
                max: 100,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: 0,
                inRange: { color: ['#fee2e2', '#fca5a5', '#ef4444', '#b91c1c', '#059669'] },
              },
              series: [
                {
                  name: 'Retention %',
                  type: 'heatmap',
                  data: heatmapData,
                  label: { show: true, formatter: '{@[2]}%', color: '#0f172a', fontWeight: 700, fontSize: 11.5 },
                  itemStyle: { borderColor: '#ffffff', borderWidth: 3, borderRadius: 4 },
                },
              ],
            },
          },
          {
            id: 'ltv-by-channel-curve',
            title: 'Cumulative LTV Curve by Acquisition Channel',
            subtitle: 'Average GHS revenue per subscriber over Months 1–12',
            chartTypeBadge: 'Multi-Series Line',
            span: 'third',
            height: 320,
            option: {
              color: ['#2563eb', '#dc2626', '#059669', '#d97706'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(['M1', 'M3', 'M6', 'M9', 'M12']),
              yAxis: valueYAxis('LTV (₵)', '₵'),
              series: [
                { name: 'Archive / RAG', type: 'line', smooth: true, data: [65, 185, 340, 485, 612] },
                { name: 'Organic Direct', type: 'line', smooth: true, data: [55, 152, 290, 415, 535] },
                { name: 'Affiliate Link', type: 'line', smooth: true, data: [50, 138, 255, 360, 462] },
                { name: 'Promo Coupon', type: 'line', smooth: true, data: [32, 96, 195, 290, 384] },
              ],
            },
          },
        ],
        tableTitle: 'Monthly Signup Cohorts Summary',
        columns: [
          { key: 'cohort', label: 'Signup Cohort' },
          { key: 'initialSignups', label: 'Cohort Size', align: 'right', format: 'number' },
          { key: 'm1Retention', label: 'M1 Survival', align: 'right', format: 'percent' },
          { key: 'm3Retention', label: 'M3 Survival', align: 'right', format: 'percent' },
          { key: 'cumulativeLtvGhs', label: 'Realized LTV', align: 'right', format: 'currency' },
          { key: 'topAcquisitionChannel', label: 'Primary Driver' },
        ],
        rows: cohortRows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/subscriber-cohorts',
          controllerMethod: 'ReportsController::generateSubscriberCohortsReport',
          serviceMethod: 'ReportingService::getSubscriberRetentionCohorts(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'plan'],
          existingTables: [
            { table: 'user_subscriptions', modelClass: 'drogon_model::Gnp::UserSubscriptions', usedColumns: ['user_id', 'start_date', 'end_date', 'is_active'] },
            { table: 'payments', modelClass: 'drogon_model::Gnp::Payments', usedColumns: ['user_id', 'amount_paid', 'created_at'] },
          ],
          schemaGaps: [
            'Requires `user_subscriptions.acquisition_source` and `subscription_lifecycle_events` for exact historical month-N state reconstruction.',
          ],
          recommendedTables: [
            {
              table: 'public.subscription_lifecycle_events',
              changeType: 'new_table',
              summary: 'Enables exact point-in-time survival cohorts and cumulative LTV joins.',
              keyColumns: ['user_id', 'subscription_id', 'event_type', 'occurred_at'],
              ddlSnippet: 'ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS acquisition_source VARCHAR(40) DEFAULT \'organic\';',
            },
          ],
          sampleSqlQuery: `WITH cohorts AS (
  SELECT user_id, DATE_TRUNC('month', MIN(start_date))::date AS cohort_month
  FROM public.user_subscriptions GROUP BY user_id
)
SELECT c.cohort_month,
       EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', p.created_at), c.cohort_month))::int AS month_offset,
       COUNT(DISTINCT p.user_id) AS active_payers,
       SUM(p.amount_paid) AS cohort_revenue
FROM cohorts c
JOIN public.payments p ON p.user_id = c.user_id AND p.status = 'SUCCESS'
GROUP BY 1, 2 ORDER BY 1, 2;`,
        },
      };
    }

    // =========================================================================
    // 9. NEWSPAPER ENGAGEMENT & SALES
    // =========================================================================
    case 'newspaper_engagement': {
      const viewsSeries = win.buckets.map((b) => Math.round((4800 + rng() * 2400) * b.daysInBucket * (selectedPub ? 0.28 : 1)));
      const copiesSeries = win.buckets.map((b) => Math.round((165 + rng() * 95) * b.daysInBucket * (selectedPub ? 0.28 : 1)));
      const totalViews = viewsSeries.reduce((a, b) => a + b, 0);
      const totalCopies = copiesSeries.reduce((a, b) => a + b, 0);

      const editionRows = Array.from({ length: 12 }, (_, idx) => {
        const pub = selectedPub || GRAPHIC_PUBLICATIONS[idx % GRAPHIC_PUBLICATIONS.length];
        const pubDate = dayjs(win.endDate).subtract(idx, 'day').format('YYYY-MM-DD');
        const views = Math.round(3200 + rng() * 4400 - idx * 110);
        const copiesSold = Math.round(95 + rng() * 165);
        return {
          publicationDate: pubDate,
          publicationName: pub.name,
          title: `${pub.name} — Issue #${24890 - idx}`,
          price: pub.unitPrice,
          views,
          avgReadMinutes: Number((6.4 + rng() * 5.2).toFixed(1)),
          copiesSold,
          salesRevenue: copiesSold * pub.unitPrice,
        };
      });

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Published editions recorded ${fmtInt(totalViews)} total reader views across desktop, mobile PWA, and B2B partner sub-accounts, alongside ${fmtInt(totalCopies)} single-copy sales (${fmtGhs(totalCopies * 11.4)} cover revenue). Average reading dwell time across ` + '`newspaper_engagement`' + ` reached 9m 24s per session.`,
        kpis: [
          { key: 'ed_views', label: 'Total Edition Views', value: fmtInt(totalViews), rawValue: totalViews, changePercent: 18.7, changeDirection: 'up', positiveIsGood: true, subtitle: 'Web + PWA + Partner seats', sparkline: viewsSeries.slice(-12) },
          { key: 'copies_sold', label: 'Single Copies Sold', value: fmtInt(totalCopies), rawValue: totalCopies, changePercent: 14.1, changeDirection: 'up', positiveIsGood: true, subtitle: 'Paid individual editions', sparkline: copiesSeries.slice(-12) },
          { key: 'dwell_time', label: 'Avg Reading Dwell Time', value: '9m 24s', rawValue: 564, changePercent: 11.5, changeDirection: 'up', positiveIsGood: true, subtitle: 'From newspaper_engagement', sparkline: [470, 492, 510, 528, 545, 564] },
          { key: 'partner_share', label: 'B2B Partner Read Share', value: '39.4%', rawValue: 39.4, changePercent: 5.2, changeDirection: 'up', positiveIsGood: true, subtitle: 'MTN, GCB, GNAT, UG & VRA', sparkline: [33, 35, 36.4, 37.8, 39.4] },
        ],
        charts: [
          {
            id: 'engagement-views-sales-combo',
            title: 'Edition Views vs Single-Copy Sales Over Time',
            subtitle: 'Dual-axis comparison of `newspaper_engagement` reads against `edition_sales_ledger` copies',
            chartTypeBadge: 'Bar + Smooth Line',
            span: 'two-thirds',
            height: 310,
            option: {
              color: ['#2563eb', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: DUAL_AXIS_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: [valueYAxis('Edition Views'), valueYAxis('Copies Sold')],
              series: [
                { name: 'Edition Views', type: 'bar', barMaxWidth: 20, itemStyle: { color: barGradient('#2563eb', '#60a5fa'), borderRadius: [4, 4, 0, 0] }, data: viewsSeries },
                { name: 'Copies Sold', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 3 }, data: copiesSeries },
              ],
            },
          },
          {
            id: 'partner-quota-share',
            title: 'Partner Enrollment Quota Share',
            subtitle: 'Active enrolled seats across top B2B partners',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 310,
            option: {
              color: GNP_PALETTE,
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{c}</b> enrolled ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['44%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: MOCK_COMMERCIAL_PARTNERS.map((p) => ({
                    name: p.partnerIdentifier,
                    value: p.subscriberQuota - p.remainingQuota,
                  })),
                },
              ],
            },
          },
        ],
        tableTitle: 'Edition-Level Readership & Copy Sales Breakdown',
        columns: [
          { key: 'publicationDate', label: 'Pub Date', format: 'date' },
          { key: 'publicationName', label: 'Brand' },
          { key: 'title', label: 'Edition Title' },
          { key: 'price', label: 'Cover Price', align: 'right', format: 'currency' },
          { key: 'views', label: 'Views', align: 'right', format: 'number' },
          { key: 'avgReadMinutes', label: 'Avg Read (min)', align: 'right', format: 'number' },
          { key: 'copiesSold', label: 'Copies Sold', align: 'right', format: 'number' },
          { key: 'salesRevenue', label: 'Copy Sales (GHS)', align: 'right', format: 'currency' },
        ],
        rows: editionRows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/newspaper-engagement',
          controllerMethod: 'ReportsController::generateNewspaperEngagementReport',
          serviceMethod: 'NewspaperService::getNewspaperEngagementReport(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'publicationId', 'partnerId'],
          existingTables: [
            { table: 'newspapers', modelClass: 'drogon_model::Gnp::Newspapers', usedColumns: ['id', 'title', 'publication_name', 'publication_date', 'price', 'views', 'sales'] },
            { table: 'newspaper_engagement', modelClass: 'drogon_model::Gnp::NewspaperEngagement', usedColumns: ['newspaper_id', 'user_id', 'partner_id', 'viewed_at', 'time_spent_seconds', 'device_type'] },
          ],
          schemaGaps: [
            'Update `NewspaperService::getNewspaperEngagementReport` so empty `partnerId` runs platform-wide instead of calling `partnerMapper.findByPrimaryKey("")`, and aggregate views from `newspaper_engagement.viewed_at` + sales from `edition_sales_ledger.sold_at`.',
          ],
          recommendedTables: [
            {
              table: 'public.edition_sales_ledger',
              changeType: 'new_table',
              summary: 'Provides true date-filtered copy sales instead of lifetime `newspapers.sales`.',
              keyColumns: ['newspaper_id', 'amount_paid', 'sold_at'],
              ddlSnippet: 'SELECT newspaper_id, COUNT(*) AS copies_sold, SUM(amount_paid) AS sales FROM public.edition_sales_ledger WHERE sold_at BETWEEN $1 AND $2 GROUP BY newspaper_id;',
            },
          ],
          sampleSqlQuery: `SELECT n.id, n.title, n.publication_name, n.publication_date, n.price,
       COUNT(ne.id) AS period_views,
       COALESCE(ROUND(AVG(ne.time_spent_seconds) / 60.0, 1), 0) AS avg_read_minutes
FROM public.newspapers n
LEFT JOIN public.newspaper_engagement ne ON ne.newspaper_id = n.id AND ne.viewed_at BETWEEN $1 AND $2
WHERE ($3 = '' OR n.publication_id::text = $3)
GROUP BY n.id ORDER BY period_views DESC LIMIT 50;`,
        },
      };
    }

    // =========================================================================
    // 10. CONTENT INVENTORY STATUS
    // =========================================================================
    case 'content_inventory': {
      const pubInventory = GRAPHIC_PUBLICATIONS.map((pub, idx) => {
        const publishedPaid = 3420 - idx * 410;
        const publishedFree = 280 - idx * 25;
        const archivedOcr = 8900 - idx * 1250;
        const drafts = 14 - idx * 2;
        const ragIndexedPct = Number((96.8 - idx * 1.1).toFixed(1));
        return {
          publication: pub.name,
          type: pub.type,
          coverPrice: pub.unitPrice,
          publishedPaid,
          publishedFree,
          archivedOcr,
          drafts,
          totalEditions: publishedPaid + publishedFree + archivedOcr + drafts,
          ragIndexedPct,
        };
      });

      const totalEditions = pubInventory.reduce((s, r) => s + r.totalEditions, 0);
      const totalArchived = pubInventory.reduce((s, r) => s + r.archivedOcr, 0);

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Catalog holds ${fmtInt(totalEditions)} total editions across 6 active Graphic Communications brands, including ${fmtInt(totalArchived)} historical archived issues representing 642,800 OCR-searchable pages in ` + '`newspaper_details`' + ` (94.2% embedded in pgvector).`,
        kpis: [
          { key: 'total_editions', label: 'Total Catalog Editions', value: fmtInt(totalEditions), rawValue: totalEditions, changePercent: 4.8, changeDirection: 'up', positiveIsGood: true, subtitle: 'Across 6 Graphic brands', sparkline: [46200, 47100, 47900, 48800, totalEditions] },
          { key: 'ocr_pages', label: 'OCR Searchable Pages', value: '642.8k', rawValue: 642800, changePercent: 6.2, changeDirection: 'up', positiveIsGood: true, subtitle: 'Indexed in newspaper_details', sparkline: [590, 604, 618, 631, 642.8] },
          { key: 'rag_coverage', label: 'pgvector RAG Coverage', value: '94.2%', rawValue: 94.2, changePercent: 9.1, changeDirection: 'up', positiveIsGood: true, subtitle: 'newspaper_archive_rag_chunks', sparkline: [81, 85, 89, 92, 94.2] },
          { key: 'draft_queue', label: 'Staged Draft Editions', value: '54', rawValue: 54, changePercent: -12.0, changeDirection: 'down', positiveIsGood: true, subtitle: 'Awaiting editorial publish', sparkline: [68, 64, 61, 58, 54] },
        ],
        charts: [
          {
            id: 'inventory-stacked-bar',
            title: 'Catalog Inventory by Publication Brand & State',
            subtitle: 'Compares Paid Live, Free Teaser, Historical Archived, and Draft editions',
            chartTypeBadge: 'Stacked Bar',
            span: 'two-thirds',
            height: 310,
            option: {
              color: ['#dc2626', '#2563eb', '#059669', '#94a3b8'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(pubInventory.map((p) => p.publication)),
              yAxis: valueYAxis('Editions'),
              series: [
                { name: 'Archived (OCR)', type: 'bar', stack: 'inv', barMaxWidth: 30, data: pubInventory.map((p) => p.archivedOcr) },
                { name: 'Published (Paid)', type: 'bar', stack: 'inv', barMaxWidth: 30, data: pubInventory.map((p) => p.publishedPaid) },
                { name: 'Published (Free)', type: 'bar', stack: 'inv', barMaxWidth: 30, data: pubInventory.map((p) => p.publishedFree) },
                { name: 'Drafts', type: 'bar', stack: 'inv', barMaxWidth: 30, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: pubInventory.map((p) => p.drafts) },
              ],
            },
          },
          {
            id: 'inventory-storage-pie',
            title: 'G3 Storage Footprint by Format',
            subtitle: 'Object storage distribution across PDFs, thumbnails, video & audio',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 310,
            option: {
              color: ['#dc2626', '#7c3aed', '#0891b2', '#d97706'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>{c} GB</b> ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['45%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'Newspaper PDFs', value: 1840 },
                    { name: 'GN+ Originals Video', value: 960 },
                    { name: 'Page Thumbnails & WebP', value: 310 },
                    { name: 'Podcasts & Audio', value: 185 },
                  ],
                },
              ],
            },
          },
        ],
        tableTitle: 'Publication Brand Inventory Breakdown (`publications` × `newspapers`)',
        columns: [
          { key: 'publication', label: 'Publication Brand' },
          { key: 'type', label: 'Type' },
          { key: 'publishedPaid', label: 'Live Paid', align: 'right', format: 'number' },
          { key: 'publishedFree', label: 'Live Free', align: 'right', format: 'number' },
          { key: 'archivedOcr', label: 'Archived (OCR)', align: 'right', format: 'number' },
          { key: 'drafts', label: 'Drafts', align: 'right', format: 'number' },
          { key: 'totalEditions', label: 'Total Issues', align: 'right', format: 'number' },
          { key: 'ragIndexedPct', label: 'RAG Indexed', align: 'right', format: 'progress' },
        ],
        rows: pubInventory,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/content-inventory',
          controllerMethod: 'ReportsController::generateContentInventoryReport',
          serviceMethod: 'ReportingService::getContentInventoryStatus(const ReportDto &dto)',
          cppDtoFields: ['status', 'publicationId'],
          existingTables: [
            { table: 'publications', modelClass: 'drogon_model::Gnp::Publications', usedColumns: ['id', 'name', 'type', 'is_active', 'price'] },
            { table: 'newspapers', modelClass: 'drogon_model::Gnp::Newspapers', usedColumns: ['publication_id', 'is_published', 'is_free', 'is_archived', 'file_type'] },
            { table: 'newspaper_details', modelClass: 'drogon_model::Gnp::NewspaperDetails', usedColumns: ['newspaper_id', 'page_number'] },
          ],
          schemaGaps: [],
          recommendedTables: [],
          sampleSqlQuery: `SELECT p.name AS publication,
       COUNT(n.id) FILTER (WHERE n.is_published AND NOT n.is_free AND NOT n.is_archived) AS published_paid,
       COUNT(n.id) FILTER (WHERE n.is_published AND n.is_free) AS published_free,
       COUNT(n.id) FILTER (WHERE n.is_archived) AS archived_ocr,
       COUNT(n.id) FILTER (WHERE NOT n.is_published) AS drafts
FROM public.publications p
LEFT JOIN public.newspapers n ON n.publication_id = p.id
GROUP BY p.id, p.name ORDER BY COUNT(n.id) DESC;`,
        },
      };
    }

    // =========================================================================
    // 11. INGESTION JOB LOGS
    // =========================================================================
    case 'ingestion_jobs': {
      const completedSeries = win.buckets.map((b) => Math.round((6 + rng() * 3) * b.daysInBucket));
      const failedSeries = win.buckets.map((_, i) => (i % 5 === 0 ? 1 : 0));
      const avgOcrSec = win.buckets.map(() => Number((38 + rng() * 24).toFixed(1)));

      const editors = ['Kwabena Mensah (Prod Desk)', 'Quartz Nightly Pipeline', 'Ama Boateng (Archive Unit)', 'Esi Tetteh (Pre-Press)', 'Quartz Nightly Pipeline'];
      const rows = Array.from({ length: 14 }, (_, idx) => {
        const pub = GRAPHIC_PUBLICATIONS[idx % GRAPHIC_PUBLICATIONS.length];
        const st = idx === 3 ? 'FAILED' : idx === 0 ? 'PROCESSING' : 'COMPLETED';
        const pages = pub.code === 'DG' ? 48 : pub.code === 'GB' ? 32 : 24;
        return {
          createdAt: dayjs(win.endDate).subtract(Math.floor(idx / 2), 'day').hour(4 + (idx % 5)).minute(15).format('YYYY-MM-DD HH:mm'),
          publication: pub.name,
          editionDate: dayjs(win.endDate).subtract(Math.floor(idx / 2), 'day').format('YYYY-MM-DD'),
          ingestedBy: editors[idx % editors.length],
          pagesProcessed: st === 'FAILED' ? Math.round(pages * 0.35) : st === 'PROCESSING' ? Math.round(pages * 0.75) : pages,
          percentageCompletion: st === 'FAILED' ? 35 : st === 'PROCESSING' ? 75 : 100,
          durationSec: Number((31 + (idx * 7) % 34).toFixed(1)),
          status: st,
          notes: st === 'FAILED' ? 'Corrupt PDF xref table on page 18 — re-queued' : 'OCR + G3 thumbnail + RAG chunks enqueued',
        };
      });

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Ingestion pipeline achieved a 98.4% daily SLA across pre-05:00 GMT morning edition deadlines, averaging 46.2 seconds for full PDF splitting, G3 thumbnail extraction, OCR text extraction into ` + '`newspaper_details`' + `, and pgvector chunk queueing.`,
        kpis: [
          { key: 'ing_total', label: 'Editions Ingested', value: fmtInt(completedSeries.reduce((a, b) => a + b, 0)), rawValue: completedSeries.reduce((a, b) => a + b, 0), changePercent: 6.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Scheduled + manual uploads', sparkline: completedSeries.slice(-12) },
          { key: 'ing_sla', label: 'Pre-5AM SLA Success', value: '98.4%', rawValue: 98.4, changePercent: 1.5, changeDirection: 'up', positiveIsGood: true, subtitle: 'Morning edition readiness', sparkline: [96.5, 97.2, 97.8, 98.1, 98.4] },
          { key: 'ocr_speed', label: 'Mean OCR Pipeline Time', value: '46.2s', rawValue: 46.2, changePercent: -14.8, changeDirection: 'down', positiveIsGood: false, subtitle: 'Faster per 48-page issue', sparkline: avgOcrSec.slice(-12) },
          { key: 'failed_jobs', label: 'Failed Upload Jobs', value: fmtInt(failedSeries.reduce((a, b) => a + b, 0)), rawValue: failedSeries.reduce((a, b) => a + b, 0), changePercent: -33.0, changeDirection: 'down', positiveIsGood: false, subtitle: 'Auto-alerted to Pre-Press', sparkline: failedSeries.slice(-12), sparklineType: 'bar' },
        ],
        charts: [
          {
            id: 'ingestion-throughput',
            title: 'Ingestion Throughput & OCR Processing Latency',
            subtitle: 'Completed vs Failed jobs alongside average OCR processing time (seconds)',
            chartTypeBadge: 'Stacked Bar + Line',
            span: 'full',
            height: 300,
            option: {
              color: ['#059669', '#dc2626', '#2563eb'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: DUAL_AXIS_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: [valueYAxis('Jobs'), valueYAxis('OCR Sec', '', 's')],
              series: [
                { name: 'Completed Jobs', type: 'bar', stack: 'jobs', barMaxWidth: 20, data: completedSeries },
                { name: 'Failed Jobs', type: 'bar', stack: 'jobs', barMaxWidth: 20, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: failedSeries },
                { name: 'Avg OCR Duration (s)', type: 'line', yAxisIndex: 1, smooth: true, lineStyle: { width: 2.5 }, data: avgOcrSec },
              ],
            },
          },
        ],
        tableTitle: 'Daily Newspaper Ingestion & OCR Pipeline Logs (`public.ingestion_jobs`)',
        columns: [
          { key: 'createdAt', label: 'Started At' },
          { key: 'publication', label: 'Publication' },
          { key: 'editionDate', label: 'Edition Date', format: 'date' },
          { key: 'ingestedBy', label: 'Operator / Trigger' },
          { key: 'pagesProcessed', label: 'Pages OCR’d', align: 'right', format: 'number' },
          { key: 'percentageCompletion', label: 'Completion', align: 'right', format: 'progress' },
          { key: 'durationSec', label: 'Duration (s)', align: 'right', format: 'number' },
          { key: 'status', label: 'Status', align: 'center', format: 'badge' },
          { key: 'notes', label: 'Pipeline Diagnostic' },
        ],
        rows,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/ingestion-jobs',
          controllerMethod: 'ReportsController::generateIngestionJobsReport',
          serviceMethod: 'ReportingService::getIngestionJobLogs(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'status', 'publicationId'],
          existingTables: [
            { table: 'ingestion_jobs', modelClass: 'drogon_model::Gnp::IngestionJobs', usedColumns: ['id', 'publication_date', 'ingested_by', 'percentage_completion', 'status', 'created_at', 'updated_at'] },
          ],
          schemaGaps: [
            '`ingestion_jobs` currently lacks `publication_id`, `newspaper_id`, `total_pages`, `ocr_pages_completed`, `processing_duration_ms`, and `error_message`.',
          ],
          recommendedTables: [
            {
              table: 'public.ingestion_jobs (ALTER)',
              changeType: 'alter_table',
              summary: 'Add `publication_id`, `newspaper_id`, `total_pages`, `ocr_pages_completed`, `processing_duration_ms`, `error_message`.',
              keyColumns: ['publication_id', 'total_pages', 'processing_duration_ms', 'error_message'],
              ddlSnippet: 'ALTER TABLE public.ingestion_jobs ADD COLUMN IF NOT EXISTS publication_id UUID REFERENCES public.publications(id), ADD COLUMN IF NOT EXISTS total_pages INTEGER NOT NULL DEFAULT 0, ADD COLUMN IF NOT EXISTS processing_duration_ms INTEGER, ADD COLUMN IF NOT EXISTS error_message TEXT;',
            },
          ],
          sampleSqlQuery: `SELECT ij.id, p.name AS publication, ij.publication_date, ij.ingested_by,
       ij.ocr_pages_completed, ij.percentage_completion, ij.processing_duration_ms, ij.status, ij.error_message
FROM public.ingestion_jobs ij
LEFT JOIN public.publications p ON p.id = ij.publication_id
WHERE ij.created_at BETWEEN $1 AND $2 ORDER BY ij.created_at DESC;`,
        },
      };
    }

    // =========================================================================
    // 12. [NEW SUGGESTED] GN+ ORIGINALS MULTIMEDIA PERFORMANCE
    // =========================================================================
    case 'multimedia_originals_performance': {
      const categories = [
        { category: 'Live Now & National Debates', format: 'Live Stream', titles: 18, plays: 46800, watchHours: 19400, completionPct: 74.2, likes: 4820 },
        { category: 'Top Podcasts (Daily Chronicle & Economy)', format: 'Podcast Audio', titles: 64, plays: 38200, watchHours: 24100, completionPct: 81.5, likes: 3690 },
        { category: 'Exclusive Interviews', format: 'VOD Video', titles: 42, plays: 29400, watchHours: 14800, completionPct: 68.4, likes: 3110 },
        { category: 'Sports Highlights', format: 'Short Video', titles: 95, plays: 52100, watchHours: 8900, completionPct: 86.0, likes: 6150 },
        { category: 'Documentaries & Movies', format: 'Feature VOD', titles: 24, plays: 14900, watchHours: 16200, completionPct: 63.8, likes: 1890 },
        { category: 'GN Digital Books & Audiobooks', format: 'Audio / eBook', titles: 31, plays: 9800, watchHours: 7400, completionPct: 71.0, likes: 1240 },
      ];

      const videoTrend = win.buckets.map((b) => Math.round((4200 + rng() * 1900) * b.daysInBucket));
      const podcastTrend = win.buckets.map((b) => Math.round((2400 + rng() * 1100) * b.daysInBucket));

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `GN+ Originals generated 191,200 streams and 90,800 total watch/listen hours across Video, Live Streams, Podcasts, and Audiobooks. Podcasts achieve an 81.5% episode completion rate, making audio commuters one of GNP’s stickiest daily cohorts.`,
        kpis: [
          { key: 'total_streams', label: 'Total Multimedia Plays', value: '191.2k', rawValue: 191200, changePercent: 26.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Video + Live + Podcasts', sparkline: videoTrend.slice(-12) },
          { key: 'watch_hours', label: 'Total Watch / Listen Hours', value: '90,800h', rawValue: 90800, changePercent: 22.1, changeDirection: 'up', positiveIsGood: true, subtitle: 'Avg 28.5m per session', sparkline: podcastTrend.slice(-12) },
          { key: 'podcast_comp', label: 'Avg Completion Rate', value: '74.2%', rawValue: 74.2, changePercent: 5.3, changeDirection: 'up', positiveIsGood: true, subtitle: 'Sports & Podcasts > 81%', sparkline: [68, 69.5, 71, 72.8, 74.2] },
          { key: 'live_peak', label: 'Peak Concurrent Live Viewers', value: '8,420', rawValue: 8420, changePercent: 41.0, changeDirection: 'up', positiveIsGood: true, subtitle: 'The Big Debate 2026 Live', sparkline: [3200, 4900, 5600, 7100, 8420] },
        ],
        charts: [
          {
            id: 'originals-stream-trend',
            title: 'Video & Live Streams vs Podcast Audio Plays Over Time',
            subtitle: 'Daily playback sessions across `media_playback_events`',
            chartTypeBadge: 'Smooth Stacked Area',
            span: 'two-thirds',
            height: 300,
            option: {
              color: ['#dc2626', '#7c3aed'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: valueYAxis('Streams'),
              series: [
                { name: 'Video & Live Streams', type: 'line', smooth: true, areaStyle: { color: areaGradient('#dc2626') }, data: videoTrend },
                { name: 'Podcasts & Audio', type: 'line', smooth: true, areaStyle: { color: areaGradient('#7c3aed') }, data: podcastTrend },
              ],
            },
          },
          {
            id: 'originals-watch-hours',
            title: 'Watch / Listen Hours by Category',
            subtitle: 'Total hours consumed per Originals vertical',
            chartTypeBadge: 'Horizontal Bar',
            span: 'third',
            height: 300,
            option: {
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              grid: { top: 16, left: 12, right: 20, bottom: 20, containLabel: true },
              xAxis: valueYAxis('Hours'),
              yAxis: {
                type: 'category',
                inverse: true,
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: { fontSize: 11, color: '#334155' },
                data: categories.map((c) => c.category.split(' (')[0]),
              },
              series: [
                {
                  type: 'bar',
                  barMaxWidth: 18,
                  itemStyle: { color: barGradient('#7c3aed', '#6366f1'), borderRadius: [0, 6, 6, 0] },
                  data: categories.map((c) => c.watchHours),
                },
              ],
            },
          },
        ],
        tableTitle: 'GN+ Originals Category Performance Breakdown',
        columns: [
          { key: 'category', label: 'Originals Vertical' },
          { key: 'format', label: 'Media Type' },
          { key: 'titles', label: 'Published Titles', align: 'right', format: 'number' },
          { key: 'plays', label: 'Total Plays', align: 'right', format: 'number' },
          { key: 'watchHours', label: 'Watch / Listen Hrs', align: 'right', format: 'number' },
          { key: 'likes', label: 'Likes', align: 'right', format: 'number' },
          { key: 'completionPct', label: 'Avg Completion', align: 'right', format: 'progress' },
        ],
        rows: categories,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/originals-multimedia',
          controllerMethod: 'ReportsController::generateMultimediaOriginalsReport',
          serviceMethod: 'ReportingService::getMultimediaOriginalsPerformance(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'status'],
          existingTables: [
            { table: 'videos', modelClass: 'drogon_model::Gnp::Videos', usedColumns: ['id', 'title', 'duration', 'status', 'views', 'likes', 'downloads', 'metadata'] },
          ],
          schemaGaps: [
            'Create `public.audios` for `/admin/content-management/audios` and `public.media_playback_events` for timestamped watch hours & completion percentage.',
          ],
          recommendedTables: [
            {
              table: 'public.media_playback_events',
              changeType: 'new_table',
              summary: 'Unified playback telemetry across VOD video, Live streams, Podcasts, and Audiobooks.',
              keyColumns: ['media_type', 'media_id', 'originals_category', 'watch_seconds', 'completion_pct', 'played_at'],
              ddlSnippet: 'CREATE TABLE IF NOT EXISTS public.media_playback_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), media_type VARCHAR(20) NOT NULL, media_id UUID NOT NULL, originals_category VARCHAR(40) NOT NULL, watch_seconds INTEGER NOT NULL DEFAULT 0, completion_pct NUMERIC(5,2) NOT NULL DEFAULT 0, played_at TIMESTAMPTZ NOT NULL DEFAULT NOW());',
            },
          ],
          sampleSqlQuery: `SELECT originals_category, media_type, COUNT(*) AS plays,
       ROUND(SUM(watch_seconds) / 3600.0, 1) AS watch_hours,
       ROUND(AVG(completion_pct), 1) AS completion_pct
FROM public.media_playback_events
WHERE played_at BETWEEN $1 AND $2
GROUP BY originals_category, media_type ORDER BY watch_hours DESC;`,
        },
      };
    }

    // =========================================================================
    // 13. [NEW SUGGESTED] ARCHIVE SEARCH & AI RAG INTELLIGENCE
    // =========================================================================
    case 'archive_rag_intelligence': {
      const ftsSeries = win.buckets.map((b) => Math.round((820 + rng() * 360) * b.daysInBucket));
      const ragSeries = win.buckets.map((b) => Math.round((240 + rng() * 145) * b.daysInBucket));
      const totalFts = ftsSeries.reduce((a, b) => a + b, 0);
      const totalRag = ragSeries.reduce((a, b) => a + b, 0);

      const decades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
      const decadeQueries = [4820, 6390, 3910, 4280, 5640, 7120, 8940, 11250];

      const topQueries = [
        { query: '"kwame nkrumah" independence 1957 speech', mode: 'AI RAG (/ask-archives)', decade: '1950s', executions: 642, avgCitations: 4.8, avgLatencyMs: 1420, pdfDossiersSold: 38 },
        { query: 'Bank of Ghana cedi redenomination 2007 policy impact', mode: 'AI RAG (/ask-archives)', decade: '2000s', executions: 518, avgCitations: 5.0, avgLatencyMs: 1580, pdfDossiersSold: 44 },
        { query: '"akosombo dam" volta river project financing', mode: 'AI RAG (/ask-archives)', decade: '1960s', executions: 469, avgCitations: 4.6, avgLatencyMs: 1390, pdfDossiersSold: 29 },
        { query: '1992 fourth republic constitution referendum results', mode: 'FTS (/search-archives)', decade: '1990s', executions: 890, avgCitations: 0, avgLatencyMs: 68, pdfDossiersSold: 19 },
        { query: 'cocoa marketing board producer price announcements', mode: 'AI RAG (/ask-archives)', decade: '1970s–2020s', executions: 412, avgCitations: 4.9, avgLatencyMs: 1640, pdfDossiersSold: 31 },
        { query: 'black stars afcon 1982 tripoli match report', mode: 'FTS (/search-archives)', decade: '1980s', executions: 735, avgCitations: 0, avgLatencyMs: 54, pdfDossiersSold: 11 },
        { query: 'illegal mining galamsey water bodies taskforce', mode: 'AI RAG (/ask-archives)', decade: '2020s', executions: 604, avgCitations: 5.0, avgLatencyMs: 1510, pdfDossiersSold: 36 },
      ];

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `Graphic Archives processed ${fmtInt(totalFts)} full-text searches (median 62 ms via GIN ` + '`to_tsvector`' + `) and ${fmtInt(totalRag)} cited AI research syntheses (` + '`/ask-archives`' + `, averaging 4.8 grounded citations per answer), unlocking 208 high-margin Executive PDF Research Dossier purchases.`,
        kpis: [
          { key: 'fts_queries', label: 'Archive Keyword Searches', value: fmtInt(totalFts), rawValue: totalFts, changePercent: 21.6, changeDirection: 'up', positiveIsGood: true, subtitle: 'Median 62ms PostgreSQL GIN', sparkline: ftsSeries.slice(-12) },
          { key: 'rag_queries', label: 'AI Cited RAG Answers', value: fmtInt(totalRag), rawValue: totalRag, changePercent: 38.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Avg 4.8 source citations', sparkline: ragSeries.slice(-12) },
          { key: 'dossiers_exported', label: 'Paid PDF Research Dossiers', value: '208', rawValue: 208, changePercent: 31.2, changeDirection: 'up', positiveIsGood: true, subtitle: '₵31,200 high-margin revenue', sparkline: [110, 134, 158, 179, 208] },
          { key: 'rag_queue', label: 'Pending Embedding Queue', value: '142 pages', rawValue: 142, changePercent: -64.0, changeDirection: 'down', positiveIsGood: false, subtitle: '99.98% corpus embedded', sparkline: [620, 480, 350, 210, 142] },
        ],
        charts: [
          {
            id: 'archive-fts-vs-rag',
            title: 'Archive Keyword Search (`/search-archives`) vs AI RAG (`/ask-archives`)',
            subtitle: 'Daily research activity across public FTS and authenticated RAG endpoints',
            chartTypeBadge: 'Stacked Bar + Line',
            span: 'two-thirds',
            height: 310,
            option: {
              color: ['#2563eb', '#dc2626'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis' },
              legend: BOTTOM_LEGEND,
              grid: BASE_GRID,
              xAxis: categoryXAxis(labels),
              yAxis: valueYAxis('Queries'),
              series: [
                { name: 'Keyword FTS Searches', type: 'bar', barMaxWidth: 18, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: ftsSeries },
                { name: 'Cited AI RAG Questions', type: 'line', smooth: true, lineStyle: { width: 3 }, areaStyle: { color: areaGradient('#dc2626') }, data: ragSeries },
              ],
            },
          },
          {
            id: 'archive-era-demand',
            title: 'Historical Era Research Demand (1950s–2020s)',
            subtitle: 'Shows high commercial value of 1950s–1960s Independence & 2000s+ policy archives',
            chartTypeBadge: 'Decade Bar',
            span: 'third',
            height: 310,
            option: {
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              grid: BASE_GRID,
              xAxis: categoryXAxis(decades),
              yAxis: valueYAxis('Searches'),
              series: [
                {
                  type: 'bar',
                  barMaxWidth: 20,
                  itemStyle: { color: barGradient('#d97706', '#f59e0b'), borderRadius: [4, 4, 0, 0] },
                  data: decadeQueries,
                },
              ],
            },
          },
        ],
        tableTitle: 'Top Researched Archive Topics, Citation Density & PDF Dossier Conversions',
        columns: [
          { key: 'query', label: 'Research Query / Topic' },
          { key: 'mode', label: 'Engine Mode' },
          { key: 'decade', label: 'Era' },
          { key: 'executions', label: 'Queries', align: 'right', format: 'number' },
          { key: 'avgCitations', label: 'Avg Citations', align: 'right', format: 'number' },
          { key: 'avgLatencyMs', label: 'Avg Latency (ms)', align: 'right', format: 'number' },
          { key: 'pdfDossiersSold', label: 'PDF Dossiers Sold', align: 'right', format: 'number' },
        ],
        rows: topQueries,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/archive-rag-intelligence',
          controllerMethod: 'ReportsController::generateArchiveRagIntelligenceReport',
          serviceMethod: 'ReportingService::getArchiveRagIntelligence(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'publicationId', 'granularity'],
          existingTables: [
            { table: 'newspaper_details', modelClass: 'drogon_model::Gnp::NewspaperDetails', usedColumns: ['id', 'publication_name', 'publication_date', 'views'] },
            { table: 'newspaper_archive_rag_chunks', modelClass: 'sql/archive_rag_chunks.sql', usedColumns: ['detail_id', 'embedding_model', 'chunk_count', 'created_at'] },
            { table: 'newspaper_archive_rag_index_queue', modelClass: 'sql/archive_rag_chunks.sql', usedColumns: ['detail_id', 'attempts', 'last_error'] },
          ],
          schemaGaps: [
            'Log query telemetry inside `NewspaperService::searchArchives` and `RagManager::answerArchiveQuestion` into `public.archive_search_and_rag_logs`.',
          ],
          recommendedTables: [
            {
              table: 'public.archive_search_and_rag_logs',
              changeType: 'new_table',
              summary: 'Captures FTS & RAG queries, decade filters, latency, result count, and cited `newspaper_details` IDs.',
              keyColumns: ['query_mode', 'query_text', 'target_decade', 'results_count', 'citations_returned', 'latency_ms'],
              ddlSnippet: 'CREATE TABLE IF NOT EXISTS public.archive_search_and_rag_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, query_mode VARCHAR(30) NOT NULL, query_text TEXT NOT NULL, results_count INTEGER NOT NULL DEFAULT 0, citations_returned SMALLINT NOT NULL DEFAULT 0, latency_ms INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());',
            },
          ],
          sampleSqlQuery: `SELECT DATE_TRUNC($3, created_at)::date AS day,
       COUNT(*) FILTER (WHERE query_mode = 'fts_search') AS fts_searches,
       COUNT(*) FILTER (WHERE query_mode = 'rag_ask') AS rag_questions,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latency_ms) AS p50_latency_ms
FROM public.archive_search_and_rag_logs
WHERE created_at BETWEEN $1 AND $2
GROUP BY 1 ORDER BY 1;`,
        },
      };
    }

    // =========================================================================
    // 14. [NEW SUGGESTED] INSTITUTIONAL ARCHIVE ACCESS & CREDITS
    // =========================================================================
    case 'institutional_archive_credits': {
      const institutions = [
        { institution: 'University of Ghana — Balme Library', sector: 'Academic', seats: 120, allocated: 5000, consumed: 4380, remaining: 620, contractGhs: 48000, status: 'LOW_CREDITS' },
        { institution: 'KNUST Library & Postgraduate School', sector: 'Academic', seats: 95, allocated: 4000, consumed: 2910, remaining: 1090, contractGhs: 38000, status: 'ACTIVE' },
        { institution: 'Bentsi-Enchill, Letsa & Ankomah LLP', sector: 'Legal & Litigation', seats: 45, allocated: 3000, consumed: 2640, remaining: 360, contractGhs: 42000, status: 'LOW_CREDITS' },
        { institution: 'Ministry of Finance Policy Research Unit', sector: 'Government', seats: 60, allocated: 3500, consumed: 2150, remaining: 1350, contractGhs: 45000, status: 'ACTIVE' },
        { institution: 'Bank of Ghana Monetary Research Dept.', sector: 'Central Bank', seats: 50, allocated: 4000, consumed: 3180, remaining: 820, contractGhs: 52000, status: 'ACTIVE' },
        { institution: 'Parliament of Ghana Research Library', sector: 'Government', seats: 80, allocated: 3500, consumed: 2890, remaining: 610, contractGhs: 40000, status: 'ACTIVE' },
        { institution: 'British High Commission — Accra Archive Desk', sector: 'Diplomatic', seats: 15, allocated: 1500, consumed: 940, remaining: 560, contractGhs: 24000, status: 'ACTIVE' },
      ].map((r) => ({ ...r, utilizationPct: Number(((r.consumed / r.allocated) * 100).toFixed(1)) }));

      const totalContract = institutions.reduce((s, i) => s + i.contractGhs, 0);
      const totalConsumed = institutions.reduce((s, i) => s + i.consumed, 0);
      const totalAllocated = institutions.reduce((s, i) => s + i.allocated, 0);

      return {
        reportMeta: makeMeta(def, group, win),
        executiveSummary: `7 active institutional archive contracts represent ${fmtGhs(totalContract)} in annual research licensing, with ${fmtInt(totalConsumed)} of ${fmtInt(totalAllocated)} credits consumed (${((totalConsumed / totalAllocated) * 100).toFixed(1)}% utilization). Two institutions (UG Balme Library and Bentsi-Enchill LLP) are above 87% depletion and ready for credit pack top-up outreach.`,
        kpis: [
          { key: 'inst_arr', label: 'Institutional Archive ARR', value: fmtCompactGhs(totalContract), rawValue: totalContract, changePercent: 29.0, changeDirection: 'up', positiveIsGood: true, subtitle: '7 enterprise licenses', sparkline: [190, 215, 240, 265, 289] },
          { key: 'credits_used', label: 'Research Credits Burned', value: fmtInt(totalConsumed), rawValue: totalConsumed, changePercent: 23.5, changeDirection: 'up', positiveIsGood: true, subtitle: `Of ${fmtInt(totalAllocated)} allocated`, sparkline: [2400, 2850, 3190, 3540, 3890] },
          { key: 'topup_ready', label: 'Accounts Near Depletion (>85%)', value: '2 Institutions', rawValue: 2, changePercent: 100, changeDirection: 'up', positiveIsGood: true, subtitle: 'Immediate upsell pipeline', sparkline: [0, 1, 1, 2, 2] },
          { key: 'avg_util', label: 'Portfolio Credit Utilization', value: '77.9%', rawValue: 77.9, changePercent: 8.4, changeDirection: 'up', positiveIsGood: true, subtitle: 'Healthy researcher engagement', sparkline: [64, 68, 71, 75, 77.9] },
        ],
        charts: [
          {
            id: 'inst-credit-bars',
            title: 'Institutional Credit Consumption vs Remaining Balance',
            subtitle: 'Identifies accounts approaching credit exhaustion for proactive renewal',
            chartTypeBadge: 'Stacked Horizontal Bar',
            span: 'two-thirds',
            height: 310,
            option: {
              color: ['#dc2626', '#cbd5e1'],
              tooltip: { ...BASE_TOOLTIP, trigger: 'axis', axisPointer: { type: 'shadow' } },
              legend: BOTTOM_LEGEND,
              grid: { top: 20, left: 16, right: 24, bottom: 42, containLabel: true },
              xAxis: valueYAxis('Credits'),
              yAxis: {
                type: 'category',
                inverse: true,
                axisTick: { show: false },
                axisLine: { show: false },
                data: institutions.map((i) => i.institution.split(' — ')[0]),
              },
              series: [
                { name: 'Credits Consumed', type: 'bar', stack: 'cr', barMaxWidth: 20, data: institutions.map((i) => i.consumed) },
                { name: 'Credits Remaining', type: 'bar', stack: 'cr', barMaxWidth: 20, itemStyle: { borderRadius: [0, 5, 5, 0] }, data: institutions.map((i) => i.remaining) },
              ],
            },
          },
          {
            id: 'inst-sector-donut',
            title: 'Contract Value by Institutional Sector',
            subtitle: 'Annual GHS contract value split',
            chartTypeBadge: 'Donut',
            span: 'third',
            height: 310,
            option: {
              color: GNP_PALETTE,
              tooltip: { ...BASE_TOOLTIP, trigger: 'item', formatter: '{b}: <b>₵{c}</b> ({d}%)' },
              legend: BOTTOM_LEGEND,
              series: [
                {
                  type: 'pie',
                  radius: ['44%', '70%'],
                  center: ['50%', '43%'],
                  itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                  label: { show: false },
                  data: [
                    { name: 'Academic Universities', value: 86000 },
                    { name: 'Government & Parliament', value: 85000 },
                    { name: 'Central Banking & Finance', value: 52000 },
                    { name: 'Law Firms & Litigation', value: 42000 },
                    { name: 'Diplomatic Missions', value: 24000 },
                  ],
                },
              ],
            },
          },
        ],
        tableTitle: 'Enterprise & Institutional Archive Credit Ledger',
        columns: [
          { key: 'institution', label: 'Institution' },
          { key: 'sector', label: 'Sector' },
          { key: 'seats', label: 'Seats', align: 'right', format: 'number' },
          { key: 'allocated', label: 'Allocated Credits', align: 'right', format: 'number' },
          { key: 'consumed', label: 'Consumed', align: 'right', format: 'number' },
          { key: 'remaining', label: 'Remaining', align: 'right', format: 'number' },
          { key: 'utilizationPct', label: 'Burn %', align: 'right', format: 'progress' },
          { key: 'contractGhs', label: 'Contract Value', align: 'right', format: 'currency' },
          { key: 'status', label: 'Alert State', align: 'center', format: 'badge' },
        ],
        rows: institutions,
        blueprint: {
          httpMethod: 'POST',
          endpoint: '/api/v1/reports/institutional-archive-credits',
          controllerMethod: 'ReportsController::generateInstitutionalArchiveCreditsReport',
          serviceMethod: 'ReportingService::getInstitutionalArchiveCredits(const ReportDto &dto)',
          cppDtoFields: ['startDate', 'endDate', 'status'],
          existingTables: [
            { table: 'commercial_partners', modelClass: 'drogon_model::Gnp::CommercialPartners', usedColumns: ['id', 'name', 'account_type'] },
          ],
          schemaGaps: [
            'Requires new `public.institutional_archive_accounts` and `public.archive_credit_transactions` tables backing `/admin/archives/institutions` and `/admin/archives/access-credits`.',
          ],
          recommendedTables: [
            {
              table: 'public.institutional_archive_accounts',
              changeType: 'new_table',
              summary: 'Tracks institutional research licenses, IP allowlists, seat limits, and credit balances.',
              keyColumns: ['institution_name', 'sector', 'credits_allocated', 'credits_remaining', 'contract_value_ghs'],
              ddlSnippet: 'CREATE TABLE IF NOT EXISTS public.institutional_archive_accounts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), institution_name VARCHAR(255) NOT NULL, sector VARCHAR(60) NOT NULL, credits_allocated INTEGER NOT NULL, credits_remaining INTEGER NOT NULL, contract_value_ghs NUMERIC(12,2) NOT NULL);',
            },
          ],
          sampleSqlQuery: `SELECT ia.institution_name, ia.sector, ia.seat_limit, ia.credits_allocated, ia.credits_remaining,
       (ia.credits_allocated - ia.credits_remaining) AS consumed, ia.contract_value_ghs
FROM public.institutional_archive_accounts ia
ORDER BY consumed DESC;`,
        },
      };
    }

    default:
      return null;
  }
}
