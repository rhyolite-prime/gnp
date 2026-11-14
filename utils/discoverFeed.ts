import { getYoutubeEmbedUrl } from './latestVideos.ts';
import type { Article, ArchiveSearchItem, NewsPaper, Video } from '~/models';
import { CONTENT_CATEGORIES, type ContentCategoryId } from './contentCategories.ts';

export interface DiscoverItem {
  key: string;
  kind: 'archive' | 'newspaper' | 'video' | 'story';
  title: string;
  excerpt: string;
  image: string;
  href: string;
  source: string;
  date: string;
  topics: string[];
  preferred: boolean;
  reason?: string;
  body?: string;
  free?: boolean;
  videoEmbed?: string;
}

export function feedText(value: unknown): string {
  return typeof value === 'string' ? value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

export function feedImage(value: unknown): string {
  if (typeof value !== 'string') return '';
  const raw = value.trim().match(/^\[[^\]]*\]\(([^\s]+)\)$/)?.[1] || value.trim();
  if (raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\')) return raw;
  try { const url = new URL(raw); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
  catch { return ''; }
}

export function archiveFeedItem(item: ArchiveSearchItem): DiscoverItem {
  return {
    key: `archive:${item.id}`, kind: 'archive', title: feedText(item.snippet || item.supportingText).slice(0, 180) || `${item.publicationName} · page ${item.pageNumber}`,
    excerpt: feedText(item.supportingText || item.snippet).slice(0, 500), image: feedImage(item.thumbnailId),
    href: `/archives/${encodeURIComponent(item.id)}`, source: item.publicationName || 'Newspaper archives', date: item.publicationDate,
    topics: [...(Array.isArray(item.categories) ? item.categories : []), ...(Array.isArray(item.tags) ? item.tags : [])].filter(value => typeof value === 'string'),
    preferred: false, free: item.isFree,
  };
}

export function newspaperFeedItem(item: NewsPaper): DiscoverItem {
  return {
    key: `newspaper:${item.id}`, kind: 'newspaper', title: feedText(item.title || item.publicationName),
    excerpt: feedText(item.fullDescription).slice(0, 500), image: feedImage(item.thumbnailId),
    href: `/newspapers/${encodeURIComponent(item.id)}`, source: item.publicationName || 'Newspaper edition', date: item.publicationDate || item.publishedDate,
    topics: [...(Array.isArray(item.categories) ? item.categories : []), ...(Array.isArray(item.tags) ? item.tags : [])], preferred: false, free: item.isFree,
  };
}

export function videoFeedItem(item: Video): DiscoverItem {
  let topics: string[] = [];
  if (Array.isArray(item.tags)) topics = item.tags;
  else if (typeof item.tags === 'string') topics = item.tags.replace(/[{}"\[\]]/g, '').split(',');
  return {
    key: `video:${item.id}`, kind: 'video', title: feedText(item.title), excerpt: feedText(item.description).slice(0, 500),
    image: feedImage(item.thumbnailUrl), href: `/videos/${encodeURIComponent(item.id)}`,
    source: 'Graphic NewsPlus video', date: item.createdAt, topics, preferred: false, videoEmbed: getYoutubeEmbedUrl(item) || undefined,
  };
}

export function storyFeedItem(item: Article): DiscoverItem {
  const attributes = item.attributes;
  return {
    key: `story:${item.id}`, kind: 'story', title: feedText(attributes.title), excerpt: feedText(attributes.text).slice(0, 500),
    image: feedImage(attributes.images?.image_intro || attributes.images?.image_fulltext),
    href: attributes.access === 1 ? '/more/stories' : '/pricing', source: 'Top stories', date: attributes.publish_up || attributes.created,
    topics: (Array.isArray(attributes.tags) ? attributes.tags : []).filter((value: unknown): value is string => typeof value === 'string'),
    preferred: false, body: attributes.access === 1 ? feedText(attributes.text) : undefined, free: attributes.access === 1,
  };
}

export function personaliseFeedItem(item: DiscoverItem, selected: ContentCategoryId[]): DiscoverItem {
  const text = `${item.title} ${item.excerpt} ${item.topics.join(' ')}`.toLowerCase();
  const category = CONTENT_CATEGORIES.find(category => selected.includes(category.id) &&
    [category.query, category.label.replace(/_/g, ' ')].some(term => {
      const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
    }));
  return category ? { ...item, preferred: true, reason: category.label } : item;
}

export function shuffleFeed<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/** Mix up to two interest matches per discovery item, retaining every unique item.
 * Existing cards stay in place; only newly fetched batches are shuffled. */
export function mixDiscoverBatch(items: DiscoverItem[], seen: Set<string>, random = Math.random): DiscoverItem[] {
  const unique = new Map<string, DiscoverItem>();
  for (const item of items) {
    if (!item.key || seen.has(item.key)) continue;
    const previous = unique.get(item.key);
    if (!previous || (!previous.preferred && item.preferred)) unique.set(item.key, item);
  }
  const preferred = shuffleFeed([...unique.values()].filter(item => item.preferred), random);
  const general = shuffleFeed([...unique.values()].filter(item => !item.preferred), random);
  const mixed: DiscoverItem[] = [];
  let p = 0; let g = 0;
  while (p < preferred.length || g < general.length) {
    for (let i = 0; i < 2 && p < preferred.length; i++) mixed.push(preferred[p++]!);
    if (g < general.length) mixed.push(general[g++]!);
  }
  for (const item of mixed) seen.add(item.key);
  return mixed;
}
