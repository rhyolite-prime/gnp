export const CONTENT_CATEGORIES = [
  { id: 'vacancy', label: 'Vacancy', group: 'Opportunities', query: 'vacancy' },
  { id: 'leases', label: 'Leases', group: 'Marketplace', query: 'leases' },
  { id: 'auctions', label: 'Auctions', group: 'Marketplace', query: 'auctions' },
  { id: 'wanted', label: 'Wanted', group: 'Marketplace', query: 'wanted' },
  { id: 'advertisements', label: 'Advertisements', group: 'Marketplace', query: 'advertisements' },
  { id: 'electronic_sales', label: 'Electronic sales', group: 'Marketplace', query: 'electronics' },
  { id: 'promotions', label: 'Promotions', group: 'Marketplace', query: 'promotions' },
  { id: 'opinions', label: 'Opinions', group: 'News & perspectives', query: 'opinion' },
  { id: 'global_outlook', label: 'Global outlook', group: 'News & perspectives', query: 'international' },
  { id: 'gender', label: 'Gender', group: 'News & perspectives', query: 'gender' },
  { id: 'politics', label: 'Politics', group: 'News & perspectives', query: 'politics' },
  { id: 'cars', label: 'Cars', group: 'Lifestyle & finance', query: 'cars' },
  { id: 'banking', label: 'Banking', group: 'Lifestyle & finance', query: 'banking' },
  { id: 'exchange_rates', label: 'Exchange rates', group: 'Lifestyle & finance', query: 'exchange rates' },
  { id: 'we_are_hiring', label: 'We are hiring', group: 'Opportunities', query: 'hiring' },
  { id: 'summits', label: 'Summits', group: 'Opportunities', query: 'summit' },
  { id: 'invitation_for_tenders', label: 'Invitation for tenders', group: 'Opportunities', query: 'tenders' },
  { id: 'regional_news', label: 'Regional news', group: 'News & perspectives', query: 'regional' },
  { id: 'education', label: 'Education', group: 'News & perspectives', query: 'education' },
  { id: 'business', label: 'Business', group: 'Lifestyle & finance', query: 'business' },
  { id: 'sports', label: 'Sports', group: 'News & perspectives', query: 'sports' },
] as const;

export type ContentCategoryId = typeof CONTENT_CATEGORIES[number]['id'];
export type ContentTopic = `content_${ContentCategoryId}`;
export const contentTopic = (id: ContentCategoryId): ContentTopic => `content_${id}`;

export function normalizeContentSelection(value: unknown): ContentCategoryId[] {
  if (!Array.isArray(value)) return [];
  const valid = new Set<string>(CONTENT_CATEGORIES.map(item => item.id));
  return [...new Set(value.filter((id): id is ContentCategoryId => typeof id === 'string' && valid.has(id)))];
}
