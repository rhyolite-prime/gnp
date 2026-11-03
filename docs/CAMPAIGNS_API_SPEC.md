# Unified Multi-Channel Campaigns & Broadcast API Specification

> **Frontend Blueprint Source:** `mocks/campaigns/index.js`, `services/campaigns.ts`, and `server/api/v1/campaigns/[...slug].ts`  
> **Admin Routes:** `/admin/campaigns` (Overview & Apache ECharts Analytics), `/admin/campaigns/new` (4-Step Broadcast Wizard), `/admin/campaigns/history` (Broadcast History)

---

## 1. Overview & Architecture

The unified **Campaigns** module replaces separate email campaign and push notification screens with a single multi-channel broadcast workflow supporting:

- **Channels (`channels`)**: `'push'` (*Browser Web Push + In-App Notification Center*), `'email'`, `'sms'`
- **Audience Targeting (`audienceType`)**:
  - `'all'` — All opted-in subscribers
  - `'groups'` — One or more subscriber cohorts (`selectedGroups`)
  - `'users'` — Single user or hand-picked subscribers searched by **Name** or **Email** (`selectedUsers`)
- **Delivery Modes (`deliveryMode`)**:
  - `'now'` — Immediate multi-channel dispatch
  - `'scheduled'` — Scheduled dispatch at `scheduledAt` (ISO-8601 UTC timestamp)
  - `'draft'` — Saved draft without dispatching

All responses follow the standard `gnp-api` envelope:

```json
{
  "success": true,
  "message": "OK",
  "unAuthorizedRequest": false,
  "error": null,
  "result": {}
}
```

---

## 2. Database Tables (`gnp-api`)

1. **`campaign_broadcasts`**
   - `id` (`UUID` / `VARCHAR(32)` PK)
   - `name` (`VARCHAR(200)` NOT NULL)
   - `category` (`VARCHAR(50)` NOT NULL — e.g. `morning_edition`, `breaking_news`, `weekend_digest`, `subscription`, `promo_offer`, `system`)
   - `channels` (`JSONB` / `TEXT[]` — subset of `['push', 'email', 'sms']`)
   - `audience_type` (`VARCHAR(20)` — `'all' | 'groups' | 'users'`)
   - `audience_label` (`VARCHAR(255)`)
   - `audience_count` (`INTEGER`)
   - `selected_group_ids` (`JSONB`)
   - `selected_user_ids` (`JSONB`)
   - `subject` (`VARCHAR(255)`), `preheader` (`VARCHAR(255)`), `email_body` (`TEXT`)
   - `push_title` (`VARCHAR(120)`), `push_body` (`VARCHAR(300)`), `image_url` (`TEXT`)
   - `sms_body` (`VARCHAR(480)`)
   - `cta_label` (`VARCHAR(80)`), `cta_url` (`VARCHAR(500)`)
   - `delivery_mode` (`VARCHAR(20)` — `'now' | 'scheduled' | 'draft'`)
   - `status` (`VARCHAR(20)` — `'sent' | 'scheduled' | 'draft' | 'cancelled'`)
   - `scheduled_at` (`TIMESTAMPTZ` NULL), `sent_at` (`TIMESTAMPTZ` NULL)
   - `created_by` (`UUID` FK -> `users.id`), `created_at` (`TIMESTAMPTZ`), `updated_at` (`TIMESTAMPTZ`)
2. **`campaign_delivery_events`**
   - `id` (`BIGSERIAL` PK), `campaign_id` (`FK`), `user_id` (`UUID`), `channel` (`'push' | 'email' | 'sms'`), `event_type` (`'queued' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'`), `revenue_ghs` (`NUMERIC(12,2)` DEFAULT 0), `created_at` (`TIMESTAMPTZ`)
3. **`web_push_subscriptions`**
   - `id` (`UUID` PK), `user_id` (`UUID` NULL), `endpoint` (`TEXT` UNIQUE), `p256dh` (`TEXT`), `auth` (`TEXT`), `user_agent` (`TEXT`), `is_active` (`BOOLEAN`), `created_at` (`TIMESTAMPTZ`)

---

## 3. Endpoints

| # | Method | Path | Purpose |
|---|---|---|---|
| 1 | `GET` | `/api/v1/campaigns/overview?period=7d\|14d\|30d` | KPI cards, 4 Apache ECharts specs, status counts, live Web Push/SSE counts, recent broadcasts, and quick-start presets |
| 2 | `GET` | `/api/v1/campaigns/history` | Paginated/filtered broadcast history (`status`, `channel`, `audienceType`, `search`) |
| 3 | `GET` | `/api/v1/campaigns/item?id=<id>` | Single broadcast record lookup for Wizard `?edit=<id>` and `?duplicate=<id>` |
| 4 | `GET` | `/api/v1/campaigns/groups` | List targetable user groups with member counts and per-channel reach |
| 5 | `GET` | `/api/v1/campaigns/users?q=<query>` | Live subscriber search by `name` or `email` for single/specific user targeting |
| 6 | `POST` | `/api/v1/campaigns/send` | Dispatch immediately (`deliveryMode: "now"`), schedule (`"scheduled"`), or save draft (`"draft"`) |
| 7 | `POST` | `/api/v1/campaigns/action` | Execute lifecycle action (`{ id, action: "publish" \| "cancel" \| "delete" }`) |
