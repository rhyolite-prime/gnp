import { CONTENT_CATEGORIES, type ContentCategoryId } from '../utils/contentCategories.ts';
import type { DiscoverItem } from '../utils/discoverFeed.ts';

/** Fictional editorial fixtures, never claims about real people, dates or offers. */
const headlines: Record<ContentCategoryId, string> = {
  vacancy: 'Community newsroom seeks a digital production assistant',
  leases: 'A practical checklist before signing your next commercial lease',
  auctions: 'Inside a sample public auction: viewing days, deposits and bids',
  wanted: 'Local makers wanted for a neighbourhood craft showcase',
  advertisements: 'How to write a classified advertisement that gets noticed',
  electronic_sales: 'A buyer’s guide to refurbished laptops and device warranties',
  promotions: 'Weekend offers: how to compare prices before you buy',
  opinions: 'Opinion: the small public spaces that make a city feel like home',
  global_outlook: 'Global outlook: what changing shipping routes mean for trade',
  gender: 'Mentorship circles are opening new conversations about opportunity',
  politics: 'Understanding a district budget, one public meeting at a time',
  cars: 'Before the test drive: a used-car inspection checklist',
  banking: 'The questions to ask before opening a small-business account',
  exchange_rates: 'Exchange rates explained: reading the spread, not just the headline',
  we_are_hiring: 'We are hiring: a sample careers bulletin for creative teams',
  summits: 'A sample innovation summit puts practical skills on the agenda',
  invitation_for_tenders: 'Invitation for tenders: a guide to preparing complete documents',
  regional_news: 'Regional voices: a community turns a shared space into a reading corner',
  education: 'Teachers share simple ways to build a daily reading habit',
  business: 'From idea to first sale: the everyday decisions behind a small business',
  sports: 'Beyond the score: the volunteers keeping community sport moving',
};

export interface DiscoverMockRecord {
  id: string;
  contentType: DiscoverItem['kind'];
  categoryId: ContentCategoryId;
  title: string;
  summary: string;
  body: string;
  publicationId: string;
  publishedAt: string;
  accessTier: 'public' | 'subscriber';
  thumbnailUrl: string;
  isMock: true;
}

const kinds: DiscoverItem['kind'][] = ['story', 'video', 'newspaper', 'archive'];
export const DISCOVER_MOCK_RECORDS: DiscoverMockRecord[] = CONTENT_CATEGORIES.flatMap((category, index) => kinds.map((kind, variant) => {
  const title = headlines[category.id];
  return {
    id: `demo-${category.id}-${kind}`, contentType: kind, categoryId: category.id,
    title: variant === 0 ? title : `${variant === 1 ? 'Watch & learn' : variant === 2 ? 'In the sample edition' : 'From the sample archive'}: ${title.charAt(0).toLowerCase()}${title.slice(1)}`,
    summary: `A fictional ${category.label.toLowerCase()} ${kind === 'video' ? 'video outline' : 'editorial preview'} showing how this topic could appear in your personalised feed. Explore the sample to see its content and access metadata.`,
    body: `SAMPLE CONTENT — NOT A REAL NEWS REPORT OR OFFER.\n\n${title}\n\nThis fictional ${category.label.toLowerCase()} item demonstrates a ${kind} record in the Discover feed. It is not a live vacancy, tender, auction, price quote, promotion or financial recommendation.\n\nA real record would provide verified reporting or notice details, attribution, publication and expiry dates where relevant, and a link to its underlying article, edition, archive document or video. Subscriber-only material would be checked by the reader API.\n\nNo real video, transaction or subscription entitlement is attached to this sample.`,
    publicationId: `demo-publication-${index % 3 + 1}`,
    publishedAt: new Date(Date.UTC(2026, 10, 13 - variant, 9, index)).toISOString(),
    accessTier: kind === 'archive' || kind === 'newspaper' ? 'subscriber' : 'public',
    thumbnailUrl: category.group === 'Opportunities' ? '/images/explore-affiliates.jpg' : kind === 'archive' ? '/images/explore-archives.jpg' : category.group === 'Lifestyle & finance' ? '/images/explore-partners.jpg' : '/images/explore-newspapers.jpg',
    isMock: true,
  };
}));

export function getDiscoverMockItems(): DiscoverItem[] {
  return DISCOVER_MOCK_RECORDS.map(record => ({
    key: `${record.contentType}:${record.id}`, kind: record.contentType,
    title: record.title, excerpt: record.summary, body: record.body,
    image: record.thumbnailUrl, href: '', source: 'Graphic NewsPlus · Fictional sample', date: record.publishedAt,
    topics: [CONTENT_CATEGORIES.find(category => category.id === record.categoryId)!.label],
    preferred: false, free: record.accessTier === 'public', mock: true,
  }));
}
