import { defineEventHandler, getQuery, readBody, createError } from 'h3';
import {
  INITIAL_CAMPAIGNS_HISTORY,
  MOCK_CAMPAIGN_PRESETS,
  MOCK_CAMPAIGNS_ANALYTICS,
  MOCK_SUBSCRIBER_DIRECTORY,
  MOCK_USER_GROUPS,
} from '~/mocks/campaigns/index.js';
import { executeBroadcastDispatch, getPushHub } from '~/server/utils/pushDispatchStore';

interface CampaignStoreState {
  campaigns: any[];
}

function getCampaignStore(): CampaignStoreState {
  const g = globalThis as any;
  if (!g.__gnpUnifiedCampaignStoreV2) {
    g.__gnpUnifiedCampaignStoreV2 = {
      campaigns: JSON.parse(JSON.stringify(INITIAL_CAMPAIGNS_HISTORY)),
    };
  }
  return g.__gnpUnifiedCampaignStoreV2 as CampaignStoreState;
}

function resolveAudience(body: any): { count: number; label: string } {
  const audienceType = body.audienceType || body.audienceMode || 'all';
  if (audienceType === 'users') {
    const users = Array.isArray(body.selectedUsers) ? body.selectedUsers : [];
    return {
      count: Math.max(1, users.length),
      label:
        users.length === 1
          ? `${users[0].name} (${users[0].email})`
          : users.map((u: any) => u.name).join(', ') || 'Specific Users',
    };
  }
  if (audienceType === 'groups') {
    const groups = Array.isArray(body.selectedGroups) ? body.selectedGroups : [];
    const total = groups.reduce((sum: number, g: any) => sum + Number(g.memberCount || 0), 0);
    return {
      count: total || 1000,
      label: groups.map((g: any) => g.name).join(', ') || 'Selected User Groups',
    };
  }
  return {
    count: 48920,
    label: 'All Active Subscribers',
  };
}

function scaleChartsForPeriod(charts: any[], period: string) {
  const factor = period === '7d' ? 0.52 : period === '30d' ? 2.15 : 1;
  return JSON.parse(JSON.stringify(charts)).map((chart: any) => {
    if (chart.id === 'daily-delivery-by-channel' && period === '7d') {
      chart.labels = chart.labels.slice(-7);
      chart.series = chart.series.map((s: any) => ({ ...s, data: s.data.slice(-7) }));
      return chart;
    }
    if (chart.type === 'donut' && Array.isArray(chart.items)) {
      chart.items = chart.items.map((it: any) => ({
        ...it,
        value: Math.round(it.value * factor),
      }));
    }
    return chart;
  });
}

export default defineEventHandler(async (event) => {
  const slugParam = event.context.params?.slug;
  const route = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || '';
  const method = event.method;
  const store = getCampaignStore();
  const pushHub = getPushHub();

  // 1. Overview Stats & Apache ECharts Payloads -> GET /api/v1/campaigns/overview
  if (route === 'overview' && method === 'GET') {
    const period = String(getQuery(event).period || '14d');
    const factor = period === '7d' ? 0.52 : period === '30d' ? 2.15 : 1;

    const statusBreakdown = {
      all: store.campaigns.length,
      sent: store.campaigns.filter((c) => c.status === 'sent').length,
      scheduled: store.campaigns.filter((c) => c.status === 'scheduled').length,
      draft: store.campaigns.filter((c) => c.status === 'draft').length,
      cancelled: store.campaigns.filter((c) => c.status === 'cancelled').length,
    };

    const kpis = MOCK_CAMPAIGNS_ANALYTICS.kpis.map((kpi) => {
      if (kpi.format === 'percent') return { ...kpi };
      return {
        ...kpi,
        value: Math.round(kpi.value * factor),
      };
    });

    return {
      success: true,
      message: 'Unified campaign analytics loaded.',
      unAuthorizedRequest: false,
      error: null,
      result: {
        kpis,
        charts: scaleChartsForPeriod(MOCK_CAMPAIGNS_ANALYTICS.charts, period),
        statusBreakdown,
        pushHealth: {
          activeWebPushSubscriptions: pushHub.subscriptions.size,
          connectedLiveStreams: pushHub.sseClients.size,
        },
        recentBroadcasts: store.campaigns.slice(0, 5),
        presets: MOCK_CAMPAIGN_PRESETS,
      },
    };
  }

  // 2. Filterable Broadcast History -> GET /api/v1/campaigns/history
  if (route === 'history' && method === 'GET') {
    const q = getQuery(event);
    const search = String(q.search || '').trim().toLowerCase();
    const status = String(q.status || 'all').toLowerCase();
    const channel = String(q.channel || 'all').toLowerCase();
    const audienceType = String(q.audienceType || 'all').toLowerCase();

    const filtered = store.campaigns.filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (channel !== 'all' && !(item.channels || []).includes(channel)) return false;
      if (audienceType !== 'all' && item.audienceType !== audienceType) return false;
      if (search) {
        const hay = `${item.id} ${item.name} ${item.subject} ${item.pushTitle} ${item.audienceLabel} ${item.createdBy}`.toLowerCase();
        if (!hay.includes(search)) return false;
      }
      return true;
    });

    return {
      success: true,
      message: 'Broadcast history loaded.',
      unAuthorizedRequest: false,
      error: null,
      result: {
        items: filtered,
        total: filtered.length,
      },
    };
  }

  // 3. Single Campaign Lookup (for Edit / Duplicate in Wizard) -> GET /api/v1/campaigns/item?id=...
  if (route === 'item' && method === 'GET') {
    const { id } = getQuery(event);
    const found = store.campaigns.find((c) => c.id === id) || null;
    return {
      success: true,
      message: found ? 'Campaign loaded.' : 'Campaign not found.',
      unAuthorizedRequest: false,
      error: null,
      result: found,
    };
  }

  // 4. Target User Groups -> GET /api/v1/campaigns/groups
  if (route === 'groups' && method === 'GET') {
    return {
      success: true,
      message: 'User groups loaded.',
      unAuthorizedRequest: false,
      error: null,
      result: MOCK_USER_GROUPS,
    };
  }

  // 5. Search Subscribers by Name or Email -> GET /api/v1/campaigns/users?q=...
  if (route === 'users' && method === 'GET') {
    const q = String(getQuery(event).q || '').trim().toLowerCase();
    const matches = !q
      ? MOCK_SUBSCRIBER_DIRECTORY.slice(0, 8)
      : MOCK_SUBSCRIBER_DIRECTORY.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.toLowerCase().includes(q) ||
            u.group.toLowerCase().includes(q)
        );
    return {
      success: true,
      message: 'Matching subscribers retrieved.',
      unAuthorizedRequest: false,
      error: null,
      result: matches,
    };
  }

  // 6. Dispatch / Schedule / Save Draft Broadcast -> POST /api/v1/campaigns/send
  if (route === 'send' && method === 'POST') {
    const body = await readBody<any>(event);
    const nowIso = new Date().toISOString();
    const { count: audienceCount, label: audienceLabel } = resolveAudience(body);

    const deliveryMode = body.deliveryMode || 'now';
    const isImmediate = deliveryMode === 'now';
    const status =
      deliveryMode === 'draft' ? 'draft' : deliveryMode === 'scheduled' ? 'scheduled' : 'sent';

    const channels: string[] =
      Array.isArray(body.channels) && body.channels.length ? body.channels : ['push'];

    if (isImmediate && channels.includes('push')) {
      const sampleFirstName =
        body.audienceType === 'users' && body.selectedUsers?.[0]?.name
          ? String(body.selectedUsers[0].name).split(' ')[0]
          : 'Reader';
      const resolvedTitle = String(body.pushTitle || body.subject || body.name || 'Graphic NewsPlus Alert')
        .replace(/\{\{\s*first_name\s*\}\}/gi, sampleFirstName);
      const resolvedBody = String(body.pushBody || body.emailBody || body.smsBody || '')
        .replace(/\{\{\s*first_name\s*\}\}/gi, sampleFirstName)
        .slice(0, 220);

      await executeBroadcastDispatch({
        title: resolvedTitle,
        body: resolvedBody,
        category: body.category || 'morning_edition',
        urgency: body.category === 'breaking_news' ? 'high' : 'normal',
        deepLink: body.ctaUrl || '/newspapers',
        imageUrl: body.imageUrl || undefined,
        actions: body.ctaLabel
          ? [{ action: 'primary', title: body.ctaLabel, url: body.ctaUrl || '/newspapers' }]
          : [],
        targetSegment: 'all_subscribers',
        scheduleMode: 'now',
        createdBy: 'Admin Campaign Wizard',
      });
    }

    const delivered = isImmediate ? Math.max(1, Math.round(audienceCount * 0.985)) : 0;
    const opened = isImmediate ? Math.max(1, Math.round(delivered * 0.45)) : 0;
    const clicked = isImmediate ? Math.max(0, Math.round(delivered * 0.165)) : 0;

    const record = {
      id: body.id || `CMP-2026-${Math.floor(109 + Math.random() * 890)}`,
      name: body.name || 'Untitled Broadcast',
      category: body.category || 'morning_edition',
      channels,
      audienceType: body.audienceType || 'all',
      audienceLabel,
      audienceCount,
      selectedGroups: body.selectedGroups || [],
      selectedUsers: body.selectedUsers || [],
      subject: body.subject || '',
      preheader: body.preheader || '',
      pushTitle: body.pushTitle || '',
      pushBody: body.pushBody || '',
      emailBody: body.emailBody || '',
      smsBody: body.smsBody || '',
      ctaLabel: body.ctaLabel || 'Read Edition',
      ctaUrl: body.ctaUrl || '/newspapers',
      imageUrl: body.imageUrl || '',
      deliveryMode,
      status,
      metrics: {
        delivered,
        opened,
        clicked,
        openRate: isImmediate ? 45.0 : 0,
        ctr: isImmediate ? 16.5 : 0,
        revenueGhs: isImmediate ? Math.round(clicked * 0.85) : 0,
      },
      createdBy: 'Admin User',
      createdAt: nowIso,
      sentAt: isImmediate ? nowIso : null,
      scheduledAt: deliveryMode === 'scheduled' ? body.scheduledAt : null,
    };

    const existingIdx = store.campaigns.findIndex((c) => c.id === record.id);
    if (existingIdx >= 0) {
      store.campaigns[existingIdx] = record;
    } else {
      store.campaigns.unshift(record);
    }

    return {
      success: true,
      message: isImmediate
        ? 'Broadcast dispatched across selected channels.'
        : deliveryMode === 'scheduled'
          ? 'Broadcast scheduled.'
          : 'Draft saved.',
      unAuthorizedRequest: false,
      error: null,
      result: record,
    };
  }

  // 7. Lifecycle Actions (Publish Now / Cancel Schedule / Delete) -> POST /api/v1/campaigns/action
  if (route === 'action' && method === 'POST') {
    const body = await readBody<{ id: string; action: 'publish' | 'cancel' | 'delete' }>(event);
    const idx = store.campaigns.findIndex((c) => c.id === body.id);
    if (idx === -1) {
      throw createError({ statusCode: 404, statusMessage: 'Broadcast not found' });
    }

    if (body.action === 'delete') {
      const [removed] = store.campaigns.splice(idx, 1);
      return { success: true, message: 'Broadcast deleted.', result: removed };
    }

    const item = store.campaigns[idx];
    if (body.action === 'cancel') {
      item.status = 'cancelled';
      return { success: true, message: 'Scheduled broadcast cancelled.', result: item };
    }

    if (body.action === 'publish') {
      item.status = 'sent';
      item.deliveryMode = 'now';
      item.sentAt = new Date().toISOString();
      const delivered = Math.max(1, Math.round((item.audienceCount || 1) * 0.985));
      item.metrics = {
        delivered,
        opened: Math.max(1, Math.round(delivered * 0.44)),
        clicked: Math.max(0, Math.round(delivered * 0.16)),
        openRate: 44.0,
        ctr: 16.0,
        revenueGhs: Math.round(delivered * 0.14),
      };

      if ((item.channels || []).includes('push')) {
        await executeBroadcastDispatch({
          title: item.pushTitle || item.subject || item.name,
          body: item.pushBody || item.emailBody || item.smsBody || 'New update on Graphic NewsPlus',
          category: item.category || 'morning_edition',
          urgency: item.category === 'breaking_news' ? 'high' : 'normal',
          deepLink: item.ctaUrl || '/newspapers',
          imageUrl: item.imageUrl || undefined,
          actions: item.ctaLabel
            ? [{ action: 'primary', title: item.ctaLabel, url: item.ctaUrl || '/newspapers' }]
            : [],
          targetSegment: 'all_subscribers',
          scheduleMode: 'now',
          createdBy: 'Admin History Action',
        });
      }
      return { success: true, message: 'Broadcast dispatched now.', result: item };
    }
  }

  throw createError({ statusCode: 404, statusMessage: `Unknown campaign endpoint: ${route}` });
});
