import type {
  EngagementDeviceType,
  EngagementFlushReason,
  NewsPaper,
  NewspaperEngagementPayload,
  NewspaperPageViewMetric,
  PdfPageNavigationTrigger,
} from '~/models';

interface InternalPageState {
  pageNumber: number;
  viewCount: number;
  timeSpentMs: number;
  firstViewedAtMs: number;
  lastViewedAtMs: number;
}

export interface PdfPageViewTrackerOptions {
  /** Optional deterministic session identifier (defaults to `crypto.randomUUID()`). */
  sessionId?: string;
  /** Optional clock source in milliseconds (defaults to `Date.now`). */
  now?: () => number;
}

export interface BuildEngagementPayloadContext {
  newspaper: Partial<Pick<
    NewsPaper,
    'id' | 'uniqueId' | 'publicationId' | 'publicationName' | 'publicationDate' | 'publishedDate' | 'editionNumber'
  >> | null | undefined;
  /** Route / entitlement `uniqueId` used when requesting `/api/pdf`. */
  uniqueId?: string;
  deviceType?: EngagementDeviceType;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  flushReason?: EngagementFlushReason;
}

function generateSessionId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  // RFC-4122 v4 fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const rand = Math.floor(Math.random() * 16);
    const val = ch === 'x' ? rand : (rand & 0x3) | 0x8;
    return val.toString(16);
  });
}

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Normalizes an API date or ISO timestamp (`2026-11-15T05:30:00Z`) to `YYYY-MM-DD`.
 */
export function normalizeEditionDate(value: unknown): string {
  const raw = cleanString(value);
  if (!raw) return '';
  const match = /^(\d{4}-\d{2}-\d{2})(?:$|[T\s])/.exec(raw);
  return match ? match[1] : raw;
}

/**
 * Classifies the reader's device into `'mobile' | 'tablet' | 'web'` using
 * User-Agent hints first and viewport width (`< 768` mobile, `< 1024` tablet)
 * as a responsive fallback.
 */
export function resolveEngagementDeviceType(input: {
  viewportWidth?: number;
  userAgent?: string;
} = {}): EngagementDeviceType {
  const ua = cleanString(input.userAgent).toLowerCase();

  if (
    ua.includes('ipad') ||
    ua.includes('tablet') ||
    ua.includes('playbook') ||
    ua.includes('silk') ||
    (ua.includes('android') && !ua.includes('mobile'))
  ) {
    return 'tablet';
  }

  if (
    ua.includes('iphone') ||
    ua.includes('ipod') ||
    ua.includes('windows phone') ||
    ua.includes('mobile') ||
    ua.includes('android')
  ) {
    return 'mobile';
  }

  const width = input.viewportWidth;
  if (typeof width === 'number' && Number.isFinite(width) && width > 0) {
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
  }

  return 'web';
}

/**
 * Stateful session tracker for individual PDF page view counts and active dwell
 * times on `pages/newspapers/[id]/open.vue`.
 */
export function createPdfPageViewTracker(options: PdfPageViewTrackerOptions = {}) {
  const now = options.now ?? (() => Date.now());
  let sessionId = cleanString(options.sessionId) || generateSessionId();

  const pages = new Map<number, InternalPageState>();
  let totalPages = 0;
  let startedAtMs: number | null = null;
  let activePage: number | null = null;
  let activeSinceMs: number | null = null;
  let paused = false;
  let furthestPageReached = 0;
  let lastPageViewed = 0;
  let activityRevision = 0;
  let flushedRevision = 0;

  function commitActiveTime(timestampMs: number) {
    if (activePage === null || activeSinceMs === null || paused) return;
    const elapsedMs = Math.max(0, timestampMs - activeSinceMs);
    const current = pages.get(activePage);
    if (current && elapsedMs > 0) {
      current.timeSpentMs += elapsedMs;
    }
    activeSinceMs = timestampMs;
  }

  function setTotalPages(count: number) {
    if (typeof count !== 'number' || !Number.isFinite(count)) return;
    const normalized = Math.trunc(count);
    if (normalized >= 1) {
      totalPages = normalized;
    }
  }

  function recordPageView(
    pageNumber: number,
    _trigger: PdfPageNavigationTrigger = 'jump',
  ): boolean {
    if (typeof pageNumber !== 'number' || !Number.isInteger(pageNumber) || pageNumber < 1) {
      return false;
    }
    if (totalPages > 0 && pageNumber > totalPages) {
      return false;
    }

    const ts = now();
    if (startedAtMs === null) {
      startedAtMs = ts;
    }

    commitActiveTime(ts);

    const existing = pages.get(pageNumber);
    if (existing) {
      existing.viewCount += 1;
      existing.lastViewedAtMs = ts;
    } else {
      pages.set(pageNumber, {
        pageNumber,
        viewCount: 1,
        timeSpentMs: 0,
        firstViewedAtMs: ts,
        lastViewedAtMs: ts,
      });
    }

    activePage = pageNumber;
    activeSinceMs = paused ? null : ts;
    lastPageViewed = pageNumber;
    if (pageNumber > furthestPageReached) {
      furthestPageReached = pageNumber;
    }
    activityRevision += 1;
    return true;
  }

  function pause() {
    if (paused) return;
    commitActiveTime(now());
    activeSinceMs = null;
    paused = true;
  }

  function resume() {
    if (!paused) return;
    paused = false;
    if (activePage !== null) {
      activeSinceMs = now();
    }
  }

  function getSortedEntries(): InternalPageState[] {
    return Array.from(pages.values()).sort((a, b) => a.pageNumber - b.pageNumber);
  }

  function getPageViewCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const entry of getSortedEntries()) {
      counts[String(entry.pageNumber)] = entry.viewCount;
    }
    return counts;
  }

  function getPageViews(): NewspaperPageViewMetric[] {
    commitActiveTime(now());
    return getSortedEntries().map((entry) => ({
      pageNumber: entry.pageNumber,
      viewCount: entry.viewCount,
      timeSpentSeconds: Math.max(0, Math.round(entry.timeSpentMs / 1000)),
      firstViewedAt: new Date(entry.firstViewedAtMs).toISOString(),
      lastViewedAt: new Date(entry.lastViewedAtMs).toISOString(),
    }));
  }

  function hasUnflushedActivity(): boolean {
    return pages.size > 0 && activityRevision > flushedRevision;
  }

  function markFlushed() {
    commitActiveTime(now());
    flushedRevision = activityRevision;
  }

  function reset(nextOptions: { sessionId?: string } = {}) {
    pages.clear();
    totalPages = 0;
    startedAtMs = null;
    activePage = null;
    activeSinceMs = null;
    paused = false;
    furthestPageReached = 0;
    lastPageViewed = 0;
    activityRevision = 0;
    flushedRevision = 0;
    sessionId = cleanString(nextOptions.sessionId) || generateSessionId();
  }

  function buildPayload(
    context: BuildEngagementPayloadContext,
  ): NewspaperEngagementPayload | null {
    const newspaperId = cleanString(context.newspaper?.id);
    if (!newspaperId || pages.size === 0) {
      return null;
    }

    const endedAtMs = now();
    commitActiveTime(endedAtMs);

    const sorted = getSortedEntries();
    const pageViewCounts: Record<string, number> = {};
    const pageViews: NewspaperPageViewMetric[] = [];
    let totalPageViews = 0;
    let totalTimeSpentMs = 0;

    for (const entry of sorted) {
      pageViewCounts[String(entry.pageNumber)] = entry.viewCount;
      totalPageViews += entry.viewCount;
      totalTimeSpentMs += entry.timeSpentMs;
      pageViews.push({
        pageNumber: entry.pageNumber,
        viewCount: entry.viewCount,
        timeSpentSeconds: Math.max(0, Math.round(entry.timeSpentMs / 1000)),
        firstViewedAt: new Date(entry.firstViewedAtMs).toISOString(),
        lastViewedAt: new Date(entry.lastViewedAtMs).toISOString(),
      });
    }

    const pagesRead = sorted.length;
    const readingProgress =
      totalPages > 0
        ? Math.min(100, Number(((pagesRead / totalPages) * 100).toFixed(2)))
        : 0;

    const userAgent = cleanString(context.userAgent) || 'Unknown';
    const viewport =
      context.viewport &&
      Number.isFinite(context.viewport.width) &&
      Number.isFinite(context.viewport.height) &&
      context.viewport.width > 0 &&
      context.viewport.height > 0
        ? {
            width: Math.round(context.viewport.width),
            height: Math.round(context.viewport.height),
          }
        : undefined;

    const deviceType =
      context.deviceType ??
      resolveEngagementDeviceType({
        viewportWidth: viewport?.width,
        userAgent,
      });

    const payload: NewspaperEngagementPayload = {
      sessionId,
      newspaperId,
      uniqueId: cleanString(context.uniqueId) || cleanString(context.newspaper?.uniqueId),
      publicationId: cleanString(context.newspaper?.publicationId),
      publicationName: cleanString(context.newspaper?.publicationName),
      publicationDate: normalizeEditionDate(
        context.newspaper?.publicationDate || context.newspaper?.publishedDate,
      ),
      editionNumber: cleanString(context.newspaper?.editionNumber),
      totalPages,
      pagesRead,
      totalPageViews,
      readingProgress,
      furthestPageReached,
      lastPageViewed,
      timeSpentSeconds: Math.max(0, Math.round(totalTimeSpentMs / 1000)),
      pageViewCounts,
      pageViews,
      deviceType,
      userAgent,
      ...(viewport ? { viewport } : {}),
      flushReason: context.flushReason ?? 'manual',
      startedAt: new Date(startedAtMs ?? endedAtMs).toISOString(),
      endedAt: new Date(endedAtMs).toISOString(),
    };

    return payload;
  }

  return {
    get sessionId() {
      return sessionId;
    },
    get totalPages() {
      return totalPages;
    },
    get lastPageViewed() {
      return lastPageViewed;
    },
    get furthestPageReached() {
      return furthestPageReached;
    },
    setTotalPages,
    recordPageView,
    pause,
    resume,
    getPageViewCounts,
    getPageViews,
    hasUnflushedActivity,
    markFlushed,
    reset,
    buildPayload,
  };
}
