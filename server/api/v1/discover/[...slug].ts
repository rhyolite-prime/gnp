import { defineEventHandler, getQuery, readBody, createError, getCookie, getHeader } from 'h3';
import {
  getOrCreateEngagement,
  recordItemView,
  recordItemLike,
  createItemComment,
  removeItemComment,
  recordCommentLike,
} from '~/server/utils/discoverEngagementStore';

function resolveUserId(event: any, explicitId?: string): string {
  if (explicitId && typeof explicitId === 'string' && explicitId.trim()) {
    return explicitId.trim();
  }
  const headerId = getHeader(event, 'x-user-id');
  if (headerId && typeof headerId === 'string') return headerId.trim();

  const cookie = getCookie(event, 'gnp-user-identity');
  if (cookie) {
    try {
      const parts = cookie.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1]!, 'base64').toString('utf8'));
        if (payload?.userId) return String(payload.userId);
        if (payload?.email) return String(payload.email);
      }
    } catch {
      // ignore bad jwt cookie
    }
  }
  return 'anonymous';
}

export default defineEventHandler(async (event) => {
  const slugParam = event.context.params?.slug;
  const route = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || '';
  const method = event.method;
  const query = getQuery(event);

  // 1. GET /api/v1/discover/engagement
  if (route === 'engagement' && method === 'GET') {
    const userId = resolveUserId(event, query.userId as string);
    const key = query.key as string;
    const keys = query.keys as string;

    if (keys) {
      const keyList = keys.split(',').map((k) => k.trim()).filter(Boolean);
      const data: Record<string, any> = {};
      for (const k of keyList) {
        data[k] = getOrCreateEngagement(k, userId);
      }
      return { success: true, data };
    }

    if (!key) {
      throw createError({ statusCode: 400, statusMessage: 'Item key is required' });
    }
    const data = getOrCreateEngagement(key, userId);
    return { success: true, data };
  }

  // 2. POST /api/v1/discover/engagement/view
  if (route === 'engagement/view' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const key = body?.key || (query.key as string);
    if (!key) {
      throw createError({ statusCode: 400, statusMessage: 'Item key is required' });
    }
    const result = recordItemView(key);
    return { success: true, ...result };
  }

  // 3. POST /api/v1/discover/engagement/like
  if (route === 'engagement/like' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const key = body?.key || (query.key as string);
    if (!key) {
      throw createError({ statusCode: 400, statusMessage: 'Item key is required' });
    }
    const userId = resolveUserId(event, body?.userId);
    const result = recordItemLike(key, userId, body?.liked);
    return { success: true, ...result };
  }

  // 4. GET /api/v1/discover/comments
  if (route === 'comments' && method === 'GET') {
    const key = query.key as string;
    if (!key) {
      throw createError({ statusCode: 400, statusMessage: 'Item key is required' });
    }
    const userId = resolveUserId(event, query.userId as string);
    const engagement = getOrCreateEngagement(key, userId);
    return {
      success: true,
      comments: engagement.comments,
      total: engagement.commentsCount,
    };
  }

  // 5. POST /api/v1/discover/comments
  if (route === 'comments' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const key = body?.key;
    if (!key) {
      throw createError({ statusCode: 400, statusMessage: 'Item key is required' });
    }
    const userId = resolveUserId(event, body?.userId);
    try {
      const result = createItemComment(key, {
        authorName: body.authorName,
        content: body.content,
        userId: userId !== 'anonymous' ? userId : undefined,
        authorAvatar: body.authorAvatar,
      });
      return { success: true, ...result };
    } catch (err: any) {
      throw createError({ statusCode: 400, statusMessage: err?.message || 'Invalid comment' });
    }
  }

  // 6. DELETE /api/v1/discover/comments/:id
  if (route.startsWith('comments/') && !route.endsWith('/like') && method === 'DELETE') {
    const commentId = route.replace('comments/', '');
    const body = await readBody(event).catch(() => ({}));
    const key = body?.key || (query.key as string);
    if (!key) {
      throw createError({ statusCode: 400, statusMessage: 'Item key is required' });
    }
    const userId = resolveUserId(event, body?.userId || (query.userId as string));
    const result = removeItemComment(key, commentId, userId !== 'anonymous' ? userId : undefined);
    return { success: true, ...result };
  }

  // 7. POST /api/v1/discover/comments/:id/like
  if (route.startsWith('comments/') && route.endsWith('/like') && method === 'POST') {
    const parts = route.split('/');
    const commentId = parts[1];
    if (!commentId) {
      throw createError({ statusCode: 400, statusMessage: 'Comment ID is required' });
    }
    const body = await readBody(event).catch(() => ({}));
    const key = body?.key || (query.key as string);
    if (!key) {
      throw createError({ statusCode: 400, statusMessage: 'Item key is required' });
    }
    const userId = resolveUserId(event, body?.userId);
    try {
      const result = recordCommentLike(key, commentId, userId, body?.liked);
      return { success: true, ...result };
    } catch (err: any) {
      throw createError({ statusCode: 404, statusMessage: err?.message || 'Comment not found' });
    }
  }

  throw createError({ statusCode: 404, statusMessage: 'Discover API endpoint not found' });
});
