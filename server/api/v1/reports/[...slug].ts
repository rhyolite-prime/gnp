import { defineEventHandler, getQuery, readBody } from 'h3';
import { getMockReportData } from '~/mocks/reports/index.js';

export default defineEventHandler(async (event) => {
  const slugParam = event.context.params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || 'sales-revenue';

  const query = getQuery(event);
  let body: Record<string, any> = {};
  if (event.method === 'POST') {
    try {
      body = (await readBody(event)) || {};
    } catch {
      body = {};
    }
  }

  const params = { ...query, ...body };

  if (slug === 'send-partner-invoice-email') {
    return {
      success: true,
      message: 'Partner invoice dispatched via email.',
      unAuthorizedRequest: false,
      error: null,
      result: true,
    };
  }

  const result = getMockReportData(slug, params);

  return {
    success: true,
    message: 'Report generated successfully.',
    unAuthorizedRequest: false,
    error: null,
    result,
  };
});
