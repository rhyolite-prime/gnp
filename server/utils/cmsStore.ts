import {
  DEFAULT_DISCOVER_CMS_CONFIG,
  DEFAULT_REMEMBER_WHEN_CONFIG,
  sortDiscoverCmsItems,
  sortRememberWhenSlides,
  validateDiscoverCmsPayload,
  validateRememberWhenSlidePayload,
  type DiscoverCmsConfig,
  type DiscoverCmsItem,
  type DiscoverCmsStatus,
  type RememberWhenConfig,
  type RememberWhenSlide,
  type RememberWhenStatus,
} from '../../utils/cmsContent.ts';

function computeSeedMemoryDates(now = new Date()) {
  const day = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const monthAgo = new Date(day);
  monthAgo.setUTCDate(monthAgo.getUTCDate() - 30);
  const yearAgo = new Date(day);
  yearAgo.setUTCFullYear(yearAgo.getUTCFullYear() - 1);
  if (yearAgo.getUTCMonth() !== day.getUTCMonth()) yearAgo.setUTCDate(0);
  return [
    { label: '30 days ago', date: monthAgo.toISOString().slice(0, 10) },
    { label: 'A year ago', date: yearAgo.toISOString().slice(0, 10) },
  ] as const;
}

interface CmsStoreState {
  discoverItems: DiscoverCmsItem[];
  discoverConfig: DiscoverCmsConfig;
  rememberSlides: RememberWhenSlide[];
  rememberConfig: RememberWhenConfig;
}

function buildInitialDiscoverItems(): DiscoverCmsItem[] {
  const now = '2026-11-20T09:00:00.000Z';
  return [
    {
      id: 'cms-disc-001',
      kind: 'story',
      title: 'Inside Ghana’s Digital Newsroom Transformation: Preserving 70+ Years of Journalism',
      excerpt: 'How Graphic Communications Group is digitizing decades of Daily Graphic, The Mirror, and Graphic Business editions for readers and researchers worldwide.',
      body: 'From archival microfilm vaults to high-speed OCR search and AI-assisted research tools, Graphic NewsPlus brings over seven decades of Ghanaian journalism to every screen.\n\nSubscribers can explore daily digital editions alongside historical issues dating back to 1950.',
      image: '/images/explore-archives.jpg',
      href: '/archives',
      source: 'Graphic Editorial',
      date: '2026-11-20',
      topics: ['Education', 'Business'],
      accessTier: 'public',
      videoUrl: '',
      linkedEntityId: '',
      pinned: true,
      displayOrder: 1,
      status: 'published',
      publishedAt: now,
      expiresAt: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cms-disc-002',
      kind: 'newspaper',
      title: 'Daily Graphic Weekend Special: Economic Outlook & Regional Infrastructure Report',
      excerpt: 'Full coverage of fiscal policy updates, banking sector liquidity, and regional transport investments across Greater Accra, Ashanti, and Western regions.',
      body: '',
      image: '/images/explore-newspapers.jpg',
      href: '/newspapers',
      source: 'Daily Graphic',
      date: '2026-11-19',
      topics: ['Business', 'Banking', 'Regional News'],
      accessTier: 'subscriber',
      videoUrl: '',
      linkedEntityId: '',
      pinned: false,
      displayOrder: 2,
      status: 'published',
      publishedAt: now,
      expiresAt: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cms-disc-003',
      kind: 'video',
      title: 'Graphic Business Forum: SME Financing & Cross-Border Trade Opportunities',
      excerpt: 'Key takeaways from industry leaders on working capital, treasury management, and AfCFTA export readiness.',
      body: '',
      image: '/images/explore-partners.jpg',
      href: '/originals',
      source: 'Graphic NewsPlus Video',
      date: '2026-11-18',
      topics: ['Business', 'Summits', 'Exchange Rates'],
      accessTier: 'public',
      videoUrl: '',
      linkedEntityId: '',
      pinned: false,
      displayOrder: 3,
      status: 'published',
      publishedAt: now,
      expiresAt: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'cms-disc-004',
      kind: 'archive',
      title: 'Draft Spotlight: Independence Era Commerce & Port Expansion Editions',
      excerpt: 'Curated historical features preparing for upcoming Heritage Month showcase on the Discover timeline.',
      body: '',
      image: '/images/explore-archives.jpg',
      href: '/archives',
      source: 'Graphic Archives',
      date: '1962-03-06',
      topics: ['Global Outlook', 'Business'],
      accessTier: 'subscriber',
      videoUrl: '',
      linkedEntityId: '',
      pinned: false,
      displayOrder: 4,
      status: 'draft',
      publishedAt: null,
      expiresAt: null,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function buildInitialRememberSlides(): RememberWhenSlide[] {
  const now = '2026-11-20T09:00:00.000Z';
  const [thirtyDays, oneYear] = computeSeedMemoryDates();
  return [
    {
      id: 'rem-001',
      label: thirtyDays?.label || '30 days ago',
      date: thirtyDays?.date || '2026-10-25',
      publicationName: 'Daily Graphic',
      headline: 'National infrastructure summit concludes with commitments on urban transit and renewable grid expansion.',
      description: 'Revisit the front-page coverage and sector reactions from thirty days ago.',
      imageUrl: '/images/explore-archives.jpg',
      archiveId: '',
      ctaLabel: 'Browse past editions →',
      ctaUrl: '/archives',
      displayOrder: 1,
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'rem-002',
      label: oneYear?.label || 'A year ago',
      date: oneYear?.date || '2025-11-24',
      publicationName: 'Graphic Business',
      headline: 'Ghanaian fintech and agribusiness exporters record strong Q4 momentum across West African corridors.',
      description: 'Look back at the headlines shaping business and enterprise a year ago.',
      imageUrl: '/images/explore-newspapers.jpg',
      archiveId: '',
      ctaLabel: 'Browse past editions →',
      ctaUrl: '/archives',
      displayOrder: 2,
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'rem-003',
      label: 'Independence Day 1957',
      date: '1957-03-06',
      publicationName: 'Daily Graphic',
      headline: 'A New Nation Is Born: Historic front-page dispatches from Accra as Ghana steps into independence.',
      description: 'Draft heritage spotlight awaiting archival page linkage.',
      imageUrl: '/images/explore-archives.jpg',
      archiveId: '',
      ctaLabel: 'Explore the 1950s archive →',
      ctaUrl: '/archives',
      displayOrder: 3,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function getStore(): CmsStoreState {
  const g = globalThis as Record<string, unknown>;
  if (!g.__gnpCmsContentStore) {
    g.__gnpCmsContentStore = {
      discoverItems: buildInitialDiscoverItems(),
      discoverConfig: { ...DEFAULT_DISCOVER_CMS_CONFIG },
      rememberSlides: buildInitialRememberSlides(),
      rememberConfig: { ...DEFAULT_REMEMBER_WHEN_CONFIG },
    } satisfies CmsStoreState;
  }
  return g.__gnpCmsContentStore as CmsStoreState;
}

export function resetCmsStore() {
  const store = getStore();
  store.discoverItems = buildInitialDiscoverItems();
  store.discoverConfig = { ...DEFAULT_DISCOVER_CMS_CONFIG };
  store.rememberSlides = buildInitialRememberSlides();
  store.rememberConfig = { ...DEFAULT_REMEMBER_WHEN_CONFIG };
}

// ── Discover CMS Store Operations ─────────────────────────────────────────────

export function listDiscoverCms(options: {
  status?: string;
  kind?: string;
  q?: string;
  publishedOnly?: boolean;
} = {}) {
  const store = getStore();
  let items = sortDiscoverCmsItems(store.discoverItems);

  if (options.publishedOnly) {
    const now = Date.now();
    items = items.filter((item) => {
      if (item.status !== 'published') return false;
      if (item.expiresAt) {
        const exp = Date.parse(item.expiresAt);
        if (Number.isFinite(exp) && exp < now) return false;
      }
      return true;
    });
  } else if (options.status && options.status !== 'all') {
    items = items.filter(item => item.status === options.status);
  }

  if (options.kind && options.kind !== 'all') {
    items = items.filter(item => item.kind === options.kind);
  }

  if (options.q?.trim()) {
    const term = options.q.trim().toLowerCase();
    items = items.filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.excerpt.toLowerCase().includes(term) ||
      item.source.toLowerCase().includes(term) ||
      item.topics.some(t => t.toLowerCase().includes(term)),
    );
  }

  const all = store.discoverItems;
  const stats = {
    total: all.length,
    published: all.filter(i => i.status === 'published').length,
    draft: all.filter(i => i.status === 'draft').length,
    archived: all.filter(i => i.status === 'archived').length,
    pinned: all.filter(i => i.pinned).length,
  };

  return {
    items,
    config: { ...store.discoverConfig },
    stats,
  };
}

export function createDiscoverCmsRecord(payload: Record<string, unknown>): DiscoverCmsItem {
  const store = getStore();
  const validation = validateDiscoverCmsPayload(payload);
  if (!validation.valid || !validation.data) {
    throw new Error(validation.errors[0] || 'Invalid Discover CMS item.');
  }
  const now = new Date().toISOString();
  const maxOrder = store.discoverItems.reduce((max, item) => Math.max(max, item.displayOrder), 0);
  const record: DiscoverCmsItem = {
    id: `cms-disc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...validation.data,
    displayOrder: payload.displayOrder !== undefined ? validation.data.displayOrder : maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };
  store.discoverItems.unshift(record);
  return record;
}

export function updateDiscoverCmsRecord(id: string, payload: Record<string, unknown>): DiscoverCmsItem {
  const store = getStore();
  const idx = store.discoverItems.findIndex(item => item.id === id);
  if (idx === -1) {
    throw new Error('Discover CMS item not found.');
  }
  const existing = store.discoverItems[idx]!;
  const validation = validateDiscoverCmsPayload(payload, existing);
  if (!validation.valid || !validation.data) {
    throw new Error(validation.errors[0] || 'Invalid Discover CMS item.');
  }
  const updated: DiscoverCmsItem = {
    ...existing,
    ...validation.data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  store.discoverItems[idx] = updated;
  return updated;
}

export function patchDiscoverCmsStatus(
  id: string,
  patch: { status?: DiscoverCmsStatus; pinned?: boolean },
): DiscoverCmsItem {
  const store = getStore();
  const idx = store.discoverItems.findIndex(item => item.id === id);
  if (idx === -1) {
    throw new Error('Discover CMS item not found.');
  }
  const existing = store.discoverItems[idx]!;
  const nextStatus = patch.status ?? existing.status;
  const updated: DiscoverCmsItem = {
    ...existing,
    status: nextStatus,
    pinned: typeof patch.pinned === 'boolean' ? patch.pinned : existing.pinned,
    publishedAt: nextStatus === 'published' ? (existing.publishedAt || new Date().toISOString()) : existing.publishedAt,
    updatedAt: new Date().toISOString(),
  };
  store.discoverItems[idx] = updated;
  return updated;
}

export function deleteDiscoverCmsRecord(id: string): boolean {
  const store = getStore();
  const before = store.discoverItems.length;
  store.discoverItems = store.discoverItems.filter(item => item.id !== id);
  return store.discoverItems.length < before;
}

export function reorderDiscoverCmsRecords(orderedIds: string[]): DiscoverCmsItem[] {
  const store = getStore();
  const orderMap = new Map(orderedIds.map((id, idx) => [id, idx + 1]));
  const now = new Date().toISOString();
  store.discoverItems = store.discoverItems.map((item) => {
    const nextOrder = orderMap.get(item.id);
    return nextOrder !== undefined ? { ...item, displayOrder: nextOrder, updatedAt: now } : item;
  });
  return sortDiscoverCmsItems(store.discoverItems);
}

export function updateDiscoverCmsSettings(patch: Partial<DiscoverCmsConfig>): DiscoverCmsConfig {
  const store = getStore();
  store.discoverConfig = {
    heading: typeof patch.heading === 'string' && patch.heading.trim() ? patch.heading.trim().slice(0, 80) : store.discoverConfig.heading,
    subheading: typeof patch.subheading === 'string' && patch.subheading.trim() ? patch.subheading.trim().slice(0, 80) : store.discoverConfig.subheading,
    includeLiveCatalogue: typeof patch.includeLiveCatalogue === 'boolean' ? patch.includeLiveCatalogue : store.discoverConfig.includeLiveCatalogue,
    prioritizePinned: typeof patch.prioritizePinned === 'boolean' ? patch.prioritizePinned : store.discoverConfig.prioritizePinned,
  };
  return { ...store.discoverConfig };
}

// ── Remember When CMS Store Operations ────────────────────────────────────────

export function listRememberWhenCms(options: {
  status?: string;
  q?: string;
  publishedOnly?: boolean;
} = {}) {
  const store = getStore();
  let slides = sortRememberWhenSlides(store.rememberSlides);

  if (options.publishedOnly) {
    slides = slides.filter(slide => slide.status === 'published');
  } else if (options.status && options.status !== 'all') {
    slides = slides.filter(slide => slide.status === options.status);
  }

  if (options.q?.trim()) {
    const term = options.q.trim().toLowerCase();
    slides = slides.filter(slide =>
      slide.label.toLowerCase().includes(term) ||
      slide.headline.toLowerCase().includes(term) ||
      slide.publicationName.toLowerCase().includes(term) ||
      slide.date.includes(term),
    );
  }

  const all = store.rememberSlides;
  const stats = {
    total: all.length,
    published: all.filter(s => s.status === 'published').length,
    draft: all.filter(s => s.status === 'draft').length,
  };

  return {
    slides,
    config: { ...store.rememberConfig },
    stats,
  };
}

export function createRememberWhenSlideRecord(payload: Record<string, unknown>): RememberWhenSlide {
  const store = getStore();
  const validation = validateRememberWhenSlidePayload(payload);
  if (!validation.valid || !validation.data) {
    throw new Error(validation.errors[0] || 'Invalid Remember When slide.');
  }
  const now = new Date().toISOString();
  const maxOrder = store.rememberSlides.reduce((max, s) => Math.max(max, s.displayOrder), 0);
  const slide: RememberWhenSlide = {
    id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...validation.data,
    displayOrder: payload.displayOrder !== undefined ? validation.data.displayOrder : maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };
  store.rememberSlides.push(slide);
  return slide;
}

export function updateRememberWhenSlideRecord(id: string, payload: Record<string, unknown>): RememberWhenSlide {
  const store = getStore();
  const idx = store.rememberSlides.findIndex(s => s.id === id);
  if (idx === -1) {
    throw new Error('Remember When slide not found.');
  }
  const existing = store.rememberSlides[idx]!;
  const validation = validateRememberWhenSlidePayload(payload, existing);
  if (!validation.valid || !validation.data) {
    throw new Error(validation.errors[0] || 'Invalid Remember When slide.');
  }
  const updated: RememberWhenSlide = {
    ...existing,
    ...validation.data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  store.rememberSlides[idx] = updated;
  return updated;
}

export function patchRememberWhenSlideStatus(id: string, status: RememberWhenStatus): RememberWhenSlide {
  const store = getStore();
  const idx = store.rememberSlides.findIndex(s => s.id === id);
  if (idx === -1) {
    throw new Error('Remember When slide not found.');
  }
  const existing = store.rememberSlides[idx]!;
  const updated: RememberWhenSlide = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };
  store.rememberSlides[idx] = updated;
  return updated;
}

export function deleteRememberWhenSlideRecord(id: string): boolean {
  const store = getStore();
  const before = store.rememberSlides.length;
  store.rememberSlides = store.rememberSlides.filter(s => s.id !== id);
  return store.rememberSlides.length < before;
}

export function reorderRememberWhenSlides(orderedIds: string[]): RememberWhenSlide[] {
  const store = getStore();
  const orderMap = new Map(orderedIds.map((id, idx) => [id, idx + 1]));
  const now = new Date().toISOString();
  store.rememberSlides = store.rememberSlides.map((slide) => {
    const nextOrder = orderMap.get(slide.id);
    return nextOrder !== undefined ? { ...slide, displayOrder: nextOrder, updatedAt: now } : slide;
  });
  return sortRememberWhenSlides(store.rememberSlides);
}

export function updateRememberWhenSettings(patch: Partial<RememberWhenConfig>): RememberWhenConfig {
  const store = getStore();
  const rawAutoplay = Number(patch.autoplayMs);
  store.rememberConfig = {
    eyebrow: typeof patch.eyebrow === 'string' && patch.eyebrow.trim() ? patch.eyebrow.trim().slice(0, 120) : store.rememberConfig.eyebrow,
    title: typeof patch.title === 'string' && patch.title.trim() ? patch.title.trim().slice(0, 120) : store.rememberConfig.title,
    subtitle: typeof patch.subtitle === 'string' && patch.subtitle.trim() ? patch.subtitle.trim().slice(0, 320) : store.rememberConfig.subtitle,
    autoplayMs: Number.isFinite(rawAutoplay) && rawAutoplay >= 2000 && rawAutoplay <= 30000 ? Math.round(rawAutoplay) : store.rememberConfig.autoplayMs,
    fallbackToArchiveDates: typeof patch.fallbackToArchiveDates === 'boolean' ? patch.fallbackToArchiveDates : store.rememberConfig.fallbackToArchiveDates,
  };
  return { ...store.rememberConfig };
}
