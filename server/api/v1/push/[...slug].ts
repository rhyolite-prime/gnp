import { defineEventHandler, getHeader, readBody, setResponseHeaders } from 'h3';
import type { DispatchPushRequestDto, PushTopicCategory } from '~/models/pushNotifications';
import {
  buildPushDashboardPayload,
  detectBrowserAndOs,
  executeBroadcastDispatch,
  getPushHub,
} from '~/server/utils/pushDispatchStore';

export default defineEventHandler(async (event) => {
  const slugParam = event.context.params?.slug;
  const route = Array.isArray(slugParam) ? slugParam.join('/') : slugParam || '';
  const method = event.method;
  const hub = getPushHub();

  // 1. Live Server-Sent Events Stream (`/api/v1/push/stream`)
  // Replaces insecure `ws://localhost:5034/notifications` with relative HTTPS-safe real-time delivery
  if (route === 'stream' && method === 'GET') {
    setResponseHeaders(event, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const clientId = `sse-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const res = event.node.res;

    const sendEvent = (eventName: string, data: any) => {
      res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    hub.sseClients.set(clientId, { id: clientId, send: sendEvent });
    sendEvent('connected', {
      clientId,
      vapidPublicKey: hub.vapidKeys.publicKey,
      connectedClients: hub.sseClients.size,
      ts: Date.now(),
    });

    const heartbeat = setInterval(() => {
      try {
        res.write(`: heartbeat ${Date.now()}\n\n`);
      } catch {
        clearInterval(heartbeat);
        hub.sseClients.delete(clientId);
      }
    }, 20000);

    event.node.req.on('close', () => {
      clearInterval(heartbeat);
      hub.sseClients.delete(clientId);
    });

    // Keep connection open until client disconnects
    return new Promise(() => {});
  }

  // 2. Public VAPID Key Endpoint
  if (route === 'vapid-public-key' && method === 'GET') {
    return {
      success: true,
      message: 'VAPID public key retrieved.',
      unAuthorizedRequest: false,
      error: null,
      result: {
        publicKey: hub.vapidKeys.publicKey,
        subject: hub.vapidKeys.subject,
      },
    };
  }

  // 3. Dashboard Telemetry & Registry
  if (route === 'dashboard' && method === 'GET') {
    return {
      success: true,
      message: 'Push notification analytics & registry loaded.',
      unAuthorizedRequest: false,
      error: null,
      result: buildPushDashboardPayload(),
    };
  }

  // 4. Register / Upsert Browser Subscription
  if (route === 'subscribe' && method === 'POST') {
    const body = await readBody<any>(event).catch(() => ({}));
    const ua = getHeader(event, 'user-agent') || body?.userAgent || '';
    const { browserName, osName } = detectBrowserAndOs(ua);

    const subObj = body?.subscription || {};
    const endpoint =
      subObj.endpoint ||
      `https://simulated-push.graphicnewsplus.com/session/${body?.deviceId || Date.now()}`;

    const existing = hub.subscriptions.get(endpoint);
    const defaultTopics: PushTopicCategory[] = [
      'breaking_news',
      'morning_edition',
      'subscriptions_billing',
      'originals_multimedia',
      'archives_research',
      'games_daily',
      'promotions_offers',
      'platform_updates',
    ];

    const record = {
      id: existing?.id || `sub-live-${Date.now().toString(36)}`,
      endpoint,
      keys: {
        p256dh: subObj.keys?.p256dh || 'simulated-p256dh-key',
        auth: subObj.keys?.auth || 'simulated-auth-secret',
      },
      browserName,
      osName,
      userAgent: ua,
      userId: body?.userId,
      userLabel: body?.userLabel || `${browserName} on ${osName} (Current Session)`,
      segment: body?.segment || 'paid_active',
      topics: Array.isArray(body?.topics) && body.topics.length ? body.topics : existing?.topics || defaultTopics,
      quietHours: body?.quietHours || existing?.quietHours || {
        enabled: false,
        start: '22:00',
        end: '05:30',
      },
      isSimulated: Boolean(!subObj.endpoint || body?.isSimulated),
      createdAt: existing?.createdAt || new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };

    hub.subscriptions.set(endpoint, record);

    return {
      success: true,
      message: 'Browser push subscription registered successfully.',
      unAuthorizedRequest: false,
      error: null,
      result: record,
    };
  }

  // 5. Update Subscriber Topic & Quiet-Hours Preferences
  if (route === 'preferences' && method === 'POST') {
    const body = await readBody<any>(event).catch(() => ({}));
    const endpoint = body?.endpoint;
    if (endpoint && hub.subscriptions.has(endpoint)) {
      const target = hub.subscriptions.get(endpoint)!;
      if (Array.isArray(body.topics)) target.topics = body.topics;
      if (body.quietHours) target.quietHours = body.quietHours;
      target.lastSeenAt = new Date().toISOString();
      hub.subscriptions.set(endpoint, target);
      return {
        success: true,
        message: 'Notification preferences saved.',
        unAuthorizedRequest: false,
        error: null,
        result: target,
      };
    }
    return {
      success: true,
      message: 'Local preferences acknowledged.',
      unAuthorizedRequest: false,
      error: null,
      result: body,
    };
  }

  // 6. Unsubscribe Device Endpoint
  if (route === 'unsubscribe' && (method === 'DELETE' || method === 'POST')) {
    const body = await readBody<any>(event).catch(() => ({}));
    if (body?.endpoint) {
      hub.subscriptions.delete(body.endpoint);
    }
    return {
      success: true,
      message: 'Browser push subscription removed.',
      unAuthorizedRequest: false,
      error: null,
      result: { unsubscribed: true },
    };
  }

  // 7. Dispatch Campaign / Update Broadcast
  if (route === 'dispatch' && method === 'POST') {
    const dto = await readBody<DispatchPushRequestDto>(event);
    const record = await executeBroadcastDispatch(dto);
    return {
      success: true,
      message:
        record.status === 'SCHEDULED'
          ? `Push notification scheduled for ${record.scheduledAt}.`
          : `Push broadcast dispatched to ${record.deliveredCount.toLocaleString()} devices.`,
      unAuthorizedRequest: false,
      error: null,
      result: record,
    };
  }

  // 8. Live Single-Browser Test Push
  if (route === 'test' && method === 'POST') {
    const body = await readBody<Partial<DispatchPushRequestDto> & { endpoint?: string }>(event).catch(
      () => ({})
    );
    const dto: DispatchPushRequestDto = {
      title: body.title || 'Graphic NewsPlus — Live Browser Push Verified!',
      body:
        body.body ||
        'Your browser is actively receiving encrypted Web Push & real-time newsroom dispatches.',
      category: body.category || 'platform_updates',
      urgency: body.urgency || 'high',
      deepLink: body.deepLink || '/newspapers',
      imageUrl: body.imageUrl,
      actions: body.actions || [
        { action: 'open', title: 'Open Today’s Paper', url: '/newspapers' },
        { action: 'reports', title: 'View Analytics', url: '/admin/push-notifications' },
      ],
      targetSegment: 'all_subscribers',
      scheduleMode: 'now',
    };
    const record = await executeBroadcastDispatch(dto, {
      targetEndpointOnly: body.endpoint,
    });
    return {
      success: true,
      message: 'Test push dispatched to your browser.',
      unAuthorizedRequest: false,
      error: null,
      result: record,
    };
  }

  // 9. Trigger or Cancel Scheduled Broadcast
  if (route === 'trigger-scheduled' && method === 'POST') {
    const { id } = await readBody<{ id: string }>(event).catch(() => ({ id: '' }));
    const idx = hub.broadcasts.findIndex((b) => b.id === id);
    if (idx !== -1) {
      const target = hub.broadcasts[idx];
      hub.broadcasts.splice(idx, 1);
      const sent = await executeBroadcastDispatch({
        title: target.title,
        body: target.body,
        category: target.category,
        urgency: target.urgency,
        deepLink: target.deepLink,
        imageUrl: target.imageUrl,
        actions: target.actions,
        targetSegment: target.targetSegment,
        scheduleMode: 'now',
        createdBy: target.createdBy,
      });
      return {
        success: true,
        message: 'Scheduled broadcast sent immediately.',
        unAuthorizedRequest: false,
        error: null,
        result: sent,
      };
    }
  }

  if (route === 'cancel-scheduled' && method === 'POST') {
    const { id } = await readBody<{ id: string }>(event).catch(() => ({ id: '' }));
    const item = hub.broadcasts.find((b) => b.id === id);
    if (item && item.status === 'SCHEDULED') {
      item.status = 'CANCELLED';
    }
    return {
      success: true,
      message: 'Scheduled broadcast cancelled.',
      unAuthorizedRequest: false,
      error: null,
      result: item || null,
    };
  }

  // 10. Delivery / Display / Click / Dismiss Telemetry Callback from `sw-push.js`
  if (route === 'track' && method === 'POST') {
    const { id, event: eventType } = await readBody<{
      id: string;
      event: 'displayed' | 'clicked' | 'dismissed';
    }>(event).catch(() => ({ id: '', event: 'displayed' as const }));

    const target = hub.broadcasts.find((b) => b.id === id);
    if (target) {
      if (eventType === 'displayed') target.displayedCount++;
      if (eventType === 'clicked') target.clickedCount++;
      if (eventType === 'dismissed') target.dismissedCount++;
      if (target.deliveredCount > 0) {
        target.ctrPercent = +((target.clickedCount / target.deliveredCount) * 100).toFixed(1);
      }
    }

    return {
      success: true,
      message: 'Telemetry event recorded.',
      unAuthorizedRequest: false,
      error: null,
      result: { recorded: true },
    };
  }

  return {
    success: false,
    message: `Unknown push endpoint: ${route}`,
    unAuthorizedRequest: false,
    error: { code: 404, message: 'Not Found' },
    result: null,
  };
});
