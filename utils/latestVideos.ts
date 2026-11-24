import type { Video } from '~/models';

/** Accept normal API URLs as well as Markdown-wrapped URLs in imported data. */
export function normalizeVideoUrl(value: string | null | undefined): string {
  const raw = (value || '').trim();
  const url = raw.match(/^\[[^\]]*\]\((https?:\/\/[^\s]+)\)$/)?.[1] || raw;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
  } catch {
    return '';
  }
}

export function parseVideoMetadata(value: Video['metadata']): Record<string, unknown> {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function parseVideoTags(value: Video['tags']): string[] {
  if (Array.isArray(value)) return value.filter((tag) => typeof tag === 'string' && tag.trim());
  return (value || '').replace(/^\{|\}$/g, '').split(',')
    .map((tag) => tag.trim().replace(/^"|"$/g, '')).filter(Boolean);
}

/** Never embed an arbitrary filePath: construct an allowlisted YouTube URL. */
export function getYoutubeEmbedUrl(video: Video): string | null {
  const metadataId = parseVideoMetadata(video.metadata).youtube_id;
  let id = typeof metadataId === 'string' && /^[\w-]{11}$/.test(metadataId) ? metadataId : '';
  if (!id) {
    try {
      const url = new URL(normalizeVideoUrl(video.filePath));
      const host = url.hostname.toLowerCase();
      if (host === 'youtu.be') id = url.pathname.split('/')[1] || '';
      else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
        id = url.searchParams.get('v') || (/^\/(embed|shorts|live)\//.test(url.pathname) ? url.pathname.split('/')[2] || '' : '');
      }
    } catch {
      return null;
    }
  }
  return /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function formatVideoCount(value: number | undefined): string {
  return new Intl.NumberFormat('en').format(value ?? 0);
}

export function formatVideoFileSize(value: number | undefined): string {
  if (!value || value < 0) return 'Not specified';
  return `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value / 1024 / 1024)} MB`;
}

export function formatVideoDate(value: string | undefined): string {
  // API timestamps do not specify a timezone. Preserve their calendar date.
  const date = value?.slice(0, 10);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Not specified';
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? 'Not specified' : new Intl.DateTimeFormat('en', {
    dateStyle: 'long', timeZone: 'UTC',
  }).format(parsed);
}
