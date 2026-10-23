// Plain-JavaScript mock datasets & API blueprint for Admin Enterprise Subscribers
// (onboard & approve enterprises, onboard their users manually / via CSV, assign subscription packages).
//
// Shapes follow `gnp-api` (C++ Drogon + PostgreSQL) tables & DTOs so this file doubles as the
// backend contract:
//   - `commercial_partners`-style orgs (organization_name, contact_name, contact_email, contact_phone,
//     account_type, address, subscriber_quota, default_subscription_plan_id, status)
//   - `subscription_plans` (name, plan_type, description, pricing, target_publications, user quota)
//   - `users` + `user_subscriptions` rows created under an enterprise (partner_id), with
//     `CreatePartnerSubscriberDto` (manual) and bulk CSV upload flows.
//
// Suggested endpoints (standard GNP envelope `{ status, success, message, result }`):
//   GET    /api/v1/admin/enterprises?query=&status=&packageId=&pageNo=&pageSize=
//   POST   /api/v1/admin/enterprises                       (onboard — creates `pending`)
//   POST   /api/v1/admin/enterprises/{id}/approve
//   POST   /api/v1/admin/enterprises/{id}/reject
//   POST   /api/v1/admin/enterprises/{id}/users            (manual onboarding, array of users)
//   POST   /api/v1/admin/enterprises/{id}/users/import     (CSV bulk onboarding)
//   PUT    /api/v1/admin/enterprises/{id}/package          (assign / change subscription package)
//   PUT    /api/v1/admin/enterprises/{id}/status           (suspend / reinstate)

/** "Today" used for mock timestamps. */
export const MOCK_ENTERPRISE_AS_OF = '2026-10-23';

// ── Subscription packages (table: `subscription_plans`) ────────────────────────────────────────
export const MOCK_ENTERPRISE_PACKAGES = [
  {
    id: 'pkg-campus',
    name: 'Corporate Campus Bundle',
    planType: 'corporate',
    description: 'Daily Graphic, The Mirror & Junior Graphic for institutional seats',
    pricing: 'GHS 1,200.00 / year',
    targetPublications: ['Daily Graphic', 'The Mirror', 'Junior Graphic'],
    userQuota: 500,
    billingCycles: ['annual'],
  },
  {
    id: 'pkg-premium-ent',
    name: 'Enterprise Premium',
    planType: 'premium',
    description: 'All 6 publications + 1950–2026 Digital Archives for every seat',
    pricing: 'GHS 2,400.00 / year',
    targetPublications: ['Daily Graphic', 'Graphic Business', 'The Mirror', 'Graphic Sports', 'Graphic Showbiz', 'Junior Graphic'],
    userQuota: 250,
    billingCycles: ['annual', 'quarterly'],
  },
  {
    id: 'pkg-standard-ent',
    name: 'Enterprise Standard',
    planType: 'standard',
    description: 'Daily Graphic digital edition for every seat',
    pricing: 'GHS 600.00 / year',
    targetPublications: ['Daily Graphic'],
    userQuota: 50,
    billingCycles: ['annual', 'monthly'],
  },
];

// ── Enterprise subscribers (orgs) ──────────────────────────────────────────────────────────────
export const MOCK_ENTERPRISES = [
  {
    id: 'ent-501',
    organizationName: 'Ghana Library Authority',
    contactName: 'Efua Nyarko',
    contactEmail: 'e.nyarko@glaghana.org',
    contactPhone: '+233 27 555 0103',
    accountType: 'institution',
    address: 'PO Box 663, Accra',
    region: 'Greater Accra',
    packageId: 'pkg-campus',
    packageName: 'Corporate Campus Bundle',
    billingCycle: 'annual',
    subscriberQuota: 100,
    enrolledUsers: 42,
    status: 'active',
    createdAt: '2026-08-15T09:30:00Z',
    approvedAt: '2026-08-16T10:00:00Z',
    approvedBy: 'admin@graphicnewsplus.com',
  },
  {
    id: 'ent-502',
    organizationName: 'Ecobank Ghana Ltd',
    contactName: 'Nii Lante Armah',
    contactEmail: 'n.armah@ecobank.com.gh',
    contactPhone: '+233 30 555 0202',
    accountType: 'corporate',
    address: '2 Morocco Lane, Accra',
    region: 'Greater Accra',
    packageId: 'pkg-premium-ent',
    packageName: 'Enterprise Premium',
    billingCycle: 'annual',
    subscriberQuota: 250,
    enrolledUsers: 180,
    status: 'active',
    createdAt: '2026-06-02T11:15:00Z',
    approvedAt: '2026-06-03T08:45:00Z',
    approvedBy: 'admin@graphicnewsplus.com',
  },
  {
    id: 'ent-503',
    organizationName: 'University of Ghana, Legon',
    contactName: 'Dr. Abena Osei',
    contactEmail: 'a.osei@ug.edu.gh',
    contactPhone: '+233 30 555 0303',
    accountType: 'institution',
    address: 'PO Box LG 25, Legon, Accra',
    region: 'Greater Accra',
    packageId: 'pkg-campus',
    packageName: 'Corporate Campus Bundle',
    billingCycle: 'annual',
    subscriberQuota: 500,
    enrolledUsers: 310,
    status: 'active',
    createdAt: '2026-05-20T14:00:00Z',
    approvedAt: '2026-05-21T09:30:00Z',
    approvedBy: 'admin@graphicnewsplus.com',
  },
  {
    id: 'ent-504',
    organizationName: 'Ghana Institute of Journalism',
    contactName: 'Selorm Agbeko',
    contactEmail: 's.agbeko@gij.edu.gh',
    contactPhone: '+233 24 555 0404',
    accountType: 'institution',
    address: 'Ring Road East, Accra',
    region: 'Greater Accra',
    packageId: null,
    packageName: null,
    billingCycle: null,
    subscriberQuota: 0,
    enrolledUsers: 0,
    status: 'pending',
    createdAt: '2026-10-20T10:22:00Z',
    approvedAt: null,
    approvedBy: null,
  },
  {
    id: 'ent-505',
    organizationName: 'Melcom Ltd',
    contactName: 'Joyce Mensima',
    contactEmail: 'j.mensima@melcom.com.gh',
    contactPhone: '+233 30 555 0505',
    accountType: 'sme',
    address: 'Plot 12, Spintex Road, Accra',
    region: 'Greater Accra',
    packageId: 'pkg-standard-ent',
    packageName: 'Enterprise Standard',
    billingCycle: 'monthly',
    subscriberQuota: 50,
    enrolledUsers: 24,
    status: 'suspended',
    createdAt: '2026-07-11T08:05:00Z',
    approvedAt: '2026-07-12T10:10:00Z',
    approvedBy: 'admin@graphicnewsplus.com',
  },
  {
    id: 'ent-506',
    organizationName: 'Ministry of Information',
    contactName: 'Yaw Ofori-Atta',
    contactEmail: 'y.ofori-att@mogep.gov.gh',
    contactPhone: '+233 30 555 0606',
    accountType: 'government',
    address: 'State House, Accra',
    region: 'Greater Accra',
    packageId: 'pkg-premium-ent',
    packageName: 'Enterprise Premium',
    billingCycle: 'annual',
    subscriberQuota: 150,
    enrolledUsers: 0,
    status: 'pending',
    createdAt: '2026-10-22T16:40:00Z',
    approvedAt: null,
    approvedBy: null,
  },
  {
    id: 'ent-507',
    organizationName: 'Kasoa Municipal Assembly',
    contactName: 'Kwesi Baidoo',
    contactEmail: 'k.baidoo@kasoa.gov.gh',
    contactPhone: '+233 24 555 0707',
    accountType: 'government',
    address: 'Kasoa, Central Region',
    region: 'Central',
    packageId: null,
    packageName: null,
    billingCycle: null,
    subscriberQuota: 0,
    enrolledUsers: 0,
    status: 'rejected',
    createdAt: '2026-09-30T12:00:00Z',
    approvedAt: null,
    approvedBy: null,
    rejectionReason: 'Incomplete registration documents',
  },
];

// ── Enterprise users (onboarded seats) ─────────────────────────────────────────────────────────
export const MOCK_ENTERPRISE_USERS = [
  { id: 'eu-9001', enterpriseId: 'ent-501', firstName: 'Abena', lastName: 'Asare', email: 'abena.asare@glaghana.org', phone: '+233 24 000 1111', source: 'csv', status: 'active', createdAt: '2026-08-20T09:00:00Z' },
  { id: 'eu-9002', enterpriseId: 'ent-501', firstName: 'Kojo', lastName: 'Danquah', email: 'kojo.danquah@glaghana.org', phone: '+233 24 000 1112', source: 'csv', status: 'active', createdAt: '2026-08-20T09:00:00Z' },
  { id: 'eu-9003', enterpriseId: 'ent-501', firstName: 'Adwoa', lastName: 'Pinamang', email: 'adwoa.pinamang@glaghana.org', phone: '+233 24 000 1113', source: 'manual', status: 'active', createdAt: '2026-09-02T14:30:00Z' },
  { id: 'eu-9004', enterpriseId: 'ent-502', firstName: 'Nii', lastName: 'Quaye', email: 'nii.quaye@ecobank.com.gh', phone: '+233 30 000 2222', source: 'csv', status: 'active', createdAt: '2026-06-10T10:00:00Z' },
  { id: 'eu-9005', enterpriseId: 'ent-502', firstName: 'Ama', lastName: 'Bruce', email: 'ama.bruce@ecobank.com.gh', phone: '+233 30 000 2223', source: 'csv', status: 'active', createdAt: '2026-06-10T10:00:00Z' },
  { id: 'eu-9006', enterpriseId: 'ent-503', firstName: 'Yaw', lastName: 'Boateng', email: 'yaw.boateng@ug.edu.gh', phone: '+233 30 000 3333', source: 'csv', status: 'active', createdAt: '2026-05-25T11:45:00Z' },
  { id: 'eu-9007', enterpriseId: 'ent-503', firstName: 'Efua', lastName: 'Sarpong', email: 'efua.sarpong@ug.edu.gh', phone: '+233 30 000 3334', source: 'manual', status: 'active', createdAt: '2026-06-15T09:20:00Z' },
  { id: 'eu-9008', enterpriseId: 'ent-505', firstName: 'Kofi', lastName: 'Amoah', email: 'kofi.amoah@melcom.com.gh', phone: '+233 30 000 5555', source: 'manual', status: 'active', createdAt: '2026-07-18T13:10:00Z' },
];

// ── Option catalogs ────────────────────────────────────────────────────────────────────────────
export const MOCK_ENTERPRISE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending Approval' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'rejected', label: 'Rejected' },
];

export const MOCK_ENTERPRISE_TYPE_OPTIONS = [
  { value: 'corporate', label: 'Corporate' },
  { value: 'institution', label: 'Educational Institution' },
  { value: 'government', label: 'Government / Public Sector' },
  { value: 'sme', label: 'SME' },
];

export const MOCK_ENTERPRISE_STATUS_LABELS = {
  pending: 'Pending Approval',
  active: 'Active',
  suspended: 'Suspended',
  rejected: 'Rejected',
};

// ── CSV parsing (shared by the CSV import modal & backend bulk upload) ─────────────────────────
const splitCsvLine = (line) => {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Parses an enterprise-users CSV (columns: firstName,lastName,email,phone).
 * Returns per-row validation so the UI can preview before importing.
 */
export function parseEnterpriseUsersCsv(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { rows: [], totalRows: 0, validCount: 0, invalidCount: 0 };
  }

  const firstCells = splitCsvLine(lines[0]).map((c) => c.toLowerCase());
  const hasHeader = firstCells.includes('email');
  const colIndex = hasHeader
    ? {
        firstName: Math.max(0, firstCells.indexOf('firstname')),
        lastName: Math.max(0, firstCells.indexOf('lastname')),
        email: Math.max(0, firstCells.indexOf('email')),
        phone: Math.max(1, firstCells.indexOf('phone')),
      }
    : { firstName: 0, lastName: 1, email: 2, phone: 3 };

  const bodyLines = hasHeader ? lines.slice(1) : lines;
  const seenEmails = new Set();

  const rows = bodyLines.map((line, i) => {
    const cells = splitCsvLine(line);
    const row = {
      line: i + (hasHeader ? 2 : 1),
      firstName: cells[colIndex.firstName] || '',
      lastName: cells[colIndex.lastName] || '',
      email: (cells[colIndex.email] || '').toLowerCase(),
      phone: cells[colIndex.phone] || '',
      valid: true,
      error: '',
    };

    if (!row.firstName || !row.lastName) {
      row.valid = false;
      row.error = 'First & last name are required';
    } else if (!row.email || !EMAIL_RE.test(row.email)) {
      row.valid = false;
      row.error = 'A valid email is required';
    } else if (seenEmails.has(row.email)) {
      row.valid = false;
      row.error = 'Duplicate email in file';
    }
    seenEmails.add(row.email);
    return row;
  });

  return {
    rows,
    totalRows: rows.length,
    validCount: rows.filter((r) => r.valid).length,
    invalidCount: rows.filter((r) => !r.valid).length,
  };
}

/** Canonical CSV template shown in the import modal. */
export const MOCK_ENTERPRISE_USERS_CSV_TEMPLATE =
  'firstName,lastName,email,phone\n' +
  'Jane,Doe,jane.doe@org.example,+233 20 000 0001\n' +
  'John,Mensah,john.mensah@org.example,+233 20 000 0002\n';

// ── Service functions (backend API blueprint) ──────────────────────────────────────────────────

let enterpriseSeq = 600;
let userSeq = 9100;

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

/** Filtered + paginated enterprise list. */
export function listEnterprises(dto = {}) {
  const { query = '', status = '', packageId = '', pageNo = 1, pageSize = 30 } = dto;
  const q = String(query).trim().toLowerCase();

  let rows = MOCK_ENTERPRISES.filter((ent) => {
    if (q) {
      const haystack = `${ent.organizationName} ${ent.contactName} ${ent.contactEmail} ${ent.contactPhone}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (status && ent.status !== status) return false;
    if (packageId && ent.packageId !== packageId) return false;
    return true;
  }).slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const totalCount = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePageNo = Math.min(Math.max(1, pageNo), totalPages);
  const lowerBound = totalCount === 0 ? 0 : (safePageNo - 1) * pageSize + 1;
  const upperBound = Math.min(safePageNo * pageSize, totalCount);
  const data = rows.slice((safePageNo - 1) * pageSize, safePageNo * pageSize).map(deepCopy);

  return { data, pageNo: safePageNo, pageSize, totalCount, totalPages, lowerBound, upperBound };
}

/** All enterprises (for selects / totals). */
export function getAllEnterprises() {
  return MOCK_ENTERPRISES.map(deepCopy);
}

export function getEnterpriseById(id) {
  const ent = MOCK_ENTERPRISES.find((e) => e.id === id);
  return ent ? deepCopy(ent) : null;
}

/** Recently onboarded users for one enterprise (details modal). */
export function getEnterpriseUsers(enterpriseId, limit = 10) {
  return MOCK_ENTERPRISE_USERS
    .filter((u) => u.enterpriseId === enterpriseId)
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit)
    .map(deepCopy);
}

/** Onboard a new enterprise — always created as `pending` for admin approval. */
export function createEnterprise(payload) {
  enterpriseSeq += 1;
  const pkg = MOCK_ENTERPRISE_PACKAGES.find((p) => p.id === payload.packageId) || null;
  const ent = {
    id: `ent-${enterpriseSeq}`,
    organizationName: payload.organizationName,
    contactName: payload.contactName,
    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone || '',
    accountType: payload.accountType || 'corporate',
    address: payload.address || '',
    region: payload.region || '',
    packageId: pkg ? pkg.id : null,
    packageName: pkg ? pkg.name : null,
    billingCycle: payload.billingCycle || (pkg ? pkg.billingCycles[0] : null),
    subscriberQuota: Number(payload.subscriberQuota) || (pkg ? pkg.userQuota : 0),
    enrolledUsers: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    approvedAt: null,
    approvedBy: null,
  };
  MOCK_ENTERPRISES.unshift(ent);
  return deepCopy(ent);
}

/** Approve a pending enterprise (`pending` -> `active`). */
export function approveEnterprise(id) {
  const ent = MOCK_ENTERPRISES.find((e) => e.id === id);
  if (!ent) return null;
  ent.status = 'active';
  ent.approvedAt = new Date().toISOString();
  ent.approvedBy = 'admin@graphicnewsplus.com';
  return deepCopy(ent);
}

/** Reject a pending enterprise (`pending` -> `rejected`). */
export function rejectEnterprise(id, reason = '') {
  const ent = MOCK_ENTERPRISES.find((e) => e.id === id);
  if (!ent) return null;
  ent.status = 'rejected';
  ent.rejectionReason = reason || 'Rejected during review';
  return deepCopy(ent);
}

/** Suspend / reinstate an approved enterprise. */
export function setEnterpriseStatus(id, status) {
  const ent = MOCK_ENTERPRISES.find((e) => e.id === id);
  if (!ent) return null;
  ent.status = status;
  return deepCopy(ent);
}

/**
 * Manually onboard users for an enterprise.
 * `users` = [{ firstName, lastName, email, phone }]
 */
export function addEnterpriseUsers(enterpriseId, users) {
  const ent = MOCK_ENTERPRISES.find((e) => e.id === enterpriseId);
  if (!ent) return { created: [], skipped: 0, enrolledUsers: 0 };

  const existingEmails = new Set(
    MOCK_ENTERPRISE_USERS.filter((u) => u.enterpriseId === enterpriseId).map((u) => u.email)
  );
  const created = [];
  let skipped = 0;

  for (const u of users) {
    const email = String(u.email || '').toLowerCase().trim();
    if (!u.firstName || !u.lastName || !email || !EMAIL_RE.test(email) || existingEmails.has(email)) {
      skipped += 1;
      continue;
    }
    userSeq += 1;
    existingEmails.add(email);
    const row = {
      id: `eu-${userSeq}`,
      enterpriseId,
      firstName: String(u.firstName).trim(),
      lastName: String(u.lastName).trim(),
      email,
      phone: String(u.phone || '').trim(),
      source: 'manual',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    MOCK_ENTERPRISE_USERS.push(row);
    created.push(row);
    ent.enrolledUsers += 1;
  }

  return { created: created.map(deepCopy), skipped, enrolledUsers: ent.enrolledUsers };
}

/**
 * Bulk onboard users parsed from CSV (`rows` = output of `parseEnterpriseUsersCsv().rows`).
 * Only valid rows are imported; duplicate emails (vs existing seats) are skipped.
 */
export function importEnterpriseUsers(enterpriseId, rows) {
  const validUsers = rows.filter((r) => r.valid).map((r) => ({
    firstName: r.firstName,
    lastName: r.lastName,
    email: r.email,
    phone: r.phone,
  }));

  const ent = MOCK_ENTERPRISES.find((e) => e.id === enterpriseId);
  if (!ent) return { created: [], skipped: 0, enrolledUsers: 0 };

  const existingEmails = new Set(
    MOCK_ENTERPRISE_USERS.filter((u) => u.enterpriseId === enterpriseId).map((u) => u.email)
  );
  const created = [];
  let skipped = rows.length - validUsers.length; // invalid rows

  for (const u of validUsers) {
    const email = String(u.email || '').toLowerCase().trim();
    if (!EMAIL_RE.test(email) || existingEmails.has(email)) {
      skipped += 1;
      continue;
    }
    userSeq += 1;
    existingEmails.add(email);
    const row = {
      id: `eu-${userSeq}`,
      enterpriseId,
      firstName: String(u.firstName).trim(),
      lastName: String(u.lastName).trim(),
      email,
      phone: String(u.phone || '').trim(),
      source: 'csv',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    MOCK_ENTERPRISE_USERS.push(row);
    created.push(row);
    ent.enrolledUsers += 1;
  }

  return { created: created.map(deepCopy), skipped, enrolledUsers: ent.enrolledUsers };
}

/** Assign / change the enterprise's subscription package. */
export function assignEnterprisePackage(enterpriseId, { packageId, billingCycle, subscriberQuota }) {
  const ent = MOCK_ENTERPRISES.find((e) => e.id === enterpriseId);
  const pkg = MOCK_ENTERPRISE_PACKAGES.find((p) => p.id === packageId);
  if (!ent || !pkg) return null;

  ent.packageId = pkg.id;
  ent.packageName = pkg.name;
  ent.billingCycle = billingCycle || pkg.billingCycles[0];
  ent.subscriberQuota = Number(subscriberQuota) || pkg.userQuota;
  return deepCopy(ent);
}
