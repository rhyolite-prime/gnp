# Graphic NewsPlus — Platform Reports, Backend API Contracts & PostgreSQL Schema Architecture

> **Target Backend Repository:** [`https://github.com/rhyolite-prime/gnp-api`](https://github.com/rhyolite-prime/gnp-api) (C++20 / Drogon Framework + PostgreSQL + `pgvector`)  
> **Frontend Reference Implementation (`/admin` Routes):** `/admin/reports`, `/admin/dashboard`, `/admin/affiliates/dashboard`, `/admin/archives/dashboard`  
> **Charting Engine:** **100% Apache ECharts v6 (`echarts ^6.1.0`)** via `components/reports/EChartCanvas.vue` & `components/reports/ReportKpiSparkCard.vue`  
> **Runnable SQL DDL File:** [`docs/sql/gnp_reports_schema_migrations.sql`](./sql/gnp_reports_schema_migrations.sql)

---

## 1. Executive Summary of `rhyolite-prime/gnp-api` Codebase Audit

A full line-by-line inspection of all **46 Drogon ORM models (`models/*.{h,cc}`)**, **controllers (`controllers/ReportsController.{h,cc}`)**, **DTOs (`dto/ReportDto.h`)**, **services (`NewspaperService.cc`, `CommercialPartnerService.cc`, `AffiliateService.cc`, `DashboardService.cc`, `ReportingService.h`)**, and **SQL migrations (`sql/*.sql`)** in `rhyolite-prime/gnp-api` surfaced **6 critical findings & bugs** that directly affect report implementation:

| # | File & Line in `gnp-api` | Severity | Finding | Required Backend Fix |
|---|---|---|---|---|
| 1 | `controllers/ReportsController.cc:51` | **BUG** | `ReportsController::sendPartnerInvoiceEmail` calls `partnerService_->getPartnerInvoiceGenerationReport(dto)` instead of `sendPartnerInvoiceByMail(dto)` — no email is ever sent. | Invoke `partnerService_->sendPartnerInvoiceByMail(dto)` and return `{"sent": true, "recipient": billingEmail}`. |
| 2 | `services/CommercialPartnerService.cc:3679` | **BUG** | In `getPartnerInvoiceGenerationReport`, `totalDue = totalInvoiceAmount + vat` omits `+ getflNhil - discount` even though both `getflNhil` (5%) and `discount` are computed on lines 3675–3678. Also `getPartnerAnalyticsCharts` selects `publications.title`, whereas `models/Publications.cc` defines the column as `publications.name`. | Set `double taxableBase = std::max(0.0, subtotal - discount); double getflNhil = taxableBase * 0.05; double vat = taxableBase * 0.15; double totalDue = taxableBase + getflNhil + vat;` and alias `SELECT p.name AS title FROM publications p`. |
| 3 | `services/NewspaperService.cc:1485` | **BUG** | `generateNewspaperEngagementReport` returns `ERR_INVALID_REQUEST` when `dto.partnerId` is empty, blocking platform-wide newspaper engagement reports in `/admin/reports`. It also aggregates lifetime counters (`newspapers.views`, `newspapers.sales`) grouped by `publication_date` rather than reader/sale event timestamps. | Make `partnerId` optional (`($3::uuid IS NULL OR ...)`), and join `user_reading_history.last_read_at` + the new `edition_sales_ledger` table for accurate date-windowed metrics. |
| 4 | `services/AffiliateService.cc:1506` | **BUG** | `getAffiliateDashboardStats` queries `FROM commissions` (table does not exist — ORM model is `affiliate_commissions`) and selects `affiliates.name` (ORM columns are `first_name` and `last_name`). | Query `public.affiliate_commissions ac JOIN public.affiliates a ON a.id = ac.affiliate_id` and compute `CONCAT_WS(' ', a.first_name, a.last_name) AS affiliate_name`. |
| 5 | `dto/ReportDto.h:1-22` | **GAP** | `ReportDto` only parses `partnerId`, `startDate`, and `endDate`. | Upgrade `ReportDto.h` (exact C++ header included in `utils/reportsSchemaCatalog.ts` as `RECOMMENDED_CPP_REPORT_DTO`) to add optional `publicationId`, `affiliateId`, `plan`, `status`, `channel`, `granularity`, `pageNo`, and `pageSize`. |
| 6 | `services/ReportingService.h:1-8` | **GAP** | `ReportingService.h` is an empty class stub (`class ReportingService {};`). Meanwhile frontend `services/reports.ts` previously pointed almost every report function at `newspaper-engagement`. | Implement all **26 report handlers** in `ReportingService.{h,cc}` exposed via `ReportsController` under `/api/v1/reports/<slug>` using Drogon's standard `BaseApiResponse<GeneratedReportResult>` envelope. |

---

## 2. Standard Backend JSON Response Contract (`BaseApiResponse<GeneratedReportResult>`)

Every report endpoint in `server/api/v1/reports/[...slug].ts` returns the exact JSON envelope expected from Drogon's `ApiResponse::success(...)` helper so frontend services require **zero structural changes** when switching from the Nuxt Nitro mock server to C++ `gnp-api`:

```json
{
  "success": true,
  "message": "Sales & Revenue Summary generated successfully.",
  "unAuthorizedRequest": false,
  "error": null,
  "result": {
    "reportMeta": {
      "reportId": "sales_revenue",
      "reportName": "Sales & Revenue Summary",
      "group": "Financial & Billing",
      "generatedAt": "2026-10-22T12:00:00.000Z",
      "startDate": "2026-10-09",
      "endDate": "2026-10-22",
      "currency": "GHS",
      "filtersApplied": {}
    },
    "kpis": [
      {
        "id": "gross_rev",
        "label": "Gross Platform Revenue",
        "value": "GHS 184,920.00",
        "rawValue": 184920,
        "delta": 18.4,
        "deltaType": "increase",
        "sublabel": "Net after 1.95% Paystack fees: GHS 181,314.06",
        "sparkline": [11200, 12450, 11890, 13400, 14920, 10800, 9950]
      }
    ],
    "charts": [
      {
        "id": "revenue_by_stream_stacked",
        "title": "Daily Revenue Mix by Stream (GHS)",
        "subtitle": "Stacked daily gross collections across subscriptions, single copies, B2B bulk seats & archive credits",
        "span": "full",
        "height": 340,
        "option": { "tooltip": {}, "xAxis": {}, "yAxis": {}, "series": [] }
      }
    ],
    "columns": [
      { "key": "date", "label": "Date", "format": "text" },
      { "key": "grossRevenue", "label": "Gross Total", "format": "currency", "align": "right" }
    ],
    "rows": []
  }
}
```

---

## 3. Complete Mapping of All 26 Platform Reports to Existing `gnp-api` ORM Tables & New Tables

### Group 1: Financial & Billing (`financial`)
| Report ID & Name | Endpoint (`POST`) | Status | Existing `gnp-api` ORM Tables & Columns | Recommended Schema Additions |
|---|---|---|---|---|
| `sales_revenue` — **Sales & Revenue Summary** | `/api/v1/reports/sales-revenue` | Core | `payments` (`amount`, `currency`, `status`, `paid_at`, `created_at`), `user_subscriptions` (`plan`, `auto_renew`, `partner_id`), `newspapers` (`sales`, `price`, `publication_id`) | `payments` (`payment_purpose`, `channel`, `gateway_fee`, `net_amount`), `edition_sales_ledger` |
| `payment_transactions` — **Payment Transactions & MoMo Channels** | `/api/v1/reports/payment-transactions` | Core | `payments` (`id`, `user_id`, `paystack_reference`, `amount`, `status`, `gateway_response`, `paid_at`), `users` (`email`, `first_name`, `last_name`) | `payments` (`channel`, `mobile_money_network`, `gateway_fee`, `failure_code`, `refunded_at`) |
| `partner_invoices` — **Partner Tax Invoices (GRA VAT/GETFund)** | `/api/v1/reports/partner-invoice` | Fix Bug | `commercial_partners` (`name`, `billing_email`, `discount_rate`, `max_users`), `commercial_partner_users` (`user_id`, `status`), `user_subscriptions` (`plan`), `plans` (`amount`) | Fix `totalDue` tax formula in `CommercialPartnerService.cc:3679` |
| `subscription_renewals` — **Subscription Renewals & Churn Funnel** | `/api/v1/reports/subscription-renewals` | Core | `user_subscriptions` (`user_id`, `plan`, `status`, `start_date`, `end_date`, `auto_renew`, `paystack_subscription_code`), `payments` (`subscription_id`, `status`, `paid_at`) | `subscription_lifecycle_events` (`event_type`, `previous_plan`, `new_plan`, `mrr_delta_ghs`, `failure_reason`) |
| `single_copy_paywall_funnel` *(NEW)* — **Single-Copy Newspaper Sales & Paywall Funnel** | `/api/v1/reports/single-copy-funnel` | **Suggested New** | `newspapers` (`id`, `title`, `publication_date`, `price`, `views`, `sales`), `publications` (`name`), `payments` (`amount`, `status`) | `edition_sales_ledger` (`newspaper_id`, `user_id`, `payment_id`, `unit_price`, `purchased_at`) |

### Group 2: Users & Subscriptions (`users`)
| Report ID & Name | Endpoint (`POST`) | Status | Existing `gnp-api` ORM Tables & Columns | Recommended Schema Additions |
|---|---|---|---|---|
| `subscriber_demographics` — **Subscriber Growth & Demographics** | `/api/v1/reports/subscriber-demographics` | Core | `users` (`id`, `created_at`, `country_id`, `gender`, `dob`, `auth_provider`, `email_verified`, `phone_verified`), `countries` (`name`, `iso_code`), `user_reading_history` (`device_info`) | None required for core query; index `users(created_at, country_id)` |
| `plan_distribution` — **Subscription Plan & MRR Distribution** | `/api/v1/reports/plan-distribution` | Core | `plans` (`plan_code`, `name`, `amount`, `interval`), `user_subscriptions` (`plan`, `status`, `auto_renew`, `partner_id`) | `user_subscriptions` (`plan_id`, `billing_amount_snapshot`, `acquisition_source`) |
| `subscriber_retention_cohorts` *(NEW)* — **Subscriber Cohort Retention & LTV Matrix** | `/api/v1/reports/subscriber-cohorts` | **Suggested New** | `users` (`id`, `created_at`), `user_subscriptions` (`user_id`, `start_date`, `end_date`, `status`), `payments` (`user_id`, `amount`, `paid_at`) | `subscription_lifecycle_events`, `daily_platform_kpi_snapshots` |

### Group 3: Content, Newspapers & Originals (`content`)
| Report ID & Name | Endpoint (`POST`) | Status | Existing `gnp-api` ORM Tables & Columns | Recommended Schema Additions |
|---|---|---|---|---|
| `newspaper_engagement` — **Newspaper Edition Readership** | `/api/v1/reports/newspaper-engagement` | Fix Bug | `newspapers` (`id`, `publication_id`, `title`, `publication_date`, `views`, `sales`, `number_of_pages`), `publications` (`name`), `user_reading_history` (`newspaper_id`, `pages_read`, `reading_progress`, `last_read_at`), `bookmarks`, `downloaded_editions` | Make `partnerId` optional in `NewspaperService.cc:1485`; add `edition_sales_ledger` |
| `content_inventory` — **Content Inventory & Search Index Health** | `/api/v1/reports/content-inventory` | Core | `publications` (`id`, `name`), `newspapers` (`id`, `is_published`, `is_archive`, `number_of_pages`), `articles` (`id`, `newspaper_id`, `search_vector`, `embedding`), `pages` (`id`, `ocr_text`), `videos` (`id`) | None required — all 5 tables already exist in `gnp-api` |
| `ingestion_jobs` — **PDF OCR & Ingestion Pipeline Telemetry** | `/api/v1/reports/ingestion-jobs` | Core | `ingestion_jobs` (`id`, `newspaper_id`, `job_type`, `status`, `progress`, `error_message`, `started_at`, `completed_at`, `created_at`), `newspapers` (`title`, `number_of_pages`) | `ingestion_jobs` (`pages_processed`, `articles_extracted`, `ocr_engine`, `worker_node`, `processing_ms`) |
| `multimedia_originals_performance` *(NEW)* — **GNP Originals, Podcasts & Video Analytics** | `/api/v1/reports/originals-multimedia` | **Suggested New** | `videos` (`id`, `title`, `category`, `views`, `duration`, `is_featured`, `published_at`) | `audios` (podcasts & Twi/English audio briefings) + `media_playback_events` |

### Group 4: Digital Archives & AI RAG (`archives` — Suggested New Group)
| Report ID & Name | Endpoint (`POST`) | Status | Existing `gnp-api` ORM Tables & Columns | Recommended Schema Additions |
|---|---|---|---|---|
| `archive_rag_intelligence` *(NEW)* — **Archive Search & AI RAG Intelligence** | `/api/v1/reports/archive-rag-intelligence` | **Suggested New** | `articles` (`id`, `title`, `published_date`, `search_vector`, `embedding`), `newspapers` (`publication_date`, `is_archive`) | `archive_search_and_rag_logs` (`query_text`, `query_mode`, `result_count`, `cited_article_ids`, `latency_ms`, `credits_charged`) |
| `institutional_archive_credits` *(NEW)* — **Institutional Archive Access & Credit Burn** | `/api/v1/reports/institutional-archive-credits` | **Suggested New** | `commercial_partners` (`id`, `name`), `users` (`id`, `email`) | `institutional_archive_accounts` + `archive_credit_transactions` |

### Group 5: Commercial Partners B2B (`partners`)
| Report ID & Name | Endpoint (`POST`) | Status | Existing `gnp-api` ORM Tables & Columns | Recommended Schema Additions |
|---|---|---|---|---|
| `partner_engagement` — **Partner Corporate Readership** | `/api/v1/reports/partner-engagement` | Core | `commercial_partners` (`id`, `name`, `max_users`), `commercial_partner_users` (`partner_id`, `user_id`, `status`), `user_reading_history` (`user_id`, `newspaper_id`, `reading_progress`, `last_read_at`), `publications` (`name`) | Fix `publications.title` -> `publications.name` in `CommercialPartnerService.cc` |
| `partner_quota` — **Partner Seat Quota Utilization** | `/api/v1/reports/partner-quota` | Core | `commercial_partners` (`id`, `name`, `max_users`, `status`, `discount_rate`), `commercial_partner_users` (`partner_id`, `status`, `created_at`) | Optional `contract_renewal_date` on `commercial_partners` |
| `partner_api_usage` — **Partner API v1 Usage & Latency** | `/api/v1/reports/partner-api-usage` | Core | `partner_api_usage_logs` (`partner_id`, `api_key_id`, `endpoint`, `method`, `status_code`, `response_time_ms`, `ip_address`, `created_at`), `commercial_partner_api_keys` (`name`, `key_prefix`) | Composite index `idx_partner_api_logs_partner_created (partner_id, created_at DESC)` |

### Group 6: Marketing, Coupons & Affiliates (`marketing`)
| Report ID & Name | Endpoint (`POST`) | Status | Existing `gnp-api` ORM Tables & Columns | Recommended Schema Additions |
|---|---|---|---|---|
| `campaign_performance` — **Email & Push Campaign Performance** | `/api/v1/reports/campaign-performance` | Core | `email_campaigns` (`id`, `name`, `subject`, `status`, `recipient_filter`, `total_recipients`, `sent_count`, `failed_count`, `sent_at`), `notifications` (`type`, `is_read`, `created_at`) | `campaign_recipient_events` (`campaign_id`, `user_id`, `event_type`, `link_url`, `created_at`) |
| `coupon_usage` — **Promo Code & Discount ROI** | `/api/v1/reports/coupon-usage` | Core | `coupons` (`id`, `code`, `discount_type`, `discount_value`, `max_uses`, `used_count`, `valid_from`, `valid_until`), `coupon_redemptions` (`coupon_id`, `user_id`, `subscription_id`, `discount_applied`, `redeemed_at`), `payments` (`amount`) | None required — join `coupon_redemptions -> user_subscriptions -> payments` |
| `affiliate_performance` *(NEW)* — **Affiliate Attribution & Funnel** | `/api/v1/reports/affiliate-performance` | **Suggested New** | `affiliates` (`id`, `first_name`, `last_name`, `affiliate_code`, `tier_id`, `status`), `affiliate_tiers` (`name`, `commission_rate`), `affiliate_commissions` (`affiliate_id`, `subscription_id`, `amount`, `status`, `created_at`) | `affiliate_referral_clicks` + `user_subscriptions.affiliate_id` |
| `affiliate_payout_reconciliation` *(NEW)* — **Affiliate Payouts & MoMo Settlement** | `/api/v1/reports/affiliate-payouts` | **Suggested New** | `affiliate_payouts` (`id`, `affiliate_id`, `amount`, `payment_method`, `payment_details`, `status`, `reference`, `processed_at`, `created_at`), `affiliate_commissions` (`payout_id`, `amount`, `status`) | None — both `affiliate_payouts` and `affiliate_commissions` already exist in `gnp-api`! |

### Group 7: Newsroom Games & Habit (`games` — Suggested New Group)
| Report ID & Name | Endpoint (`POST`) | Status | Existing `gnp-api` ORM Tables & Columns | Recommended Schema Additions |
|---|---|---|---|---|
| `games_engagement_retention` *(NEW)* — **Newsroom Games Habit & Retention Impact** | `/api/v1/reports/games-engagement` | **Suggested New** | `games` (`id`, `slug`, `name`), `game_puzzles` (`id`, `game_id`, `puzzle_date`, `difficulty`), `game_sessions` (`puzzle_id`, `user_id`, `status`, `score`, `duration_seconds`, `completed_at`), `user_game_stats` (`current_streak`, `max_streak`), `game_leaderboards` | Join `user_game_stats` with `user_subscriptions` to measure streak vs renewal uplift |

### Group 8: Admin, Security & Support (`admin`)
| Report ID & Name | Endpoint (`POST`) | Status | Existing `gnp-api` ORM Tables & Columns | Recommended Schema Additions |
|---|---|---|---|---|
| `admin_roles` — **Admin Access, RBAC & Permission Matrix** | `/api/v1/reports/admin-roles-audit` | Core | `admins` (`id`, `email`, `first_name`, `last_name`, `is_active`, `last_login`, `two_factor_enabled`), `roles` (`id`, `name`), `permissions` (`id`, `name`), `admin_roles`, `role_permissions` | None — all 5 RBAC tables exist in `gnp-api` |
| `api_key_audit` — **Partner API Key Security & Scope Audit** | `/api/v1/reports/partner-api-key-audit` | Core | `commercial_partner_api_keys` (`id`, `partner_id`, `name`, `key_prefix`, `scopes`, `is_active`, `expires_at`, `last_used_at`, `created_at`), `commercial_partners` (`name`) | `commercial_partner_api_keys` (`allowed_ips`, `rate_limit_per_min`, `rotated_from_key_id`, `revoked_at`, `revoked_by_admin_id`) |
| `security_audit_logs` *(NEW)* — **Security Audit & Token Anomaly Log** | `/api/v1/reports/security-audit-logs` | **Suggested New** | `audit_logs` (`id`, `actor_id`, `actor_type`, `action`, `entity_type`, `entity_id`, `details`, `ip_address`, `user_agent`, `created_at`), `refresh_tokens`, `otps` | Composite index `idx_audit_logs_action_created (action, created_at DESC)` |
| `support_tickets_sla` *(NEW)* — **Customer Support Tickets & SLA Resolution** | `/api/v1/reports/support-tickets-sla` | **Suggested New** | `users` (`id`, `email`), `admins` (`id`, `first_name`, `last_name`) | `support_tickets` (`ticket_number`, `category`, `priority`, `status`, `assigned_admin_id`, `first_response_at`, `resolved_at`, `sla_due_at`, `csat_score`) |

---

## 4. Summary of the 13 PostgreSQL Schema Migrations (`docs/sql/gnp_reports_schema_migrations.sql`)

### Part A — Enhancements to Existing `gnp-api` Tables (`ALTER TABLE`)
1. **`public.payments`** — Add `payment_purpose` (`SUBSCRIPTION`, `SINGLE_EDITION`, `ARCHIVE_CREDITS`, `PARTNER_INVOICE`), `newspaper_id`, `partner_id`, `channel` (`mobile_money`, `card`, `bank_transfer`), `mobile_money_network` (`MTN`, `TELECEL`, `AT`), `gateway_fee`, `net_amount`, `failure_code`, `refunded_at`.
2. **`public.user_subscriptions`** — Add `plan_id` FK (`REFERENCES public.plans(id)`), `affiliate_id` FK (`REFERENCES public.affiliates(id)`), `coupon_id` FK (`REFERENCES public.coupons(id)`), `acquisition_source`, `billing_amount_snapshot`, `cancelled_at`, `cancellation_reason`.
3. **`public.ingestion_jobs`** — Add `pages_processed`, `articles_extracted`, `ocr_engine`, `worker_node`, `processing_ms`.
4. **`public.commercial_partner_api_keys`** — Add `allowed_ips JSONB`, `rate_limit_per_min`, `rotated_from_key_id`, `revoked_at`, `revoked_by_admin_id`.

### Part B — 9 New Purpose-Built Analytics & Domain Tables (`CREATE TABLE`)
5. **`public.edition_sales_ledger`** — Immutable per-copy purchase ledger replacing non-historical `newspapers.sales` integer counter.
6. **`public.subscription_lifecycle_events`** — Append-only MRR & renewal waterfall log (`NEW`, `RENEWED`, `RETRY_FAILED`, `RECOVERED`, `UPGRADED`, `CHURNED`).
7. **`public.affiliate_referral_clicks`** — Top-of-funnel referral link click & UTM source log enabling `affiliate_performance` & `/affiliates/stats`.
8. **`public.campaign_recipient_events`** — Granular `DELIVERED` / `OPENED` / `CLICKED` / `BOUNCED` / `CONVERTED` telemetry for `email_campaigns`.
9. **`public.archive_search_and_rag_logs`** — Logs every keyword & AI RAG archive query, top cosine similarity score, cited article IDs, latency, and zero-hit content gaps.
10. **`public.institutional_archive_accounts` & `public.archive_credit_transactions`** — Backs `/admin/archives/institutions` and `/admin/archives/access-credits` for universities, courts, embassies, and banks.
11. **`public.audios` & `public.media_playback_events`** — Podcast/audio briefing catalog + quartile completion tracking (`25%`, `50%`, `75%`, `100%`) across videos & podcasts.
12. **`public.support_tickets`** — Full helpdesk & SLA persistence backing `/admin/support-tickets` and the `support_tickets_sla` report.
13. **`public.daily_platform_kpi_snapshots`** — Pre-aggregated daily fact table keeping 12-month `/admin/dashboard` and executive time-series queries under `< 5ms`.
