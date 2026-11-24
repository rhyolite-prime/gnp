import { defineEventHandler, getQuery, readBody, createError } from 'h3';
import {
  listDiscoverCms,
  createDiscoverCmsRecord,
  updateDiscoverCmsRecord,
  patchDiscoverCmsStatus,
  deleteDiscoverCmsRecord,
  reorderDiscoverCmsRecords,
  updateDiscoverCmsSettings,
  listRememberWhenCms,
  createRememberWhenSlideRecord,
  updateRememberWhenSlideRecord,
  patchRememberWhenSlideStatus,
  deleteRememberWhenSlideRecord,
  reorderRememberWhenSlides,
  updateRememberWhenSettings,
} from '~/server/utils/cmsStore';

export default defineEventHandler(async (event) => {
  const slugParam = event.context.params?.slug;
  const route = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || '';
  const method = event.method;
  const query = getQuery(event);

  // ── Discover CMS ───────────────────────────────────────────────────────────

  if (route === 'discover' && method === 'GET') {
    const result = listDiscoverCms({
      status: query.status ? String(query.status) : undefined,
      kind: query.kind ? String(query.kind) : undefined,
      q: query.q ? String(query.q) : undefined,
      publishedOnly: query.publishedOnly === 'true' || query.publishedOnly === '1',
    });
    return {
      success: true,
      message: 'Discover CMS content loaded.',
      unAuthorizedRequest: false,
      error: null,
      result,
    };
  }

  if (route === 'discover' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    try {
      const item = createDiscoverCmsRecord(body || {});
      return {
        success: true,
        message: 'Discover item created.',
        unAuthorizedRequest: false,
        error: null,
        result: item,
      };
    } catch (err: any) {
      throw createError({ statusCode: 400, statusMessage: err?.message || 'Invalid Discover item' });
    }
  }

  if (route === 'discover/config' && method === 'PUT') {
    const body = await readBody(event).catch(() => ({}));
    const config = updateDiscoverCmsSettings(body || {});
    return {
      success: true,
      message: 'Discover configuration updated.',
      unAuthorizedRequest: false,
      error: null,
      result: config,
    };
  }

  if (route === 'discover/reorder' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const ids = Array.isArray(body?.ids) ? body.ids.map(String) : [];
    if (!ids.length) {
      throw createError({ statusCode: 400, statusMessage: 'An ordered list of item IDs is required.' });
    }
    const items = reorderDiscoverCmsRecords(ids);
    return {
      success: true,
      message: 'Discover items reordered.',
      unAuthorizedRequest: false,
      error: null,
      result: items,
    };
  }

  if (route.startsWith('discover/') && route.endsWith('/status') && method === 'POST') {
    const id = route.slice('discover/'.length, -'/status'.length);
    const body = await readBody(event).catch(() => ({}));
    try {
      const item = patchDiscoverCmsStatus(id, {
        status: body?.status,
        pinned: body?.pinned,
      });
      return {
        success: true,
        message: 'Discover item status updated.',
        unAuthorizedRequest: false,
        error: null,
        result: item,
      };
    } catch (err: any) {
      throw createError({ statusCode: 404, statusMessage: err?.message || 'Discover item not found' });
    }
  }

  if (route.startsWith('discover/') && method === 'PUT') {
    const id = route.slice('discover/'.length);
    const body = await readBody(event).catch(() => ({}));
    try {
      const item = updateDiscoverCmsRecord(id, body || {});
      return {
        success: true,
        message: 'Discover item updated.',
        unAuthorizedRequest: false,
        error: null,
        result: item,
      };
    } catch (err: any) {
      const code = err?.message?.includes('not found') ? 404 : 400;
      throw createError({ statusCode: code, statusMessage: err?.message || 'Failed to update Discover item' });
    }
  }

  if (route.startsWith('discover/') && method === 'DELETE') {
    const id = route.slice('discover/'.length);
    const deleted = deleteDiscoverCmsRecord(id);
    if (!deleted) {
      throw createError({ statusCode: 404, statusMessage: 'Discover item not found' });
    }
    return {
      success: true,
      message: 'Discover item deleted.',
      unAuthorizedRequest: false,
      error: null,
      result: { id, deleted: true },
    };
  }

  // ── Remember When CMS ──────────────────────────────────────────────────────

  if (route === 'remember-when' && method === 'GET') {
    const result = listRememberWhenCms({
      status: query.status ? String(query.status) : undefined,
      q: query.q ? String(query.q) : undefined,
      publishedOnly: query.publishedOnly === 'true' || query.publishedOnly === '1',
    });
    return {
      success: true,
      message: 'Remember When CMS content loaded.',
      unAuthorizedRequest: false,
      error: null,
      result,
    };
  }

  if (route === 'remember-when' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    try {
      const slide = createRememberWhenSlideRecord(body || {});
      return {
        success: true,
        message: 'Remember When slide created.',
        unAuthorizedRequest: false,
        error: null,
        result: slide,
      };
    } catch (err: any) {
      throw createError({ statusCode: 400, statusMessage: err?.message || 'Invalid Remember When slide' });
    }
  }

  if (route === 'remember-when/config' && method === 'PUT') {
    const body = await readBody(event).catch(() => ({}));
    const config = updateRememberWhenSettings(body || {});
    return {
      success: true,
      message: 'Remember When settings updated.',
      unAuthorizedRequest: false,
      error: null,
      result: config,
    };
  }

  if (route === 'remember-when/reorder' && method === 'POST') {
    const body = await readBody(event).catch(() => ({}));
    const ids = Array.isArray(body?.ids) ? body.ids.map(String) : [];
    if (!ids.length) {
      throw createError({ statusCode: 400, statusMessage: 'An ordered list of slide IDs is required.' });
    }
    const slides = reorderRememberWhenSlides(ids);
    return {
      success: true,
      message: 'Remember When slides reordered.',
      unAuthorizedRequest: false,
      error: null,
      result: slides,
    };
  }

  if (route.startsWith('remember-when/') && route.endsWith('/status') && method === 'POST') {
    const id = route.slice('remember-when/'.length, -'/status'.length);
    const body = await readBody(event).catch(() => ({}));
    const status = body?.status === 'published' ? 'published' : 'draft';
    try {
      const slide = patchRememberWhenSlideStatus(id, status);
      return {
        success: true,
        message: 'Remember When slide status updated.',
        unAuthorizedRequest: false,
        error: null,
        result: slide,
      };
    } catch (err: any) {
      throw createError({ statusCode: 404, statusMessage: err?.message || 'Remember When slide not found' });
    }
  }

  if (route.startsWith('remember-when/') && method === 'PUT') {
    const id = route.slice('remember-when/'.length);
    const body = await readBody(event).catch(() => ({}));
    try {
      const slide = updateRememberWhenSlideRecord(id, body || {});
      return {
        success: true,
        message: 'Remember When slide updated.',
        unAuthorizedRequest: false,
        error: null,
        result: slide,
      };
    } catch (err: any) {
      const code = err?.message?.includes('not found') ? 404 : 400;
      throw createError({ statusCode: code, statusMessage: err?.message || 'Failed to update Remember When slide' });
    }
  }

  if (route.startsWith('remember-when/') && method === 'DELETE') {
    const id = route.slice('remember-when/'.length);
    const deleted = deleteRememberWhenSlideRecord(id);
    if (!deleted) {
      throw createError({ statusCode: 404, statusMessage: 'Remember When slide not found' });
    }
    return {
      success: true,
      message: 'Remember When slide deleted.',
      unAuthorizedRequest: false,
      error: null,
      result: { id, deleted: true },
    };
  }

  throw createError({ statusCode: 404, statusMessage: 'CMS API endpoint not found' });
});
