export interface DiscoverComment {
  id: string;
  itemKey: string;
  authorName: string;
  authorAvatar?: string;
  userId?: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  isCurrentUser?: boolean;
}

export interface DiscoverEngagement {
  itemKey: string;
  views: number;
  likes: number;
  isLiked: boolean;
  commentsCount: number;
  comments: DiscoverComment[];
}

export const SEED_COMMENTS_POOL: readonly { authorName: string; content: string }[] = [
  { authorName: 'Kwame Mensah', content: 'A truly significant development for Ghana. Hope the implementation stays on track.' },
  { authorName: 'Ama Serwaa', content: 'I remember when this first made headlines. Incredible to revisit the archives today.' },
  { authorName: 'Kofi Boateng', content: 'Graphic NewsPlus has done outstanding investigative reporting on this topic.' },
  { authorName: 'Abena Osei', content: 'Very well articulated perspective. We need more discussions like this.' },
  { authorName: 'Yaw Addo', content: 'Great analysis of the economic indicators. The regional context is especially important.' },
  { authorName: 'Efua Mensah', content: 'The historical records from our national archive never fail to inspire. Ghana forward always!' },
  { authorName: 'Ekow Quaye', content: 'Top tier journalism as usual from Daily Graphic. Keep shining the light.' },
  { authorName: 'Akosua Frimpong', content: 'Fascinating breakdown. The commentary provides so much clarity.' },
  { authorName: 'Nana Prempeh', content: 'Historic moment captured perfectly. Proud of our national heritage.' },
  { authorName: 'Selorm Dotse', content: 'Spot on. Looking forward to following the progress on this in future editions.' },
  { authorName: 'Fati Alhassan', content: 'Important update for the business community. Timely and well-researched.' },
  { authorName: 'Kojo Asante', content: 'This brings back memories. Always grateful for this digital archive collection.' },
];

export function hashString(str: string): number {
  if (!str) return 0;
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function generateSeedEngagement(key: string, now = Date.now()): DiscoverEngagement {
  const hash = hashString(key || 'discover:default');
  const views = 180 + (hash % 3820);
  const likes = Math.max(5, Math.floor(views * (0.035 + (hash % 45) / 1000)));
  const numComments = 2 + (hash % 4); // 2 to 5 comments

  const comments: DiscoverComment[] = [];
  for (let i = 0; i < numComments; i++) {
    const poolIndex = (hash + i * 3) % SEED_COMMENTS_POOL.length;
    const seed = SEED_COMMENTS_POOL[poolIndex]!;
    const hoursAgo = (hash % 72) + (i * 8) + 1;
    const createdAt = new Date(now - hoursAgo * 3600 * 1000).toISOString();
    const commentLikes = 1 + ((hash + i * 5) % 19);

    comments.push({
      id: `seed-${key}-${i}`,
      itemKey: key,
      authorName: seed.authorName,
      content: seed.content,
      createdAt,
      likes: commentLikes,
      isLiked: false,
      isCurrentUser: false,
    });
  }

  return {
    itemKey: key,
    views,
    likes,
    isLiked: false,
    commentsCount: comments.length,
    comments,
  };
}

export function formatEngagementCount(count: number): string {
  if (typeof count !== 'number' || Number.isNaN(count) || count <= 0) return '0';
  if (count < 1000) return String(Math.floor(count));
  if (count < 10000) {
    const k = (count / 1000).toFixed(1);
    return k.endsWith('.0') ? `${Math.floor(count / 1000)}k` : `${k}k`;
  }
  if (count < 1000000) {
    return `${Math.floor(count / 1000)}k`;
  }
  const m = (count / 1000000).toFixed(1);
  return m.endsWith('.0') ? `${Math.floor(count / 1000000)}M` : `${m}M`;
}

export function formatCommentDate(isoDate: string, now = Date.now()): string {
  try {
    const timestamp = new Date(isoDate).getTime();
    if (Number.isNaN(timestamp)) return 'Recently';
    const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return 'Recently';
  }
}

export function sanitizeCommentText(text: string): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[\r\n]{3,}/g, '\n\n') // collapse multiple blank lines
    .trim();
}

export function validateComment(content: string, authorName?: string): { valid: boolean; error?: string; cleanContent: string; cleanAuthor: string } {
  const cleanContent = sanitizeCommentText(content || '');
  const cleanAuthor = sanitizeCommentText(authorName || '').slice(0, 50) || 'Guest Reader';

  if (!cleanContent) {
    return { valid: false, error: 'Comment text cannot be empty.', cleanContent: '', cleanAuthor };
  }
  if (cleanContent.length < 2) {
    return { valid: false, error: 'Comment must be at least 2 characters.', cleanContent, cleanAuthor };
  }
  if (cleanContent.length > 500) {
    return { valid: false, error: 'Comment cannot exceed 500 characters.', cleanContent, cleanAuthor };
  }
  return { valid: true, cleanContent, cleanAuthor };
}
