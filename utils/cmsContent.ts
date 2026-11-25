import { CONTENT_CATEGORIES, type ContentCategoryId } from './contentCategories.ts';
import { feedImage, feedText, personaliseFeedItem, type DiscoverItem } from './discoverFeed.ts';
import { getYoutubeEmbedUrl } from './latestVideos.ts';

export type DiscoverCmsStatus = 'published' | 'draft' | 'archived';
export type DiscoverCmsKind = DiscoverItem['kind'];

export interface DiscoverCmsItem {
  id: string;
  kind: DiscoverCmsKind;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  href: string;
  source: string;
  date: string;
  topics: string[];
  accessTier: 'public' | 'subscriber';
  videoUrl: string;
  linkedEntityId: string;
  pinned: boolean;
  displayOrder: number;
  status: DiscoverCmsStatus;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoverCmsConfig {
  heading: string;
  subheading: string;
  includeLiveCatalogue: boolean;
  prioritizePinned: boolean;
}

export type RememberWhenStatus = 'published' | 'draft';

export interface RememberWhenSlide {
  id: string;
  label: string;
  date: string;
  publicationName: string;
  headline: string;
  description: string;
  keywords?: string[];
  imageUrl: string;
  archiveId: string;
  ctaLabel: string;
  ctaUrl: string;
  displayOrder: number;
  status: RememberWhenStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RememberWhenConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  autoplayMs: number;
  fallbackToArchiveDates: boolean;
}

export const DEFAULT_DISCOVER_CMS_CONFIG: DiscoverCmsConfig = {
  heading: 'Discover',
  subheading: 'For you',
  includeLiveCatalogue: true,
  prioritizePinned: true,
};

export const DEFAULT_REMEMBER_WHEN_CONFIG: RememberWhenConfig = {
  eyebrow: 'The stories stay with us',
  title: 'Remember when?',
  subtitle: 'A look back at the news, moments and conversations worth remembering.',
  autoplayMs: 8000,
  fallbackToArchiveDates: true,
};

const VALID_KINDS = new Set<DiscoverCmsKind>(['story', 'video', 'newspaper', 'archive']);
const VALID_DISCOVER_STATUSES = new Set<DiscoverCmsStatus>(['published', 'draft', 'archived']);
const VALID_REMEMBER_STATUSES = new Set<RememberWhenStatus>(['published', 'draft']);

/** Accepts relative paths like `/archives/123` or `http(s):` URLs, rejecting `javascript:`, `data:`, etc. */
export function sanitizeCmsUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

export function normalizeTopics(input: unknown): string[] {
  const list = Array.isArray(input)
    ? input
    : typeof input === 'string'
      ? input.split(',')
      : [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of list) {
    if (typeof raw !== 'string') continue;
    const cleaned = raw.trim();
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(cleaned);
  }
  return result;
}

export function validateDiscoverCmsPayload(
  input: Record<string, unknown>,
  existing?: Partial<DiscoverCmsItem>,
): { valid: boolean; errors: string[]; data?: Omit<DiscoverCmsItem, 'id' | 'createdAt' | 'updatedAt'> } {
  const errors: string[] = [];
  const kind = (typeof input.kind === 'string' && VALID_KINDS.has(input.kind as DiscoverCmsKind)
    ? input.kind
    : existing?.kind ?? 'story') as DiscoverCmsKind;

  const title = feedText(input.title ?? existing?.title ?? '').slice(0, 200);
  if (!title) {
    errors.push('Title is required.');
  }

  const excerpt = feedText(input.excerpt ?? existing?.excerpt ?? '').slice(0, 600);
  const body = typeof (input.body ?? existing?.body) === 'string'
    ? String(input.body ?? existing?.body).trim()
    : '';

  const rawImage = input.image ?? existing?.image ?? '';
  const image = rawImage ? feedImage(rawImage) : '';
  if (typeof rawImage === 'string' && rawImage.trim() && !image) {
    errors.push('Image URL must be an https://, http://, or site-relative / path.');
  }

  const rawHref = input.href ?? existing?.href ?? '';
  const href = rawHref ? sanitizeCmsUrl(rawHref) : '';
  if (typeof rawHref === 'string' && rawHref.trim() && !href) {
    errors.push('Target link must be an https://, http://, or site-relative / path.');
  }

  const videoUrl = typeof (input.videoUrl ?? existing?.videoUrl) === 'string'
    ? String(input.videoUrl ?? existing?.videoUrl).trim()
    : '';
  if (kind === 'video' && videoUrl && !getYoutubeEmbedUrl({ filePath: videoUrl }) && !sanitizeCmsUrl(videoUrl)) {
    errors.push('Video URL must be a valid YouTube or HTTP(S) URL.');
  }

  const status = (typeof input.status === 'string' && VALID_DISCOVER_STATUSES.has(input.status as DiscoverCmsStatus)
    ? input.status
    : existing?.status ?? 'draft') as DiscoverCmsStatus;

  const accessTier = (input.accessTier ?? existing?.accessTier) === 'subscriber' ? 'subscriber' : 'public';
  const source = feedText(input.source ?? existing?.source ?? '') || defaultSourceForKind(kind);

  const rawDate = typeof (input.date ?? existing?.date) === 'string'
    ? String(input.date ?? existing?.date).trim()
    : '';
  const date = rawDate || new Date().toISOString().slice(0, 10);

  const rawExpires = input.expiresAt !== undefined ? input.expiresAt : existing?.expiresAt;
  const expiresAt = typeof rawExpires === 'string' && rawExpires.trim() ? rawExpires.trim() : null;

  const pinned = typeof input.pinned === 'boolean' ? input.pinned : Boolean(existing?.pinned);
  const rawOrder = Number(input.displayOrder ?? existing?.displayOrder ?? 100);
  const displayOrder = Number.isFinite(rawOrder) && rawOrder >= 0 ? Math.round(rawOrder) : 100;

  const topics = input.topics !== undefined
    ? normalizeTopics(input.topics)
    : existing?.topics ?? [];

  const linkedEntityId = typeof (input.linkedEntityId ?? existing?.linkedEntityId) === 'string'
    ? String(input.linkedEntityId ?? existing?.linkedEntityId).trim()
    : '';

  const publishedAt = status === 'published'
    ? (existing?.publishedAt || new Date().toISOString())
    : (existing?.publishedAt ?? null);

  if (errors.length) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      kind,
      title,
      excerpt,
      body,
      image,
      href,
      source,
      date,
      topics,
      accessTier,
      videoUrl,
      linkedEntityId,
      pinned,
      displayOrder,
      status,
      publishedAt,
      expiresAt,
    },
  };
}

function defaultSourceForKind(kind: DiscoverCmsKind): string {
  switch (kind) {
    case 'archive':
      return 'Graphic Archives';
    case 'newspaper':
      return 'Daily Graphic';
    case 'video':
      return 'Graphic NewsPlus Video';
    default:
      return 'Graphic NewsPlus';
  }
}

export function isDiscoverCmsItemActive(item: DiscoverCmsItem, nowMs = Date.now()): boolean {
  if (item.status !== 'published') return false;
  if (item.expiresAt) {
    const expiry = Date.parse(item.expiresAt);
    if (Number.isFinite(expiry) && expiry < nowMs) return false;
  }
  return true;
}

export function toDiscoverFeedItem(item: DiscoverCmsItem): DiscoverItem {
  const videoEmbed = item.kind === 'video' && item.videoUrl
    ? getYoutubeEmbedUrl({ filePath: item.videoUrl }) || undefined
    : undefined;
  const fallbackHref = item.kind === 'archive' && item.linkedEntityId
    ? `/archives/${encodeURIComponent(item.linkedEntityId)}`
    : item.kind === 'newspaper' && item.linkedEntityId
      ? `/newspapers/${encodeURIComponent(item.linkedEntityId)}`
      : item.kind === 'video' && item.linkedEntityId
        ? `/videos/${encodeURIComponent(item.linkedEntityId)}`
        : '';

  return {
    key: `cms:${item.kind}:${item.id}`,
    kind: item.kind,
    title: item.title,
    excerpt: item.excerpt || item.body.slice(0, 240),
    image: feedImage(item.image),
    href: sanitizeCmsUrl(item.href) || fallbackHref || '/pricing',
    source: item.source || defaultSourceForKind(item.kind),
    date: item.date,
    topics: Array.isArray(item.topics) ? item.topics : [],
    preferred: false,
    body: item.accessTier === 'public' && item.body ? item.body : undefined,
    free: item.accessTier === 'public',
    videoEmbed,
  };
}

export function sortDiscoverCmsItems(items: readonly DiscoverCmsItem[]): DiscoverCmsItem[] {
  return [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return Date.parse(b.updatedAt || b.createdAt || '') - Date.parse(a.updatedAt || a.createdAt || '');
  });
}

export function mergeDiscoverCmsWithFeed(
  cmsItems: readonly DiscoverCmsItem[],
  feedItems: readonly DiscoverItem[],
  selectedCategories: ContentCategoryId[],
  options: { prioritizePinned?: boolean; nowMs?: number } = {},
): DiscoverItem[] {
  const prioritizePinned = options.prioritizePinned !== false;
  const active = sortDiscoverCmsItems(cmsItems.filter(item => isDiscoverCmsItemActive(item, options.nowMs)));

  const pinnedFeed: DiscoverItem[] = [];
  const regularCmsFeed: DiscoverItem[] = [];

  for (const cmsItem of active) {
    const converted = personaliseFeedItem(toDiscoverFeedItem(cmsItem), selectedCategories);
    if (prioritizePinned && cmsItem.pinned) {
      pinnedFeed.push(converted);
    } else {
      regularCmsFeed.push(converted);
    }
  }

  const seen = new Set<string>();
  const merged: DiscoverItem[] = [];
  for (const item of [...pinnedFeed, ...regularCmsFeed, ...feedItems]) {
    if (!item.key || seen.has(item.key)) continue;
    seen.add(item.key);
    merged.push(item);
  }
  return merged;
}

export function validateRememberWhenSlidePayload(
  input: Record<string, unknown>,
  existing?: Partial<RememberWhenSlide>,
): { valid: boolean; errors: string[]; data?: Omit<RememberWhenSlide, 'id' | 'createdAt' | 'updatedAt'> } {
  const errors: string[] = [];

  const label = feedText(input.label ?? existing?.label ?? '').slice(0, 80);
  if (!label) {
    errors.push('Label is required (e.g. "30 days ago" or "Independence Day 1957").');
  }

  const rawDate = typeof (input.date ?? existing?.date) === 'string'
    ? String(input.date ?? existing?.date).trim()
    : '';
  const dateMatch = rawDate.match(/^\d{4}-\d{2}-\d{2}/);
  const date = dateMatch ? dateMatch[0] : '';
  if (!date) {
    errors.push('A valid date in YYYY-MM-DD format is required.');
  }

  const publicationName = feedText(input.publicationName ?? existing?.publicationName ?? '').slice(0, 120) || 'Daily Graphic';
  const headline = feedText(input.headline ?? existing?.headline ?? '').slice(0, 320);
  const description = feedText(input.description ?? existing?.description ?? '').slice(0, 600);
  const archiveId = typeof (input.archiveId ?? existing?.archiveId) === 'string'
    ? String(input.archiveId ?? existing?.archiveId).trim()
    : '';

  if (!headline && !archiveId) {
    errors.push('Provide either a featured headline/excerpt or a linked archive ID.');
  }

  const rawImage = input.imageUrl ?? existing?.imageUrl ?? '/images/explore-archives.jpg';
  const imageUrl = rawImage ? feedImage(rawImage) : '/images/explore-archives.jpg';
  if (typeof rawImage === 'string' && rawImage.trim() && !imageUrl) {
    errors.push('Image URL must be an https://, http://, or site-relative / path.');
  }

  const rawCtaUrl = input.ctaUrl ?? existing?.ctaUrl ?? '';
  const ctaUrl = rawCtaUrl ? sanitizeCmsUrl(rawCtaUrl) : '';
  if (typeof rawCtaUrl === 'string' && rawCtaUrl.trim() && !ctaUrl) {
    errors.push('CTA link must be an https://, http://, or site-relative / path.');
  }

  const ctaLabel = feedText(input.ctaLabel ?? existing?.ctaLabel ?? '') || (archiveId ? 'Revisit this story →' : 'Browse past editions →');
  const status = (typeof input.status === 'string' && VALID_REMEMBER_STATUSES.has(input.status as RememberWhenStatus)
    ? input.status
    : existing?.status ?? 'draft') as RememberWhenStatus;

  const rawOrder = Number(input.displayOrder ?? existing?.displayOrder ?? 100);
  const displayOrder = Number.isFinite(rawOrder) && rawOrder >= 0 ? Math.round(rawOrder) : 100;

  const rawKeywords = input.keywords ?? existing?.keywords;
  const keywords = Array.isArray(rawKeywords)
    ? Array.from(new Set(rawKeywords.map(k => feedText(k).slice(0, 60)).filter(Boolean))).slice(0, 25)
    : [];

  if (errors.length) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      label,
      date,
      publicationName,
      headline,
      description,
      keywords,
      imageUrl: imageUrl || '/images/explore-archives.jpg',
      archiveId,
      ctaLabel,
      ctaUrl,
      displayOrder,
      status,
    },
  };
}

export function sortRememberWhenSlides(slides: readonly RememberWhenSlide[]): RememberWhenSlide[] {
  return [...slides].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return Date.parse(b.updatedAt || b.createdAt || '') - Date.parse(a.updatedAt || a.createdAt || '');
  });
}

export function resolveRememberWhenSlideLink(slide: Pick<RememberWhenSlide, 'archiveId' | 'ctaUrl'>): string {
  if (slide.archiveId?.trim()) {
    return `/archives/${encodeURIComponent(slide.archiveId.trim())}`;
  }
  const safeUrl = sanitizeCmsUrl(slide.ctaUrl);
  return safeUrl || '/archives';
}

export function getDiscoverTopicOptions(): string[] {
  return CONTENT_CATEGORIES.map(category => category.label);
}
