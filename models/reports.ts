export type ReportParameterKey =
  | 'dateRange'
  | 'partner'
  | 'plan'
  | 'status'
  | 'channel'
  | 'publication'
  | 'granularity';

export type ReportGranularity = 'day' | 'week' | 'month';

/**
 * Request contract mirroring an upgraded C++ `gnp::dto::ReportDto` in `gnp-api`.
 * Existing `ReportDto` supports `partnerId`, `startDate`, `endDate`; extending it with
 * optional filter fields enables a single uniform DTO across `ReportsController`.
 */
export interface ReportRequestDto {
  reportId?: string;
  startDate?: string;
  endDate?: string;
  partnerId?: string;
  publicationId?: string;
  plan?: string;
  status?: string;
  channel?: string;
  affiliateId?: string;
  gameType?: string;
  granularity?: ReportGranularity;
  pageNo?: number;
  pageSize?: number;
}

export interface ReportDefinition {
  id: string;
  groupId: string;
  name: string;
  shortName?: string;
  description: string;
  isSuggestedNew?: boolean;
  suggestedRationale?: string;
  parameters: ReportParameterKey[];
  endpoint: string;
}

export interface ReportGroupDefinition {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  reports: ReportDefinition[];
}

export interface ReportKpiMetric {
  key: string;
  label: string;
  value: string;
  rawValue: number;
  changePercent: number;
  changeDirection: 'up' | 'down' | 'flat';
  /** Whether an upward change is positive (false for churn, error rate, latency, failed payments, backlog). */
  positiveIsGood: boolean;
  subtitle: string;
  sparkline?: number[];
  sparklineType?: 'line' | 'bar';
}

export interface ReportChartSpec {
  id: string;
  title: string;
  subtitle?: string;
  chartTypeBadge: string;
  span: 'full' | 'half' | 'two-thirds' | 'third';
  height?: number;
  option: Record<string, any>;
}

export type ReportCellFormat =
  | 'text'
  | 'currency'
  | 'number'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'badge'
  | 'code'
  | 'progress';

export interface ReportTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: ReportCellFormat;
}

export interface ReportExistingTableRef {
  table: string;
  modelClass: string;
  usedColumns: string[];
  notes?: string;
}

export interface ReportRecommendedTableRef {
  table: string;
  changeType: 'new_table' | 'alter_table';
  summary: string;
  keyColumns: string[];
  ddlSnippet: string;
}

export interface ReportBackendBlueprint {
  httpMethod: 'POST' | 'GET';
  endpoint: string;
  controllerMethod: string;
  serviceMethod: string;
  cppDtoFields: string[];
  existingTables: ReportExistingTableRef[];
  schemaGaps: string[];
  recommendedTables: ReportRecommendedTableRef[];
  sampleSqlQuery: string;
}

export interface PartnerInvoiceLineItem {
  description: string;
  details: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PartnerInvoiceDocument {
  invoiceNo: string;
  date: string;
  dueDate: string;
  status: 'PAID' | 'PARTIALLY_PAID' | 'PENDING' | 'OVERDUE';
  billingPeriod: string;
  billedTo: {
    partnerId: string;
    name: string;
    identifier: string;
    contactName: string;
    address: string;
    email: string;
    phone: string;
    currency: string;
  };
  items: PartnerInvoiceLineItem[];
  subtotal: number;
  vat: number;
  getflNhil: number;
  discount: number;
  amountPaid: number;
  totalDue: number;
  balanceDue: number;
}

export interface GeneratedReportResult {
  reportMeta: {
    reportId: string;
    reportName: string;
    groupId: string;
    groupTitle: string;
    isSuggestedNew: boolean;
    generatedAt: string;
    currency: string;
    period: {
      startDate: string;
      endDate: string;
      totalDays: number;
      granularity: ReportGranularity;
    };
    appliedFilters: Record<string, string>;
  };
  executiveSummary: string;
  kpis: ReportKpiMetric[];
  charts: ReportChartSpec[];
  tableTitle: string;
  tableSubtitle?: string;
  columns: ReportTableColumn[];
  rows: Record<string, any>[];
  invoice?: PartnerInvoiceDocument;
  blueprint: ReportBackendBlueprint;
}

export interface SchemaMigrationRecommendation {
  id: string;
  tableName: string;
  changeType: 'new_table' | 'alter_table';
  domain: string;
  priority: 'P0 - Critical' | 'P1 - High' | 'P2 - Performance';
  title: string;
  problemInCurrentApi: string;
  solutionSummary: string;
  relatedExistingModels: string[];
  impactedReportIds: string[];
  columns: {
    name: string;
    pgType: string;
    nullable: boolean;
    description: string;
  }[];
  sqlDdl: string;
}

export interface ExistingApiFinding {
  id: string;
  severity: 'bug' | 'gap' | 'stub';
  locationInGnpApi: string;
  title: string;
  detail: string;
  recommendedFix: string;
}
