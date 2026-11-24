import type { Campaign, BaseApiResponse, BasePaginationModel } from '~/models';

export type MessagingChannel = 'push' | 'email' | 'sms';
export type AudienceType = 'all' | 'groups' | 'users';
export type DeliveryMode = 'now' | 'scheduled' | 'draft';
export type BroadcastStatus = 'sent' | 'scheduled' | 'draft' | 'cancelled';

export interface TargetUserSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plan?: string;
  group?: string;
  pushSubscribed?: boolean;
  country?: string;
}

export interface TargetUserGroup {
  id: string;
  name: string;
  type: string;
  description: string;
  memberCount: number;
  channels: {
    push: number;
    email: number;
    sms: number;
  };
}

export interface CampaignPreset {
  id: string;
  label: string;
  name: string;
  category: string;
  channels: MessagingChannel[];
  subject: string;
  preheader: string;
  pushTitle: string;
  pushBody: string;
  emailBody: string;
  smsBody: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface CampaignBroadcastRecord {
  id: string;
  name: string;
  category: string;
  channels: MessagingChannel[];
  audienceType: AudienceType;
  audienceLabel: string;
  audienceCount: number;
  selectedGroups?: { id: string; name: string; memberCount: number }[];
  selectedUsers?: TargetUserSummary[];
  subject: string;
  preheader: string;
  pushTitle: string;
  pushBody: string;
  emailBody: string;
  smsBody: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl?: string;
  deliveryMode: DeliveryMode;
  status: BroadcastStatus;
  metrics: {
    delivered: number;
    opened: number;
    clicked: number;
    openRate: number;
    ctr: number;
    revenueGhs: number;
  };
  createdBy: string;
  createdAt: string;
  sentAt: string | null;
  scheduledAt: string | null;
}

export interface CampaignsOverviewResult {
  kpis: {
    key: string;
    label: string;
    value: number;
    format: 'number' | 'percent' | 'currency';
    changePct?: number;
  }[];
  charts: any[];
  statusBreakdown: {
    all: number;
    sent: number;
    scheduled: number;
    draft: number;
    cancelled: number;
  };
  pushHealth: {
    activeWebPushSubscriptions: number;
    connectedLiveStreams: number;
  };
  recentBroadcasts: CampaignBroadcastRecord[];
  presets: CampaignPreset[];
}

export interface SubmitBroadcastPayload {
  id?: string;
  name: string;
  category: string;
  channels: MessagingChannel[];
  audienceType: AudienceType;
  selectedGroups?: { id: string; name: string; memberCount: number }[];
  selectedUsers?: TargetUserSummary[];
  deliveryMode: DeliveryMode;
  scheduledAt?: string | null;
  subject: string;
  preheader: string;
  pushTitle: string;
  pushBody: string;
  emailBody: string;
  smsBody: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl?: string;
}

// --- Unified Multi-Channel Campaign & Broadcast Services ---

export async function fetchCampaignsOverview(
  period: '7d' | '14d' | '30d' = '14d'
): Promise<CampaignsOverviewResult> {
  const res = await $fetch<BaseApiResponse<CampaignsOverviewResult>>(
    '/api/v1/campaigns/overview',
    { query: { period } }
  );
  return res.result;
}

export async function fetchCampaignHistory(params: {
  search?: string;
  status?: string;
  channel?: string;
  audienceType?: string;
} = {}): Promise<{ items: CampaignBroadcastRecord[]; total: number }> {
  const res = await $fetch<
    BaseApiResponse<{ items: CampaignBroadcastRecord[]; total: number }>
  >('/api/v1/campaigns/history', { query: params });
  return res.result;
}

export async function fetchCampaignById(
  id: string
): Promise<CampaignBroadcastRecord | null> {
  const res = await $fetch<BaseApiResponse<CampaignBroadcastRecord | null>>(
    '/api/v1/campaigns/item',
    { query: { id } }
  );
  return res.result;
}

export async function fetchTargetUserGroups(): Promise<TargetUserGroup[]> {
  const res = await $fetch<BaseApiResponse<TargetUserGroup[]>>(
    '/api/v1/campaigns/groups'
  );
  return res.result;
}

export async function searchTargetSubscribers(
  q = ''
): Promise<TargetUserSummary[]> {
  const res = await $fetch<BaseApiResponse<TargetUserSummary[]>>(
    '/api/v1/campaigns/users',
    { query: { q } }
  );
  return res.result;
}

export async function submitCampaignBroadcast(payload: SubmitBroadcastPayload) {
  const res = await $fetch<BaseApiResponse<CampaignBroadcastRecord>>(
    '/api/v1/campaigns/send',
    {
      method: 'POST',
      body: payload,
    }
  );
  return res.result;
}

export async function performCampaignLifecycleAction(
  id: string,
  action: 'publish' | 'cancel' | 'delete'
) {
  const res = await $fetch<BaseApiResponse<CampaignBroadcastRecord>>(
    '/api/v1/campaigns/action',
    {
      method: 'POST',
      body: { id, action },
    }
  );
  return res.result;
}

// --- Legacy Compatibility Exports ---

export async function getCampaigns(query: object) {
  const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<Campaign[]>>>(
    'admin/get-all-campaigns',
    '',
    { query }
  );
  return response.result;
}

export async function createCampaign(payload: object) {
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>(
    'admin/create-campaign',
    '',
    {
      method: 'post',
      body: payload,
    }
  );
  return response.result;
}

export async function publishCampaign(query: object) {
  const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<object[]>>>(
    'admin/publish-campaign',
    '',
    { query }
  );
  return response.success;
}

export async function deleteCampaign(query: object) {
  const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<object[]>>>(
    'admin/delete-campaign',
    '',
    { query }
  );
  return response.success;
}
