-- =============================================================================
-- Graphic NewsPlus (GNP) — Reporting & Analytics PostgreSQL Schema Migrations
-- Target Backend Repository: https://github.com/rhyolite-prime/gnp-api
-- Generated for Drogon ORM (`drogon_ctl create model ./models`) compatibility
-- Safe & idempotent: uses IF NOT EXISTS throughout
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- -----------------------------------------------------------------------------
-- 1. [P0 - Critical] Enrich `payments` with Stream Attribution, Channel, FKs & Net Settlement
-- Domain: Revenue & Financial | Impacts: sales_revenue, payment_transactions, plan_distribution, single_copy_paywall_funnel, coupon_usage, affiliate_performance
-- -----------------------------------------------------------------------------
ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS payment_type VARCHAR(40) NOT NULL DEFAULT 'subscription_new',
    ADD COLUMN IF NOT EXISTS payment_channel VARCHAR(40),
    ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50),
    ADD COLUMN IF NOT EXISTS currency VARCHAR(10) NOT NULL DEFAULT 'GHS',
    ADD COLUMN IF NOT EXISTS gross_amount NUMERIC(12,2),
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS gateway_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS net_amount NUMERIC(12,2),
    ADD COLUMN IF NOT EXISTS subscription_plan_id UUID REFERENCES public.subscription_plans(id),
    ADD COLUMN IF NOT EXISTS newspaper_id UUID REFERENCES public.newspapers(id),
    ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES public.commercial_partners(id),
    ADD COLUMN IF NOT EXISTS affiliate_id UUID REFERENCES public.affiliates(id),
    ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES public.coupons(id);

CREATE INDEX IF NOT EXISTS idx_payments_created_status_type
    ON public.payments (created_at DESC, status, payment_type);

-- -----------------------------------------------------------------------------
-- 2. [P0 - Critical] Add Churn Reason, Auto-Renew & Recurring Fee Columns to `user_subscriptions`
-- Domain: Revenue & Subscriber Retention | Impacts: subscription_renewals, plan_distribution, subscriber_retention_cohorts
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_subscriptions
    ADD COLUMN IF NOT EXISTS plan_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS acquisition_source VARCHAR(40) DEFAULT 'organic',
    ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cancellation_type VARCHAR(30),
    ADD COLUMN IF NOT EXISTS churn_reason VARCHAR(120);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active_end
    ON public.user_subscriptions (is_active, end_date, subscription_plan_id);

-- -----------------------------------------------------------------------------
-- 3. [P0 - Critical] Create `subscription_lifecycle_events` for Exact MRR Waterfall & Cohort Survival
-- Domain: Revenue & Subscriber Retention | Impacts: subscription_renewals, subscriber_retention_cohorts, sales_revenue
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_lifecycle_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES public.commercial_partners(id) ON DELETE SET NULL,
    from_plan_id UUID REFERENCES public.subscription_plans(id),
    to_plan_id UUID REFERENCES public.subscription_plans(id),
    event_type VARCHAR(40) NOT NULL,
    mrr_delta NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment_id UUID REFERENCES public.payments(id),
    reason_code VARCHAR(100),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_lifecycle_occurred_type
    ON public.subscription_lifecycle_events (occurred_at DESC, event_type);

-- -----------------------------------------------------------------------------
-- 4. [P0 - Critical] Create `edition_sales_ledger` for Timestamped Single-Copy & Back-Issue Sales
-- Domain: Content & Newspaper Sales | Impacts: newspaper_engagement, sales_revenue, single_copy_paywall_funnel
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.edition_sales_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    newspaper_id UUID NOT NULL REFERENCES public.newspapers(id) ON DELETE RESTRICT,
    publication_id UUID NOT NULL REFERENCES public.publications(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    buyer_email VARCHAR(255),
    is_guest_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    discount_applied NUMERIC(10,2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(10,2) NOT NULL,
    sold_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edition_sales_sold_at_pub
    ON public.edition_sales_ledger (sold_at DESC, publication_id, newspaper_id);

-- -----------------------------------------------------------------------------
-- 5. [P1 - High] Add Publication, Page Count, OCR Timing & Error Details to `ingestion_jobs`
-- Domain: Content Operations | Impacts: ingestion_jobs, content_inventory, archive_rag_intelligence
-- -----------------------------------------------------------------------------
ALTER TABLE public.ingestion_jobs
    ADD COLUMN IF NOT EXISTS publication_id UUID REFERENCES public.publications(id),
    ADD COLUMN IF NOT EXISTS newspaper_id UUID REFERENCES public.newspapers(id),
    ADD COLUMN IF NOT EXISTS total_pages INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ocr_pages_completed INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS rag_chunks_queued INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
    ADD COLUMN IF NOT EXISTS processing_duration_ms INTEGER,
    ADD COLUMN IF NOT EXISTS error_message TEXT;

-- -----------------------------------------------------------------------------
-- 6. [P0 - Critical] Add Expiry, Revocation Audit & Rate Limits to `commercial_partner_api_keys`
-- Domain: Commercial Partner & Security | Impacts: api_key_audit, partner_api_usage
-- -----------------------------------------------------------------------------
ALTER TABLE public.commercial_partner_api_keys
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS revoked_by UUID REFERENCES public.users(id),
    ADD COLUMN IF NOT EXISTS rate_limit_per_minute INTEGER NOT NULL DEFAULT 120,
    ADD COLUMN IF NOT EXISTS environment VARCHAR(20) NOT NULL DEFAULT 'production';

-- -----------------------------------------------------------------------------
-- 7. [P0 - Critical] Create `affiliate_referral_clicks` for Affiliate Traffic, Funnel & EPC Analytics
-- Domain: Marketing & Affiliates | Impacts: affiliate_performance, affiliate_payout_reconciliation
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.affiliate_referral_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
    referral_code VARCHAR(30) NOT NULL,
    visitor_hash CHAR(64) NOT NULL,
    landing_path VARCHAR(350),
    traffic_source VARCHAR(50) NOT NULL DEFAULT 'direct',
    device_type VARCHAR(20) NOT NULL DEFAULT 'mobile',
    country_code CHAR(2),
    converted BOOLEAN NOT NULL DEFAULT FALSE,
    commission_id UUID REFERENCES public.affiliate_commissions(id) ON DELETE SET NULL,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_aff_time
    ON public.affiliate_referral_clicks (affiliate_id, clicked_at DESC);

-- -----------------------------------------------------------------------------
-- 8. [P1 - High] Create `campaign_recipient_events` for Omnichannel Funnel & Revenue Attribution
-- Domain: Marketing & Campaigns | Impacts: campaign_performance
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_recipient_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    channel VARCHAR(30) NOT NULL,
    event_type VARCHAR(30) NOT NULL,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    attributed_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_events_camp_time
    ON public.campaign_recipient_events (campaign_id, occurred_at DESC, event_type);

-- -----------------------------------------------------------------------------
-- 9. [P1 - High] Create `archive_search_and_rag_logs` for Archive FTS, AI Citations & Zero-Result Tracking
-- Domain: Archives & AI Research (RAG) | Impacts: archive_rag_intelligence, institutional_archive_credits
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.archive_search_and_rag_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    institution_id UUID,
    query_mode VARCHAR(30) NOT NULL,
    query_text TEXT NOT NULL,
    target_decade SMALLINT,
    publication_id UUID REFERENCES public.publications(id),
    results_count INTEGER NOT NULL DEFAULT 0,
    citations_returned SMALLINT NOT NULL DEFAULT 0,
    cited_detail_ids UUID[],
    latency_ms INTEGER NOT NULL DEFAULT 0,
    credits_consumed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_archive_rag_logs_created_mode
    ON public.archive_search_and_rag_logs (created_at DESC, query_mode);

-- -----------------------------------------------------------------------------
-- 10. [P1 - High] Create Institutional Archive Accounts & Access Credit Ledger Tables
-- Domain: Archives & AI Research (RAG) | Impacts: institutional_archive_credits, archive_rag_intelligence, sales_revenue
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institutional_archive_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name VARCHAR(255) NOT NULL,
    sector VARCHAR(60) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    ip_ranges INET[],
    seat_limit INTEGER NOT NULL DEFAULT 25,
    credits_allocated INTEGER NOT NULL DEFAULT 1000,
    credits_remaining INTEGER NOT NULL DEFAULT 1000,
    contract_value_ghs NUMERIC(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.archive_credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutional_archive_accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    tx_type VARCHAR(30) NOT NULL, -- topup | rag_query_debit | pdf_dossier_debit | adjustment
    credits_delta INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reference_note VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. [P1 - High] Create `audios` Catalog & `media_playback_events` Telemetry for GN+ Originals
-- Domain: Content, Editions & Originals | Impacts: multimedia_originals_performance
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    series_name VARCHAR(255),
    description TEXT,
    file_path VARCHAR(1000) NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    status INTEGER NOT NULL DEFAULT 1,
    plays INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media_playback_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_type VARCHAR(20) NOT NULL,
    media_id UUID NOT NULL,
    originals_category VARCHAR(40) NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    watch_seconds INTEGER NOT NULL DEFAULT 0,
    completion_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
    device_type VARCHAR(20) NOT NULL DEFAULT 'mobile',
    played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_playback_played_cat
    ON public.media_playback_events (played_at DESC, originals_category, media_type);

-- -----------------------------------------------------------------------------
-- 12. [P1 - High] Create `support_tickets` & `support_ticket_messages` for Support Operations & SLA Reporting
-- Domain: Admin, Security & Support Audits | Impacts: support_tickets_sla
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES public.commercial_partners(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'billing_paystack',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    assigned_admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    first_response_at TIMESTAMPTZ,
    sla_due_at TIMESTAMPTZ NOT NULL,
    resolved_at TIMESTAMPTZ,
    csat_rating SMALLINT CHECK (csat_rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status_priority
    ON public.support_tickets (status, priority, created_at DESC);

-- -----------------------------------------------------------------------------
-- 13. [P2 - Performance] Create `daily_platform_kpi_snapshots` Populated Nightly by Quartz Scheduler
-- Domain: Executive Rollup & Performance | Impacts: sales_revenue, subscription_renewals, subscriber_demographics, newspaper_engagement, partner_api_usage
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_platform_kpi_snapshots (
    snapshot_date DATE PRIMARY KEY,
    gross_revenue_ghs NUMERIC(14,2) NOT NULL DEFAULT 0,
    net_revenue_ghs NUMERIC(14,2) NOT NULL DEFAULT 0,
    mrr_ghs NUMERIC(14,2) NOT NULL DEFAULT 0,
    active_b2c_subscribers INTEGER NOT NULL DEFAULT 0,
    active_b2b_partner_seats INTEGER NOT NULL DEFAULT 0,
    new_signups INTEGER NOT NULL DEFAULT 0,
    churned_subscriptions INTEGER NOT NULL DEFAULT 0,
    edition_views INTEGER NOT NULL DEFAULT 0,
    single_copies_sold INTEGER NOT NULL DEFAULT 0,
    archive_rag_queries INTEGER NOT NULL DEFAULT 0,
    game_sessions_completed INTEGER NOT NULL DEFAULT 0,
    partner_api_requests INTEGER NOT NULL DEFAULT 0,
    breakdown_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
