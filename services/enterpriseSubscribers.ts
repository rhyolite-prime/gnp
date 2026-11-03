import {
  listEnterprises,
  getAllEnterprises,
  getEnterpriseById,
  getEnterpriseUsers,
  createEnterprise,
  approveEnterprise,
  rejectEnterprise,
  setEnterpriseStatus,
  addEnterpriseUsers,
  importEnterpriseUsers,
  assignEnterprisePackage,
  parseEnterpriseUsersCsv,
  MOCK_ENTERPRISE_PACKAGES,
  MOCK_ENTERPRISE_STATUS_OPTIONS,
  MOCK_ENTERPRISE_TYPE_OPTIONS,
  MOCK_ENTERPRISE_STATUS_LABELS,
  MOCK_ENTERPRISE_USERS_CSV_TEMPLATE,
} from '~/mocks/enterpriseSubscribers/index.js';

/**
 * Enterprise Subscribers service — backed by plain JavaScript mock objects & arrays
 * (`~/mocks/enterpriseSubscribers`). Shapes follow the `gnp-api` tables (`commercial_partners`-style
 * orgs, `subscription_plans`, `users` + `user_subscriptions` seats), so wiring the real API later is
 * a straight swap to `gnpAdminUserHttpClient` against:
 *
 *   GET  /api/v1/admin/enterprises?query=&status=&packageId=&pageNo=&pageSize=
 *   POST /api/v1/admin/enterprises                    (onboard — creates `pending`)
 *   POST /api/v1/admin/enterprises/{id}/approve       | /reject
 *   POST /api/v1/admin/enterprises/{id}/users         (manual onboarding)
 *   POST /api/v1/admin/enterprises/{id}/users/import  (CSV bulk onboarding)
 *   PUT  /api/v1/admin/enterprises/{id}/package       (assign / change package)
 *   PUT  /api/v1/admin/enterprises/{id}/status        (suspend / reinstate)
 *
 * All endpoints return the standard envelope `{ status, success, message, result }`.
 */

export interface EnterpriseSubscriber {
  id: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  accountType: 'corporate' | 'institution' | 'government' | 'sme';
  address: string;
  region: string;
  packageId: string | null;
  packageName: string | null;
  billingCycle: string | null;
  subscriberQuota: number;
  enrolledUsers: number;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectionReason?: string;
}

export interface EnterpriseUserRow {
  id: string;
  enterpriseId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: 'manual' | 'csv';
  status: 'active';
  createdAt: string;
}

export interface EnterpriseCsvRow {
  line: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  valid: boolean;
  error: string;
}

export interface EnterpriseListQuery {
  query?: string;
  status?: string;
  packageId?: string;
  pageNo?: number;
  pageSize?: number;
}

export {
  MOCK_ENTERPRISE_PACKAGES,
  MOCK_ENTERPRISE_STATUS_OPTIONS,
  MOCK_ENTERPRISE_TYPE_OPTIONS,
  MOCK_ENTERPRISE_STATUS_LABELS,
  MOCK_ENTERPRISE_USERS_CSV_TEMPLATE,
};

export const fetchEnterprises = (dto: EnterpriseListQuery = {}) => listEnterprises(dto);
export const fetchAllEnterprises = () => getAllEnterprises();
export const fetchEnterpriseById = (id: string) => getEnterpriseById(id);
export const fetchEnterpriseUsers = (enterpriseId: string, limit?: number) =>
  getEnterpriseUsers(enterpriseId, limit);

export const onboardEnterprise = (payload: Partial<EnterpriseSubscriber> & { organizationName: string; contactName: string; contactEmail: string }) =>
  createEnterprise(payload);

export const approveEnterpriseById = (id: string) => approveEnterprise(id);
export const rejectEnterpriseById = (id: string, reason?: string) => rejectEnterprise(id, reason);
export const updateEnterpriseStatus = (id: string, status: 'active' | 'suspended') =>
  setEnterpriseStatus(id, status);

export const onboardEnterpriseUsersManually = (
  enterpriseId: string,
  users: Array<{ firstName: string; lastName: string; email: string; phone?: string }>
) => addEnterpriseUsers(enterpriseId, users);

export const onboardEnterpriseUsersFromCsv = (enterpriseId: string, rows: EnterpriseCsvRow[]) =>
  importEnterpriseUsers(enterpriseId, rows);

export const assignPackageToEnterprise = (
  enterpriseId: string,
  dto: { packageId: string; billingCycle?: string; subscriberQuota?: number }
) => assignEnterprisePackage(enterpriseId, dto);

export const parseUsersCsv = (text: string) => parseEnterpriseUsersCsv(text);
