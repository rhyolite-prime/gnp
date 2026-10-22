import { defineEventHandler, getQuery, readBody } from 'h3';
import type { ReportRequestDto } from '~/models/reports';
import { generateMockReportById } from '~/utils/reportsMockEngine';
import {
  EXISTING_GNP_API_FINDINGS,
  MOCK_COMMERCIAL_PARTNERS,
  RECOMMENDED_CPP_REPORT_DTO,
  REPORT_GROUPS,
  SCHEMA_MIGRATION_RECOMMENDATIONS,
  buildFullSqlMigrationScript,
} from '~/utils/reportsSchemaCatalog';

export default defineEventHandler(async (event) => {
  const slugParam = event.context.params?.slug;
  const route = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || '';
  const method = event.method;
  const query = getQuery(event);
  const body = method === 'POST' ? await readBody<ReportRequestDto>(event).catch(() => ({})) : {};

  if (route === 'catalog' && method === 'GET') {
    return {
      success: true,
      message: 'Report catalog retrieved successfully.',
      unAuthorizedRequest: false,
      error: null,
      result: {
        totalGroups: REPORT_GROUPS.length,
        totalReports: REPORT_GROUPS.reduce((acc, g) => acc + g.reports.length, 0),
        suggestedNewReports: REPORT_GROUPS.flatMap((g) => g.reports).filter((r) => r.isSuggestedNew).length,
        groups: REPORT_GROUPS,
      },
    };
  }

  if (route === 'schema-recommendations' && method === 'GET') {
    return {
      success: true,
      message: 'Backend schema audit & SQL migration blueprint retrieved successfully.',
      unAuthorizedRequest: false,
      error: null,
      result: {
        findings: EXISTING_GNP_API_FINDINGS,
        recommendedCppDto: RECOMMENDED_CPP_REPORT_DTO,
        migrations: SCHEMA_MIGRATION_RECOMMENDATIONS,
        fullSqlScript: buildFullSqlMigrationScript(),
      },
    };
  }

  if (route === 'partners-list') {
    return {
      success: true,
      message: 'Commercial partners loaded.',
      unAuthorizedRequest: false,
      error: null,
      result: {
        pageNo: 1,
        totalCount: MOCK_COMMERCIAL_PARTNERS.length,
        totalPages: 1,
        lowerBound: 1,
        upperBound: MOCK_COMMERCIAL_PARTNERS.length,
        data: MOCK_COMMERCIAL_PARTNERS,
      },
    };
  }

  if (route === 'send-partner-invoice-email') {
    const partner = MOCK_COMMERCIAL_PARTNERS.find((p) => p.id === body?.partnerId) || MOCK_COMMERCIAL_PARTNERS[0];
    return {
      success: true,
      message: `Invoice dispatched via SMTP to ${partner.billingEmail}.`,
      unAuthorizedRequest: false,
      error: null,
      result: {
        sent: true,
        recipient: partner.billingEmail,
        partnerName: partner.name,
        dispatchedAt: new Date().toISOString(),
      },
    };
  }

  const dto: ReportRequestDto = {
    ...query,
    ...body,
  };

  const reportPayload = generateMockReportById(route, dto);

  return {
    success: true,
    message: `${reportPayload.reportMeta.reportName} generated successfully.`,
    unAuthorizedRequest: false,
    error: null,
    result: reportPayload,
  };
});
