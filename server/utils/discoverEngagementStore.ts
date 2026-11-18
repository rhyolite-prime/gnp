import {
  generateSeedEngagement,
  validateComment,
  type DiscoverEngagement,
  type DiscoverComment,
} from '../../utils/discoverEngagement.ts';

interface EngagementStoreState {
  records: Map<string, DiscoverEngagement>;
  userLikes: Map<string, Set<string>>;
  commentLikes: Map<string, Set<string>>;
}

function getStore(): EngagementStoreState {
  const g = globalThis as any;
  if (!g.__gnpDiscoverEngagementStore) {
    g.__gnpDiscoverEngagementStore = {
      records: new Map<string, DiscoverEngagement>(),
      userLikes: new Map<string, Set<string>>(),
      commentLikes: new Map<string, Set<string>>(),
    };
  }
  return g.__gnpDiscoverEngagementStore;
}

export function resetEngagementStore() {
  const store = getStore();
  store.records.clear();
  store.userLikes.clear();
  store.commentLikes.clear();
}

export function getOrCreateEngagement(key: string, userId = 'anonymous'): DiscoverEngagement {
  const store = getStore();
  let record = store.records.get(key);
  if (!record) {
    record = generateSeedEngagement(key);
    store.records.set(key, record);
  }

  const likedUsers = store.userLikes.get(key);
  const isLiked = likedUsers ? likedUsers.has(userId) : false;

  const comments = record.comments.map((comment) => {
    const cLikes = store.commentLikes.get(comment.id);
    return {
      ...comment,
      isLiked: cLikes ? cLikes.has(userId) : false,
      isCurrentUser: Boolean(userId && comment.userId && comment.userId === userId),
    };
  });

  return {
    ...record,
    isLiked,
    commentsCount: comments.length,
    comments,
  };
}

export function recordItemView(key: string): { views: number } {
  const store = getStore();
  const engagement = getOrCreateEngagement(key);
  engagement.views += 1;
  store.records.set(key, engagement);
  return { views: engagement.views };
}

export function recordItemLike(key: string, userId = 'anonymous', liked?: boolean): { likes: number; isLiked: boolean } {
  const store = getStore();
  const engagement = getOrCreateEngagement(key, userId);

  let userSet = store.userLikes.get(key);
  if (!userSet) {
    userSet = new Set<string>();
    store.userLikes.set(key, userSet);
  }

  const shouldLike = typeof liked === 'boolean' ? liked : !userSet.has(userId);

  if (shouldLike && !userSet.has(userId)) {
    userSet.add(userId);
    engagement.likes += 1;
  } else if (!shouldLike && userSet.has(userId)) {
    userSet.delete(userId);
    engagement.likes = Math.max(0, engagement.likes - 1);
  }

  engagement.isLiked = userSet.has(userId);
  store.records.set(key, engagement);

  return {
    likes: engagement.likes,
    isLiked: engagement.isLiked,
  };
}

export function createItemComment(
  key: string,
  payload: { authorName: string; content: string; userId?: string; authorAvatar?: string }
): { comment: DiscoverComment; commentsCount: number } {
  const { valid, error, cleanContent, cleanAuthor } = validateComment(payload.content, payload.authorName);
  if (!valid) {
    throw new Error(error || 'Invalid comment content');
  }

  const store = getStore();
  const engagement = getOrCreateEngagement(key, payload.userId);

  const newComment: DiscoverComment = {
    id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemKey: key,
    authorName: cleanAuthor,
    authorAvatar: payload.authorAvatar,
    userId: payload.userId,
    content: cleanContent,
    createdAt: new Date().toISOString(),
    likes: 0,
    isLiked: false,
    isCurrentUser: true,
  };

  engagement.comments.unshift(newComment);
  engagement.commentsCount = engagement.comments.length;
  store.records.set(key, engagement);

  return {
    comment: newComment,
    commentsCount: engagement.commentsCount,
  };
}

export function removeItemComment(
  key: string,
  commentId: string,
  userId?: string
): { success: boolean; commentsCount: number } {
  const store = getStore();
  const engagement = getOrCreateEngagement(key, userId);

  const initialLength = engagement.comments.length;
  engagement.comments = engagement.comments.filter((c) => {
    if (c.id !== commentId) return true;
    if (userId && c.userId && c.userId !== userId) return true; // prevent unauthorized deletion
    return false;
  });

  engagement.commentsCount = engagement.comments.length;
  store.records.set(key, engagement);

  return {
    success: engagement.comments.length < initialLength,
    commentsCount: engagement.commentsCount,
  };
}

export function recordCommentLike(
  key: string,
  commentId: string,
  userId = 'anonymous',
  liked?: boolean
): { likes: number; isLiked: boolean } {
  const store = getStore();
  const engagement = getOrCreateEngagement(key, userId);
  const comment = engagement.comments.find((c) => c.id === commentId);

  if (!comment) {
    throw new Error('Comment not found');
  }

  let userSet = store.commentLikes.get(commentId);
  if (!userSet) {
    userSet = new Set<string>();
    store.commentLikes.set(commentId, userSet);
  }

  const shouldLike = typeof liked === 'boolean' ? liked : !userSet.has(userId);

  if (shouldLike && !userSet.has(userId)) {
    userSet.add(userId);
    comment.likes += 1;
  } else if (!shouldLike && userSet.has(userId)) {
    userSet.delete(userId);
    comment.likes = Math.max(0, comment.likes - 1);
  }

  comment.isLiked = userSet.has(userId);
  store.records.set(key, engagement);

  return {
    likes: comment.likes,
    isLiked: comment.isLiked,
  };
}
