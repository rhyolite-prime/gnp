import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEChartOptionFromPlainData } from '../utils/reportChartOption.js';
import { FINANCIAL_REPORTS_MOCK } from '../mocks/reports/financialReports.js';

test('invoice donut uses the API subscription items and values', () => {
  const invoice = FINANCIAL_REPORTS_MOCK.partner_invoices.invoicesByPartner['p-mtn-001'];
  const chart = invoice.charts.find((item) => item.type === 'donut');
  assert.equal(chart.title, 'New vs Renewed Subscription Invoices (GHS, pre-tax)');
  const option = buildEChartOptionFromPlainData(chart);
  assert.equal(option.series[0].type, 'pie');
  assert.deepEqual(option.series[0].data, [
    { name: 'New subscriptions', value: 14904 },
    { name: 'Renewed subscriptions', value: 10434 },
  ]);
  assert.equal(option.series[0].stillShowZeroSum, false);
});

test('other invoice mock donuts reflect the selected invoice line items', () => {
  for (const [id, invoice] of Object.entries(FINANCIAL_REPORTS_MOCK.partner_invoices.invoicesByPartner)) {
    if (id === 'p-mtn-001' || id === '5731e4cd-8226-43b8-81c4-cb436fa0a007') continue;
    const chart = invoice.charts.find((item) => item.type === 'donut');
    assert.deepEqual(chart.items, invoice.items.map(({ description, amount }) => ({ name: description, value: amount })));
  }
});

test('donut safely handles missing or empty items', () => {
  for (const items of [undefined, [], null]) {
    assert.deepEqual(buildEChartOptionFromPlainData({ type: 'donut', items }).series[0].data, []);
  }
});
