// Plain JavaScript mock data for Group 1: Revenue & Financial Reports
// Backend Target: https://github.com/rhyolite-prime/gnp-api (controllers/ReportsController.cc & PaymentsController.cc)

export const MOCK_PARTNERS_LIST = [
  {
    id: 'p-mtn-001',
    name: 'MTN Ghana PLC',
    address: 'MTN House, Independence Avenue, West Ridge\nAccra, Ghana',
    email: 'corporate.billing@mtn.com.gh',
    quota: 5000,
    enrolled: 3692,
    status: 'active',
  },
  {
    id: 'p-gcb-002',
    name: 'GCB Bank PLC',
    address: 'Thorpe Road, High Street\nAccra, Ghana',
    email: 'accounts.payable@gcbbank.com.gh',
    quota: 2500,
    enrolled: 2140,
    status: 'active',
  },
  {
    id: 'p-gnat-003',
    name: 'Ghana National Association of Teachers (GNAT)',
    address: 'GNAT Hall, Barnes Road, Adabraka\nAccra, Ghana',
    email: 'finance@ghanateachers.org',
    quota: 1500,
    enrolled: 1280,
    status: 'active',
  },
  {
    id: 'p-ug-004',
    name: 'University of Ghana (Balme Library)',
    address: 'Legon Boundary Road, Legon\nAccra, Ghana',
    email: 'library-acquisitions@ug.edu.gh',
    quota: 3000,
    enrolled: 2790,
    status: 'active',
  },
  {
    id: 'p-bog-005',
    name: 'Bank of Ghana Research Department',
    address: '1 Thorpe Road, P.O. Box GP 2674\nAccra, Ghana',
    email: 'research.admin@bog.gov.gh',
    quota: 800,
    enrolled: 685,
    status: 'active',
  },
];

export const FINANCIAL_REPORTS_MOCK = {
  // 1.1 Sales & Revenue Overview -> POST /api/v1/reports/sales-revenue
  // Source tables: payments, user_subscriptions, subscription_plans, commercial_partners, edition_sales_ledger (suggested)
  sales_revenue: {
    endpoint: '/api/v1/reports/sales-revenue',
    summary: [
      { key: 'grossRevenueGhs', label: 'Gross Revenue', value: 312480.0, format: 'currency', changePct: 18.4 },
      { key: 'netSettledGhs', label: 'Net Settled Revenue', value: 306230.4, format: 'currency', changePct: 17.9 },
      { key: 'paidTransactions', label: 'Paid Orders', value: 6842, format: 'number', changePct: 14.2 },
      { key: 'arpuGhs', label: 'Average Revenue / User', value: 45.67, format: 'currency', changePct: 3.6 },
    ],
    charts: [
      {
        id: 'revenue_by_stream',
        title: 'Revenue Stream Trend (Last 10 Months)',
        type: 'stacked_bar',
        span: 'full',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        yAxisLabel: 'GHS',
        series: [
          { name: 'Individual Subscriptions', data: [98400, 104200, 112500, 118900, 124600, 129800, 134200, 139500, 143800, 148200] },
          { name: 'Corporate B2B Invoices', data: [64000, 68500, 72000, 74500, 79000, 82400, 86000, 89200, 92800, 96400] },
          { name: 'Archive Credits & Single Copy', data: [31200, 34800, 38100, 41600, 44900, 48200, 52400, 57800, 63100, 67880] },
        ],
      },
      {
        id: 'revenue_by_plan_donut',
        title: 'Revenue Share by Subscription Plan',
        type: 'donut',
        items: [
          { name: 'Premium All-Access', value: 148200 },
          { name: 'Corporate Bulk Tier', value: 96400 },
          { name: 'Standard Daily Bundle', value: 42800 },
          { name: 'Single Edition Copy', value: 25080 },
        ],
      },
      {
        id: 'payment_channel_bar',
        title: 'Collections by Payment Channel (GHS)',
        type: 'horizontal_bar',
        labels: ['MTN Mobile Money', 'Corporate Bank EFT', 'Visa / Mastercard', 'Telecel Cash', 'AT Money'],
        series: [{ name: 'Settled (GHS)', data: [142800, 96400, 46920, 17840, 8520] }],
      },
    ],
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'revenueStream', label: 'Stream' },
      { key: 'plan', label: 'Plan Tier' },
      { key: 'orders', label: 'Orders', align: 'right', format: 'number' },
      { key: 'grossAmount', label: 'Gross (GHS)', align: 'right', format: 'currency' },
      { key: 'gatewayFees', label: 'Fees (GHS)', align: 'right', format: 'currency' },
      { key: 'netAmount', label: 'Net Settled (GHS)', align: 'right', format: 'currency' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { date: '2026-10-22', revenueStream: 'Individual Subscriptions', plan: 'premium', orders: 312, grossAmount: 18720.0, gatewayFees: 355.68, netAmount: 18364.32, status: 'Settled' },
      { date: '2026-10-21', revenueStream: 'Corporate B2B Invoice', plan: 'corporate', orders: 4, grossAmount: 48600.0, gatewayFees: 0.0, netAmount: 48600.0, status: 'Settled' },
      { date: '2026-10-20', revenueStream: 'Individual Subscriptions', plan: 'standard', orders: 268, grossAmount: 9380.0, gatewayFees: 178.22, netAmount: 9201.78, status: 'Settled' },
      { date: '2026-10-19', revenueStream: 'Single Edition Copy', plan: 'standard', orders: 495, grossAmount: 3960.0, gatewayFees: 75.24, netAmount: 3884.76, status: 'Settled' },
      { date: '2026-10-18', revenueStream: 'Archive Research Credits', plan: 'corporate', orders: 9, grossAmount: 13500.0, gatewayFees: 135.0, netAmount: 13365.0, status: 'Settled' },
      { date: '2026-10-17', revenueStream: 'Individual Subscriptions', plan: 'premium', orders: 289, grossAmount: 17340.0, gatewayFees: 329.46, netAmount: 17010.54, status: 'Settled' },
      { date: '2026-10-16', revenueStream: 'Corporate B2B Invoice', plan: 'corporate', orders: 3, grossAmount: 47800.0, gatewayFees: 0.0, netAmount: 47800.0, status: 'Pending' },
      { date: '2026-10-15', revenueStream: 'Individual Subscriptions', plan: 'standard', orders: 244, grossAmount: 8540.0, gatewayFees: 162.26, netAmount: 8377.74, status: 'Settled' },
    ],
  },

  // 1.2 Payment Transactions Log -> POST /api/v1/reports/payment-transactions
  // Source tables: payments (id, user_id, reference, amount, currency, channel, status, paid_at, metadata)
  payment_transactions: {
    endpoint: '/api/v1/reports/payment-transactions',
    summary: [
      { key: 'totalVolumeGhs', label: 'Processed Volume', value: 216080.0, format: 'currency', changePct: 15.1 },
      { key: 'successRatePct', label: 'Gateway Success Rate', value: 96.4, format: 'percent', changePct: 1.8 },
      { key: 'successfulCount', label: 'Successful Payments', value: 6595, format: 'number', changePct: 14.7 },
      { key: 'failedOrAbandoned', label: 'Failed / Abandoned', value: 247, format: 'number', changePct: -9.4 },
    ],
    charts: [
      {
        id: 'daily_gateway_outcomes',
        title: 'Daily Payment Outcomes (Paystack & Hubtel)',
        type: 'bar_line',
        span: 'full',
        labels: ['16 Oct', '17 Oct', '18 Oct', '19 Oct', '20 Oct', '21 Oct', '22 Oct'],
        yAxisLabel: 'Transactions',
        secondaryYAxisLabel: 'Success %',
        series: [
          { name: 'Successful', type: 'bar', data: [910, 945, 860, 980, 1015, 960, 925] },
          { name: 'Success Rate %', type: 'line', yAxisIndex: 1, data: [95.8, 96.2, 95.4, 96.9, 97.1, 96.5, 96.8] },
        ],
      },
      {
        id: 'payment_status_donut',
        title: 'Transactions by Status',
        type: 'donut',
        items: [
          { name: 'Active / Settled', value: 6595 },
          { name: 'Pending Webhook', value: 94 },
          { name: 'Failed / Declined', value: 153 },
        ],
      },
      {
        id: 'failure_reasons_bar',
        title: 'Top Payment Failure Reasons',
        type: 'horizontal_bar',
        labels: ['Insufficient MoMo Wallet', 'Prompt Timeout', '3DS OTP Expired', 'Card Issuer Declined'],
        series: [{ name: 'Count', data: [74, 41, 23, 15] }],
      },
    ],
    columns: [
      { key: 'reference', label: 'Paystack Ref' },
      { key: 'subscriber', label: 'Subscriber' },
      { key: 'channel', label: 'Payment Method' },
      { key: 'plan', label: 'Item / Plan' },
      { key: 'amount', label: 'Amount (GHS)', align: 'right', format: 'currency' },
      { key: 'paidAt', label: 'Timestamp' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { reference: 'PSK-GNP-904821', subscriber: 'Kwame Mensah', channel: 'MTN MoMo (***4821)', plan: 'Premium Monthly', amount: 60.0, paidAt: '2026-10-22 09:42', status: 'Active' },
      { reference: 'PSK-GNP-904819', subscriber: 'Ama Serwaa', channel: 'Visa Card (***1904)', plan: 'Annual All-Access', amount: 580.0, paidAt: '2026-10-22 09:18', status: 'Active' },
      { reference: 'PSK-GNP-904814', subscriber: 'Kofi Boateng', channel: 'Telecel Cash (***7730)', plan: 'Standard Monthly', amount: 35.0, paidAt: '2026-10-22 08:55', status: 'Pending' },
      { reference: 'PSK-GNP-904808', subscriber: 'Nana Yaa Asantewaa', channel: 'MTN MoMo (***6102)', plan: 'Daily Graphic Single Copy', amount: 8.0, paidAt: '2026-10-22 08:11', status: 'Active' },
      { reference: 'PSK-GNP-904799', subscriber: 'Yaw Darko', channel: 'MTN MoMo (***3309)', plan: 'Premium Monthly', amount: 60.0, paidAt: '2026-10-22 07:49', status: 'Failed' },
      { reference: 'PSK-GNP-904792', subscriber: 'Efua Sutherland', channel: 'Mastercard (***8821)', plan: 'Premium Quarterly', amount: 165.0, paidAt: '2026-10-21 19:24', status: 'Active' },
      { reference: 'PSK-GNP-904785', subscriber: 'Kojo Antwi', channel: 'AT Money (***5520)', plan: 'Graphic Business Bundle', amount: 45.0, paidAt: '2026-10-21 17:06', status: 'Active' },
    ],
  },

  // 1.3 Partner Invoices -> POST /api/v1/reports/partner-invoices
  // Note: Fixes statutory tax formula bug in CommercialPartnerService.cc:3679 (totalDue = subtotal + vat + getflNhil - discount)
  partner_invoices: {
    endpoint: '/api/v1/reports/partner-invoices',
    invoicesByPartner: {
      'p-mtn-001': {
        invoiceNo: 'INV-GNP-2026-1042',
        partnerId: 'p-mtn-001',
        partnerName: 'MTN Ghana PLC',
        partnerAddress: 'MTN House, Independence Avenue, West Ridge\nAccra, Ghana',
        partnerEmail: 'corporate.billing@mtn.com.gh',
        items: [
          { description: 'Corporate Digital Newsstand Seats — Daily Graphic & Graphic Business', details: '3,692 active employee seats × monthly enterprise rate', quantity: 3692, unitPrice: 12.5 },
          { description: 'Executive Weekend Bundle — The Mirror & Graphic Sports', details: 'Executive leadership allocation', quantity: 450, unitPrice: 8.0 },
          { description: 'Partner Content Syndication API Overages', details: 'Verified feed calls above 100k monthly tier', quantity: 120, unitPrice: 15.0 },
        ],
        subtotal: 51550.0,
        vat: 7732.5,
        getflNhil: 2577.5,
        discount: 2577.5,
        totalDue: 59282.5,
      },
      'p-gcb-002': {
        invoiceNo: 'INV-GNP-2026-1043',
        partnerId: 'p-gcb-002',
        partnerName: 'GCB Bank PLC',
        partnerAddress: 'Thorpe Road, High Street\nAccra, Ghana',
        partnerEmail: 'accounts.payable@gcbbank.com.gh',
        items: [
          { description: 'Corporate Branch Network Seats — Daily Graphic & Graphic Business', details: '2,140 active branch & treasury seats', quantity: 2140, unitPrice: 12.0 },
          { description: 'Research Archive Access — Economic & Banking Clippings', details: 'Treasury & Risk research desk license', quantity: 1, unitPrice: 4500.0 },
        ],
        subtotal: 30180.0,
        vat: 4527.0,
        getflNhil: 1509.0,
        discount: 0.0,
        totalDue: 36216.0,
      },
      'p-gnat-003': {
        invoiceNo: 'INV-GNP-2026-1044',
        partnerId: 'p-gnat-003',
        partnerName: 'Ghana National Association of Teachers (GNAT)',
        partnerAddress: 'GNAT Hall, Barnes Road, Adabraka\nAccra, Ghana',
        partnerEmail: 'finance@ghanateachers.org',
        items: [
          { description: 'Regional Secretariat Digital Subscriptions — Daily Graphic & Junior Graphic', details: '1,280 regional & district education seats', quantity: 1280, unitPrice: 10.0 },
        ],
        subtotal: 12800.0,
        vat: 1920.0,
        getflNhil: 640.0,
        discount: 640.0,
        totalDue: 14720.0,
      },
      'p-ug-004': {
        invoiceNo: 'INV-GNP-2026-1045',
        partnerId: 'p-ug-004',
        partnerName: 'University of Ghana (Balme Library)',
        partnerAddress: 'Legon Boundary Road, Legon\nAccra, Ghana',
        partnerEmail: 'library-acquisitions@ug.edu.gh',
        items: [
          { description: 'Campus-Wide Academic Seat Allocation — All 6 Graphic Publications', details: '2,790 faculty & postgraduate seats', quantity: 2790, unitPrice: 9.5 },
          { description: '1950–2026 Digitized Archive & AI RAG Research Credits', details: '5,000 institutional archive research credits', quantity: 5000, unitPrice: 1.2 },
        ],
        subtotal: 32505.0,
        vat: 4875.75,
        getflNhil: 1625.25,
        discount: 1625.25,
        totalDue: 37380.75,
      },
      'p-bog-005': {
        invoiceNo: 'INV-GNP-2026-1046',
        partnerId: 'p-bog-005',
        partnerName: 'Bank of Ghana Research Department',
        partnerAddress: '1 Thorpe Road, P.O. Box GP 2674\nAccra, Ghana',
        partnerEmail: 'research.admin@bog.gov.gh',
        items: [
          { description: 'Monetary Policy & Financial Press Enterprise Seats', details: '685 active seats across BoG departments', quantity: 685, unitPrice: 15.0 },
          { description: 'Macroeconomic Archive & Vector Search API Access', details: 'Monthly institutional API tier', quantity: 1, unitPrice: 3500.0 },
        ],
        subtotal: 13775.0,
        vat: 2066.25,
        getflNhil: 688.75,
        discount: 0.0,
        totalDue: 16530.0,
      },
    },
    charts: [
      {
        id: 'partner_billing_comparison',
        title: 'Partner Invoice Totals (Net vs Statutory Taxes)',
        type: 'stacked_bar',
        labels: ['MTN Ghana', 'Univ. of Ghana', 'GCB Bank', 'Bank of Ghana', 'GNAT'],
        yAxisLabel: 'GHS',
        series: [
          { name: 'Net Subtotal', data: [48972.5, 30879.75, 30180.0, 13775.0, 12160.0] },
          { name: 'VAT + GETFund/NHIL (20%)', data: [10310.0, 6501.0, 6036.0, 2755.0, 2560.0] },
        ],
      },
      {
        id: 'invoice_collection_status',
        title: 'Receivables Aging Breakdown',
        type: 'donut',
        items: [
          { name: 'Paid on Time', value: 112008.5 },
          { name: 'Current (Due < 14d)', value: 36216.0 },
          { name: 'Overdue (15–30d)', value: 15904.75 },
        ],
      },
    ],
  },

  // 1.4 Subscription Renewals & Churn -> POST /api/v1/reports/subscription-renewals
  // Source tables: user_subscriptions + subscription_lifecycle_events (suggested new table)
  subscription_renewals: {
    endpoint: '/api/v1/reports/subscription-renewals',
    summary: [
      { key: 'renewalRatePct', label: 'Auto-Renewal Rate', value: 87.6, format: 'percent', changePct: 2.9 },
      { key: 'monthlyChurnPct', label: 'Monthly Churn Rate', value: 2.4, format: 'percent', changePct: -0.5 },
      { key: 'netMrrAddedGhs', label: 'Net MRR Movement', value: 19450.0, format: 'currency', changePct: 11.4 },
      { key: 'recoveredDunning', label: 'MoMo Dunning Recovered', value: 318, format: 'number', changePct: 22.0 },
    ],
    charts: [
      {
        id: 'mrr_bridge_trend',
        title: 'Monthly Subscription Lifecycle Volume',
        type: 'bar_line',
        span: 'full',
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        yAxisLabel: 'Subscribers',
        secondaryYAxisLabel: 'Churn %',
        series: [
          { name: 'Renewed Subscriptions', type: 'bar', data: [2940, 3110, 3260, 3390, 3520, 3685] },
          { name: 'Churned / Expired', type: 'bar', data: [118, 112, 105, 99, 94, 89] },
          { name: 'Churn Rate %', type: 'line', yAxisIndex: 1, data: [3.4, 3.1, 2.9, 2.7, 2.5, 2.4] },
        ],
      },
      {
        id: 'churn_reasons_donut',
        title: 'Churn Breakdown by Cause',
        type: 'donut',
        items: [
          { name: 'Involuntary (MoMo Balance)', value: 46 },
          { name: 'Switched to Single Copy', value: 21 },
          { name: 'Card Expired', value: 14 },
          { name: 'Voluntary Cancellation', value: 8 },
        ],
      },
      {
        id: 'renewal_by_plan_bar',
        title: 'Renewal Rate by Plan Tier (%)',
        type: 'horizontal_bar',
        labels: ['Corporate Annual', 'Premium Annual', 'Premium Monthly', 'Standard Monthly', 'Weekly Pass'],
        series: [{ name: 'Renewal %', data: [96.8, 92.4, 88.1, 83.5, 68.2] }],
      },
    ],
    columns: [
      { key: 'planName', label: 'Subscription Plan' },
      { key: 'dueForRenewal', label: 'Due for Renewal', align: 'right', format: 'number' },
      { key: 'renewedCount', label: 'Renewed', align: 'right', format: 'number' },
      { key: 'dunningRecovered', label: 'Dunning Recovered', align: 'right', format: 'number' },
      { key: 'churnedCount', label: 'Churned', align: 'right', format: 'number' },
      { key: 'renewalRate', label: 'Renewal Rate', align: 'right', format: 'percent' },
      { key: 'retainedMrr', label: 'Retained MRR (GHS)', align: 'right', format: 'currency' },
    ],
    rows: [
      { planName: 'Premium Monthly (GHS 60)', dueForRenewal: 1840, renewedCount: 1621, dunningRecovered: 148, churnedCount: 41, renewalRate: 88.1, retainedMrr: 97260.0 },
      { planName: 'Standard Monthly (GHS 35)', dueForRenewal: 1290, renewedCount: 1077, dunningRecovered: 112, churnedCount: 31, renewalRate: 83.5, retainedMrr: 37695.0 },
      { planName: 'Premium Annual (GHS 580)', dueForRenewal: 420, renewedCount: 388, dunningRecovered: 29, churnedCount: 9, renewalRate: 92.4, retainedMrr: 20300.0 },
      { planName: 'Corporate Bulk Tier', dueForRenewal: 615, renewedCount: 599, dunningRecovered: 29, churnedCount: 8, renewalRate: 96.8, retainedMrr: 96400.0 },
    ],
  },

  // 1.5 [SUGGESTED] Single-Copy Paywall & Guest Checkout Funnel -> POST /api/v1/reports/single-copy-paywall-funnel
  // Source tables: newspapers + payments + edition_sales_ledger (suggested new table)
  single_copy_paywall_funnel: {
    endpoint: '/api/v1/reports/single-copy-paywall-funnel',
    isSuggested: true,
    summary: [
      { key: 'paywallViews', label: 'Paywall Impressions', value: 48920, format: 'number', changePct: 21.4 },
      { key: 'singleCopiesSold', label: 'Single Copies Sold', value: 3135, format: 'number', changePct: 16.8 },
      { key: 'conversionRatePct', label: 'Paywall Conversion', value: 6.4, format: 'percent', changePct: 0.9 },
      { key: 'upsoldToPlan', label: 'Upgraded to Full Plan', value: 428, format: 'number', changePct: 27.5 },
    ],
    charts: [
      {
        id: 'paywall_conversion_funnel',
        title: 'Edition Paywall Conversion Funnel',
        type: 'funnel',
        items: [
          { name: '1. Preview Page Opened', value: 48920 },
          { name: '2. Paywall Modal Triggered', value: 19450 },
          { name: '3. Payment Prompt Initiated', value: 5280 },
          { name: '4. Single Copy Purchased', value: 3135 },
          { name: '5. Converted to Recurring Plan (30d)', value: 428 },
        ],
      },
      {
        id: 'single_copy_by_publication',
        title: 'Single-Copy Revenue by Publication (GHS)',
        type: 'horizontal_bar',
        labels: ['Daily Graphic', 'The Mirror', 'Graphic Business', 'Graphic Sports', 'Graphic Showbiz', 'Junior Graphic'],
        series: [{ name: 'Revenue (GHS)', data: [11840, 5120, 3890, 2240, 1190, 800] }],
      },
    ],
    columns: [
      { key: 'publication', label: 'Publication' },
      { key: 'issueDate', label: 'Edition Date' },
      { key: 'previewReaders', label: 'Preview Views', align: 'right', format: 'number' },
      { key: 'copiesSold', label: 'Copies Sold', align: 'right', format: 'number' },
      { key: 'convRate', label: 'Conversion %', align: 'right', format: 'percent' },
      { key: 'revenueGhs', label: 'Revenue (GHS)', align: 'right', format: 'currency' },
    ],
    rows: [
      { publication: 'Daily Graphic — Budget Preview Special', issueDate: '2026-10-22', previewReaders: 9420, copiesSold: 742, convRate: 7.9, revenueGhs: 5936.0 },
      { publication: 'Graphic Business — MPC Rate Decision Issue', issueDate: '2026-10-20', previewReaders: 6180, copiesSold: 495, convRate: 8.0, revenueGhs: 4950.0 },
      { publication: 'The Mirror — Weekend Lifestyle Edition', issueDate: '2026-10-18', previewReaders: 7850, copiesSold: 612, convRate: 7.8, revenueGhs: 4896.0 },
      { publication: 'Graphic Sports — Black Stars Qualifier Issue', issueDate: '2026-10-17', previewReaders: 5490, copiesSold: 389, convRate: 7.1, revenueGhs: 2723.0 },
      { publication: 'Junior Graphic — STEM Olympiad Edition', issueDate: '2026-10-16', previewReaders: 3120, copiesSold: 214, convRate: 6.9, revenueGhs: 1284.0 },
    ],
  },

  // 1.6 Revenue by Publication -> POST /api/v1/reports/revenue-by-publication
  // Source tables: edition_sales_ledger, payments, publications, newspapers, user_subscriptions
  revenue_by_publication: {
    endpoint: '/api/v1/reports/revenue-by-publication',
    summary: [
      { key: 'totalRevenueGhs', label: 'Total Revenue', value: 312480.0, format: 'currency', changePct: 18.4 },
      { key: 'subscriptionRevenueGhs', label: 'Subscription Revenue', value: 198600.0, format: 'currency', changePct: 14.2 },
      { key: 'singleCopyRevenueGhs', label: 'Single-Copy Revenue', value: 113880.0, format: 'currency', changePct: 22.8 },
      { key: 'topPublicationSharePct', label: 'Top Publication Share', value: 34.2, format: 'percent', changePct: 1.9 },
    ],
    charts: [
      {
        id: 'revenue_by_publication_bar',
        title: 'Revenue by Publication (GHS)',
        type: 'horizontal_bar',
        span: 'full',
        labels: ['Daily Graphic', 'Graphic Business', 'The Mirror', 'Graphic Sports', 'Graphic Showbiz', 'Junior Graphic'],
        series: [{ name: 'Revenue (GHS)', data: [106870, 62480, 48220, 36140, 31250, 27520] }],
      },
      {
        id: 'publication_revenue_trend',
        title: 'Monthly Revenue Split by Publication (Top 4 + Others)',
        type: 'stacked_bar',
        span: 'full',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        yAxisLabel: 'GHS',
        series: [
          { name: 'Daily Graphic', data: [8200, 8640, 9100, 9420, 9880, 10240, 10610, 11020, 11480, 18280] },
          { name: 'Graphic Business', data: [4820, 5010, 5240, 5480, 5720, 5940, 6180, 6420, 6710, 6960] },
          { name: 'The Mirror', data: [3680, 3820, 3960, 4100, 4240, 4380, 4520, 4680, 4840, 5000] },
          { name: 'Other Publications', data: [7220, 7480, 7720, 7960, 8220, 8460, 8720, 8980, 9260, 9520] },
        ],
      },
      {
        id: 'revenue_share_donut',
        title: 'Revenue Share by Publication',
        type: 'donut',
        items: [
          { name: 'Daily Graphic', value: 106870 },
          { name: 'Graphic Business', value: 62480 },
          { name: 'The Mirror', value: 48220 },
          { name: 'Graphic Sports', value: 36140 },
          { name: 'Graphic Showbiz', value: 31250 },
          { name: 'Junior Graphic', value: 27520 },
        ],
      },
    ],
    columns: [
      { key: 'publication', label: 'Publication' },
      { key: 'copiesSold', label: 'Copies Sold', align: 'right', format: 'number' },
      { key: 'activeSubscriptions', label: 'Active Subscriptions', align: 'right', format: 'number' },
      { key: 'subscriptionRevenue', label: 'Subscription (GHS)', align: 'right', format: 'currency' },
      { key: 'singleCopyRevenue', label: 'Single-Copy (GHS)', align: 'right', format: 'currency' },
      { key: 'totalRevenue', label: 'Total (GHS)', align: 'right', format: 'currency' },
      { key: 'sharePct', label: 'Share', align: 'right', format: 'percent' },
      { key: 'status', label: 'Status', format: 'badge' },
    ],
    rows: [
      { publication: 'Daily Graphic', copiesSold: 18420, activeSubscriptions: 3980, subscriptionRevenue: 84200.0, singleCopyRevenue: 22670.0, totalRevenue: 106870.0, sharePct: 34.2, status: 'Active' },
      { publication: 'Graphic Business', copiesSold: 9240, activeSubscriptions: 2310, subscriptionRevenue: 44180.0, singleCopyRevenue: 18300.0, totalRevenue: 62480.0, sharePct: 20.0, status: 'Active' },
      { publication: 'The Mirror', copiesSold: 8120, activeSubscriptions: 1740, subscriptionRevenue: 28220.0, singleCopyRevenue: 20000.0, totalRevenue: 48220.0, sharePct: 15.4, status: 'Active' },
      { publication: 'Graphic Sports', copiesSold: 6890, activeSubscriptions: 1220, subscriptionRevenue: 18640.0, singleCopyRevenue: 17500.0, totalRevenue: 36140.0, sharePct: 11.6, status: 'Active' },
      { publication: 'Graphic Showbiz', copiesSold: 5940, activeSubscriptions: 980, subscriptionRevenue: 14120.0, singleCopyRevenue: 17130.0, totalRevenue: 31250.0, sharePct: 10.0, status: 'Active' },
      { publication: 'Junior Graphic', copiesSold: 4210, activeSubscriptions: 860, subscriptionRevenue: 9240.0, singleCopyRevenue: 18280.0, totalRevenue: 27520.0, sharePct: 8.8, status: 'Active' },
    ],
  },

  // 1.7 Subscription Expiry & Renewal History -> POST /api/v1/reports/subscription-expiry-renewals
  // Source tables: user_subscriptions, subscription_lifecycle_events, subscription_plans, users
  subscription_expiry_renewals: {
    endpoint: '/api/v1/reports/subscription-expiry-renewals',
    summary: [
      { key: 'activeSubscriptions', label: 'Active Subscriptions', value: 4218, format: 'number', changePct: 3.2 },
      { key: 'expiringIn7Days', label: 'Expiring in 7 Days', value: 186, format: 'number', changePct: -4.5 },
      { key: 'expiringIn30Days', label: 'Expiring in 30 Days', value: 742, format: 'number', changePct: 2.1 },
      { key: 'renewedLast30Days', label: 'Renewed (Last 30 Days)', value: 512, format: 'number', changePct: 6.8 },
      { key: 'lapsedExpiries', label: 'Lapsed After Expiry (30d)', value: 89, format: 'number', changePct: -11.2 },
    ],
    charts: [
      {
        id: 'expiry_renewal_trend',
        title: 'Expiring vs Renewed Subscriptions by Month',
        type: 'bar_line',
        span: 'full',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        yAxisLabel: 'Subscriptions',
        secondaryYAxisLabel: 'Renewal Rate %',
        series: [
          { name: 'Expiring', type: 'bar', data: [610, 625, 640, 655, 668, 682, 695, 710, 726, 742] },
          { name: 'Renewed', type: 'bar', data: [468, 482, 496, 505, 518, 524, 536, 548, 562, 574] },
          { name: 'Renewal Rate', type: 'line', yAxisIndex: 1, data: [76.7, 77.1, 77.5, 77.1, 77.5, 76.8, 77.1, 77.2, 77.4, 77.4] },
        ],
      },
      {
        id: 'renewal_outcomes_donut',
        title: 'Renewal Outcomes (Last 30 Days)',
        type: 'donut',
        items: [
          { name: 'Renewed (Auto-Renew)', value: 312 },
          { name: 'Renewed (Manual)', value: 200 },
          { name: 'Downgraded', value: 38 },
          { name: 'Cancelled', value: 62 },
          { name: 'Lapsed (No Renewal)', value: 89 },
        ],
      },
      {
        id: 'expiring_by_plan_bar',
        title: 'Expiring in 30 Days by Plan',
        type: 'horizontal_bar',
        labels: ['Premium All-Access', 'Standard Daily Bundle', 'Corporate Bulk Tier', 'Student / Promo'],
        series: [{ name: 'Expiring Subscriptions', data: [318, 244, 126, 54] }],
      },
    ],
    columns: [
      { key: 'subscriber', label: 'Subscriber' },
      { key: 'email', label: 'Email' },
      { key: 'plan', label: 'Plan' },
      { key: 'billingCycle', label: 'Billing' },
      { key: 'startedOn', label: 'Started' },
      { key: 'expiresOn', label: 'Expires' },
      { key: 'daysLeft', label: 'Days Left', align: 'right', format: 'number' },
      { key: 'autoRenew', label: 'Auto-Renew' },
      { key: 'renewalStatus', label: 'Renewal Status', format: 'badge' },
      { key: 'lastRenewalOn', label: 'Last Renewal' },
    ],
    rows: [
      { subscriber: 'Ama Serwaa Mensah', email: 'ama.mensah@example.com.gh', plan: 'premium', billingCycle: 'Monthly', startedOn: '2026-09-28', expiresOn: '2026-10-28', daysLeft: 5, autoRenew: 'Enabled', renewalStatus: 'Pending Renewal', lastRenewalOn: '2026-09-28' },
      { subscriber: 'Kwame Boateng', email: 'kwame.boateng@example.com.gh', plan: 'standard', billingCycle: 'Monthly', startedOn: '2026-10-01', expiresOn: '2026-10-31', daysLeft: 8, autoRenew: 'Enabled', renewalStatus: 'Active', lastRenewalOn: '2026-10-01' },
      { subscriber: 'Efua Nyarko', email: 'e.nyarko@glaghana.org', plan: 'corporate', billingCycle: 'Annual', startedOn: '2026-08-15', expiresOn: '2026-11-15', daysLeft: 23, autoRenew: 'Enabled', renewalStatus: 'Active', lastRenewalOn: '2025-11-15' },
      { subscriber: 'Kofi Asante', email: 'kofi.asante@example.com.gh', plan: 'premium', billingCycle: 'Quarterly', startedOn: '2026-07-01', expiresOn: '2026-08-31', daysLeft: -53, autoRenew: 'Disabled', renewalStatus: 'Expired', lastRenewalOn: '2026-07-01' },
      { subscriber: 'Akosua Adjei', email: 'akosua.adjei@example.com.gh', plan: 'standard', billingCycle: 'Monthly', startedOn: '2026-09-22', expiresOn: '2026-10-22', daysLeft: -1, autoRenew: 'Disabled', renewalStatus: 'Pending Renewal', lastRenewalOn: '2026-09-22' },
      { subscriber: 'Yaw Ofori-Atta', email: 'y.ofori-att@mogep.gov.gh', plan: 'corporate', billingCycle: 'Annual', startedOn: '2025-11-01', expiresOn: '2026-10-30', daysLeft: 7, autoRenew: 'Enabled', renewalStatus: 'Active', lastRenewalOn: '2025-11-01' },
      { subscriber: 'Abena Asare', email: 'abena.asare@glaghana.org', plan: 'standard', billingCycle: 'Monthly', startedOn: '2026-08-20', expiresOn: '2026-10-24', daysLeft: 1, autoRenew: 'Disabled', renewalStatus: 'Pending Renewal', lastRenewalOn: '2026-09-20' },
      { subscriber: 'Nii Lante Armah', email: 'n.armah@ecobank.com.gh', plan: 'premium', billingCycle: 'Annual', startedOn: '2025-10-15', expiresOn: '2026-10-14', daysLeft: -9, autoRenew: 'Disabled', renewalStatus: 'Cancelled', lastRenewalOn: '2025-10-15' },
      { subscriber: 'Selorm Agbeko', email: 's.agbeko@gij.edu.gh', plan: 'standard', billingCycle: 'Monthly', startedOn: '2026-09-26', expiresOn: '2026-10-26', daysLeft: 3, autoRenew: 'Enabled', renewalStatus: 'Active', lastRenewalOn: '2026-09-26' },
      { subscriber: 'Joyce Mensima', email: 'j.mensima@melcom.com.gh', plan: 'standard', billingCycle: 'Monthly', startedOn: '2026-06-11', expiresOn: '2026-09-11', daysLeft: -42, autoRenew: 'Disabled', renewalStatus: 'Expired', lastRenewalOn: '2026-06-11' },
    ],
  },
};
