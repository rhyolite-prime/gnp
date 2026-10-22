import type { GeneratedReportResult, ReportRequestDto } from '~/models/reports';
import { REPORT_GROUPS } from '~/utils/reportsSchemaCatalog';
import { generatePart1Report } from '~/utils/reportsGeneratorsPart1';
import { generatePart2Report } from '~/utils/reportsGeneratorsPart2';

export function findReportByIdOrSlug(idOrSlug: string) {
  for (const group of REPORT_GROUPS) {
    for (const report of group.reports) {
      const slug = report.endpoint.replace('/api/v1/reports/', '');
      if (report.id === idOrSlug || slug === idOrSlug) {
        return { report, group };
      }
    }
  }
  return null;
}

export function generateMockReportById(
  idOrSlug: string,
  dto: ReportRequestDto = {}
): GeneratedReportResult {
  const match = findReportByIdOrSlug(idOrSlug) || {
    report: REPORT_GROUPS[0].reports[0],
    group: REPORT_GROUPS[0],
  };

  const res =
    generatePart1Report(match.report.id, match.report, match.group, dto) ||
    generatePart2Report(match.report.id, match.report, match.group, dto);

  if (!res) {
    throw new Error(`No generator registered for report: ${match.report.id}`);
  }
  return res;
}
