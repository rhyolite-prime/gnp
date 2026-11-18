import { ref, reactive } from 'vue';
import {
  generateSeedEngagement,
  formatEngagementCount,
  formatCommentDate,
  validateComment,
  type DiscoverEngagement,
  type DiscoverComment,
} from '~/utils/discoverEngagement';
import { useBasicAuthStore } from '~/stores/basic-user-auth';

const STORAGE_LIKES_KEY = 'gnp-discover-user-likes-v1';
const STORAGE_COMMENTS_KEY = 'gnp-discover-user-comments-v1';
const STORAGE_USER_NAME_KEY = 'gnp-discover-user-name-v1';

// Shared global state across all components in the session
const engagements = reactive<Record<string, DiscoverEngagement>>({});
const sessionViewed = new Set<string>();
const userLikedKeys = new Set<string>();
let storageInitialized = false;

function initFromLocalStorage() {
  if (storageInitialized || typeof window === 'undefined') return;
  storageInitialized = true;
  try {
    const storedLikes = localStorage.getItem(STORAGE_LIKES_KEY);
    if (storedLikes) {
      const parsed: string[] = JSON.parse(storedLikes);
      if (Array.isArray(parsed)) {
        parsed.forEach((k) => userLikedKeys.add(k));
      }
    }
  } catch {
    // ignore
  }
}

function persistLikes() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_LIKES_KEY, JSON.stringify([...userLikedKeys]));
  } catch {
    // ignore
  }
}

function getStoredUserComments(): Record<string, DiscoverComment[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_COMMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistStoredUserComment(key: string, comment: DiscoverComment) {
  if (typeof window === 'undefined') return;
  try {
    const all = getStoredUserComments();
    if (!all[key]) all[key] = [];
    all[key].unshift(comment);
    localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

function removeStoredUserComment(key: string, commentId: string) {
  if (typeof window === 'undefined') return;
  try {
    const all = getStoredUserComments();
    if (all[key]) {
      all[key] = all[key].filter((c) => c.id !== commentId);
      localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(all));
    }
  } catch {
    // ignore
  }
}

export function useDiscoverEngagement() {
  initFromLocalStorage();
  const authStore = useBasicAuthStore();

  const currentUserName = computed({
    get() {
      if (authStore?.isAuthenticated && authStore?.user) {
        return (
          authStore.user.idTokenClaims?.name ||
          [authStore.user.givenName, authStore.user.surname].filter(Boolean).join(' ') ||
          'Subscriber'
        );
      }
      if (typeof window !== 'undefined') {
        return localStorage.getItem(STORAGE_USER_NAME_KEY) || 'Guest Reader';
      }
      return 'Guest Reader';
    },
    set(val: string) {
      if (typeof window !== 'undefined' && val) {
        localStorage.setItem(STORAGE_USER_NAME_KEY, val.trim().slice(0, 50));
      }
    },
  });

  const currentUserAvatar = computed(() => {
    if (authStore?.isAuthenticated && authStore?.user) {
      return (
        authStore.userPhotoUrl ||
        authStore.user.photoUrl ||
        authStore.user.idTokenClaims?.picture
      );
    }
    return undefined;
  });

  const currentUserId = computed(() => {
    if (authStore?.isAuthenticated && authStore?.user) {
      return authStore.user.idTokenClaims?.userId || authStore.user.idTokenClaims?.email || 'authenticated-user';
    }
    return 'guest';
  });

  function getEngagement(key: string): DiscoverEngagement {
    if (!key) {
      return { itemKey: '', views: 0, likes: 0, isLiked: false, commentsCount: 0, comments: [] };
    }

    if (!engagements[key]) {
      const seed = generateSeedEngagement(key);
      const isLikedLocally = userLikedKeys.has(key);
      if (isLikedLocally) {
        seed.isLiked = true;
        seed.likes += 1;
      }

      // Merge any user comments previously saved in localStorage
      const userComments = getStoredUserComments()[key] || [];
      if (userComments.length) {
        const existingIds = new Set(seed.comments.map((c) => c.id));
        const cleanUserComments = userComments.filter((c) => !existingIds.has(c.id));
        seed.comments = [...cleanUserComments, ...seed.comments];
        seed.commentsCount = seed.comments.length;
      }

      engagements[key] = seed;

      // Asynchronously fetch live stats from server
      fetchLiveEngagement(key).catch(() => {});
    }

    return engagements[key]!;
  }

  async function fetchLiveEngagement(key: string) {
    if (typeof window === 'undefined') return;
    try {
      const res: any = await $fetch(`/api/v1/discover/engagement?key=${encodeURIComponent(key)}`);
      if (res?.success && res.data) {
        const live = res.data;
        const current = engagements[key];
        if (current) {
          // Keep highest views and preserve local likes/comments
          current.views = Math.max(current.views, live.views);
          if (userLikedKeys.has(key)) {
            current.isLiked = true;
            current.likes = Math.max(current.likes, live.likes);
          } else {
            current.likes = live.likes;
          }
        }
      }
    } catch {
      // offline or mock mode: rely on client state
    }
  }

  function trackView(key: string): void {
    if (!key || sessionViewed.has(key)) return;
    sessionViewed.add(key);

    const record = getEngagement(key);
    record.views += 1;

    if (typeof window !== 'undefined') {
      $fetch('/api/v1/discover/engagement/view', {
        method: 'POST',
        body: { key },
      }).catch(() => {});
    }
  }

  async function toggleLike(key: string): Promise<boolean> {
    if (!key) return false;
    const record = getEngagement(key);
    const willLike = !record.isLiked;

    record.isLiked = willLike;
    if (willLike) {
      record.likes += 1;
      userLikedKeys.add(key);
    } else {
      record.likes = Math.max(0, record.likes - 1);
      userLikedKeys.delete(key);
    }
    persistLikes();

    if (typeof window !== 'undefined') {
      try {
        const res: any = await $fetch('/api/v1/discover/engagement/like', {
          method: 'POST',
          body: {
            key,
            liked: willLike,
            userId: currentUserId.value,
          },
        });
        if (res?.success && typeof res.likes === 'number') {
          record.likes = res.likes;
          record.isLiked = res.isLiked;
        }
      } catch {
        // keep optimistic update
      }
    }

    return record.isLiked;
  }

  function getComments(key: string): DiscoverComment[] {
    const record = getEngagement(key);
    return record.comments;
  }

  async function addComment(
    key: string,
    content: string,
    customAuthor?: string
  ): Promise<DiscoverComment> {
    const record = getEngagement(key);
    const author = customAuthor || currentUserName.value;
    const { valid, error, cleanContent, cleanAuthor } = validateComment(content, author);
    if (!valid) {
      throw new Error(error || 'Invalid comment');
    }

    const newComment: DiscoverComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      itemKey: key,
      authorName: cleanAuthor,
      authorAvatar: currentUserAvatar.value,
      userId: currentUserId.value,
      content: cleanContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      isCurrentUser: true,
    };

    record.comments.unshift(newComment);
    record.commentsCount = record.comments.length;
    persistStoredUserComment(key, newComment);

    if (typeof window !== 'undefined') {
      try {
        const res: any = await $fetch('/api/v1/discover/comments', {
          method: 'POST',
          body: {
            key,
            authorName: newComment.authorName,
            authorAvatar: newComment.authorAvatar,
            userId: newComment.userId,
            content: newComment.content,
          },
        });
        if (res?.success && res.comment) {
          // Replace temporary id with server id
          newComment.id = res.comment.id;
        }
      } catch {
        // keep local comment
      }
    }

    return newComment;
  }

  async function deleteComment(key: string, commentId: string): Promise<boolean> {
    const record = getEngagement(key);
    const initialCount = record.comments.length;
    record.comments = record.comments.filter((c) => c.id !== commentId);
    record.commentsCount = record.comments.length;

    removeStoredUserComment(key, commentId);

    if (typeof window !== 'undefined') {
      try {
        await $fetch(`/api/v1/discover/comments/${encodeURIComponent(commentId)}`, {
          method: 'DELETE',
          body: { key, userId: currentUserId.value },
        });
      } catch {
        // ignore
      }
    }

    return record.comments.length < initialCount;
  }

  async function toggleCommentLike(key: string, commentId: string): Promise<boolean> {
    const record = getEngagement(key);
    const comment = record.comments.find((c) => c.id === commentId);
    if (!comment) return false;

    const willLike = !comment.isLiked;
    comment.isLiked = willLike;
    comment.likes += willLike ? 1 : Math.max(0, -1);

    if (typeof window !== 'undefined') {
      try {
        await $fetch(`/api/v1/discover/comments/${encodeURIComponent(commentId)}/like`, {
          method: 'POST',
          body: { key, liked: willLike, userId: currentUserId.value },
        });
      } catch {
        // keep optimistic update
      }
    }

    return comment.isLiked;
  }

  return {
    engagements,
    currentUserName,
    currentUserAvatar,
    currentUserId,
    getEngagement,
    trackView,
    toggleLike,
    getComments,
    addComment,
    deleteComment,
    toggleCommentLike,
    formatCount: formatEngagementCount,
    formatDate: formatCommentDate,
  };
}
