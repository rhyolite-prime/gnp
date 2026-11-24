import type { BaseApiResponse } from '~/models';
import type {
  DiscoverCmsConfig,
  DiscoverCmsItem,
  DiscoverCmsStatus,
  RememberWhenConfig,
  RememberWhenSlide,
  RememberWhenStatus,
} from '~/utils/cmsContent';

export interface DiscoverCmsListResult {
  items: DiscoverCmsItem[];
  config: DiscoverCmsConfig;
  stats: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    pinned: number;
  };
}

export interface RememberWhenCmsListResult {
  slides: RememberWhenSlide[];
  config: RememberWhenConfig;
  stats: {
    total: number;
    published: number;
    draft: number;
  };
}

// ── Discover CMS Service ──────────────────────────────────────────────────────

export async function fetchDiscoverCms(params: {
  status?: string;
  kind?: string;
  q?: string;
  publishedOnly?: boolean;
} = {}): Promise<DiscoverCmsListResult> {
  const res = await $fetch<BaseApiResponse<DiscoverCmsListResult>>('/api/v1/cms/discover', {
    query: params,
  });
  return res.result;
}

export async function createDiscoverCmsItem(payload: Partial<DiscoverCmsItem>): Promise<DiscoverCmsItem> {
  const res = await $fetch<BaseApiResponse<DiscoverCmsItem>>('/api/v1/cms/discover', {
    method: 'POST',
    body: payload,
  });
  return res.result;
}

export async function updateDiscoverCmsItem(id: string, payload: Partial<DiscoverCmsItem>): Promise<DiscoverCmsItem> {
  const res = await $fetch<BaseApiResponse<DiscoverCmsItem>>(`/api/v1/cms/discover/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: payload,
  });
  return res.result;
}

export async function toggleDiscoverCmsItem(
  id: string,
  patch: { status?: DiscoverCmsStatus; pinned?: boolean },
): Promise<DiscoverCmsItem> {
  const res = await $fetch<BaseApiResponse<DiscoverCmsItem>>(`/api/v1/cms/discover/${encodeURIComponent(id)}/status`, {
    method: 'POST',
    body: patch,
  });
  return res.result;
}

export async function deleteDiscoverCmsItem(id: string): Promise<boolean> {
  const res = await $fetch<BaseApiResponse<{ deleted: boolean }>>(`/api/v1/cms/discover/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return Boolean(res.result?.deleted);
}

export async function reorderDiscoverCmsItems(ids: string[]): Promise<DiscoverCmsItem[]> {
  const res = await $fetch<BaseApiResponse<DiscoverCmsItem[]>>('/api/v1/cms/discover/reorder', {
    method: 'POST',
    body: { ids },
  });
  return res.result;
}

export async function updateDiscoverCmsConfig(config: Partial<DiscoverCmsConfig>): Promise<DiscoverCmsConfig> {
  const res = await $fetch<BaseApiResponse<DiscoverCmsConfig>>('/api/v1/cms/discover/config', {
    method: 'PUT',
    body: config,
  });
  return res.result;
}

// ── Remember When CMS Service ─────────────────────────────────────────────────

export async function fetchRememberWhenCms(params: {
  status?: string;
  q?: string;
  publishedOnly?: boolean;
} = {}): Promise<RememberWhenCmsListResult> {
  const res = await $fetch<BaseApiResponse<RememberWhenCmsListResult>>('/api/v1/cms/remember-when', {
    query: params,
  });
  return res.result;
}

export async function createRememberWhenSlide(payload: Partial<RememberWhenSlide>): Promise<RememberWhenSlide> {
  const res = await $fetch<BaseApiResponse<RememberWhenSlide>>('/api/v1/cms/remember-when', {
    method: 'POST',
    body: payload,
  });
  return res.result;
}

export async function updateRememberWhenSlide(id: string, payload: Partial<RememberWhenSlide>): Promise<RememberWhenSlide> {
  const res = await $fetch<BaseApiResponse<RememberWhenSlide>>(`/api/v1/cms/remember-when/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: payload,
  });
  return res.result;
}

export async function toggleRememberWhenSlide(id: string, status: RememberWhenStatus): Promise<RememberWhenSlide> {
  const res = await $fetch<BaseApiResponse<RememberWhenSlide>>(`/api/v1/cms/remember-when/${encodeURIComponent(id)}/status`, {
    method: 'POST',
    body: { status },
  });
  return res.result;
}

export async function deleteRememberWhenSlide(id: string): Promise<boolean> {
  const res = await $fetch<BaseApiResponse<{ deleted: boolean }>>(`/api/v1/cms/remember-when/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  return Boolean(res.result?.deleted);
}

export async function reorderRememberWhenSlides(ids: string[]): Promise<RememberWhenSlide[]> {
  const res = await $fetch<BaseApiResponse<RememberWhenSlide[]>>('/api/v1/cms/remember-when/reorder', {
    method: 'POST',
    body: { ids },
  });
  return res.result;
}

export async function updateRememberWhenConfig(config: Partial<RememberWhenConfig>): Promise<RememberWhenConfig> {
  const res = await $fetch<BaseApiResponse<RememberWhenConfig>>('/api/v1/cms/remember-when/config', {
    method: 'PUT',
    body: config,
  });
  return res.result;
}
