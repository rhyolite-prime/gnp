# Discover / For you

`/discover` is a vertically scrolling, snap-style mixed-content feed. It currently defaults to explicitly labelled sample content; `/discover?source=live` selects the real API catalogue. The in-page source link switches between them without silently falling back to mocks. The homepage's **Your next great read. One swipe away.** teaser, desktop/mobile header, and footer link to it. The desktop Discover link replaces Interests to avoid adding another item to an already crowded header; interests remain accessible from the feed, mobile navigation, and footer.

## Content and personalisation

- Fetches public archive search previews, newspaper editions, video catalogue entries, and top stories through existing services. This covers the available catalogues exposed by those APIs, not a newly invented all-content backend.
- Reads the existing `gnp-content-interests-v1` browser preference. Anonymous visitors receive the general mix. Entering the page or switching data sources reloads the stored interests. There are no manual shuffle buttons; newly loaded content is still mixed automatically.
- Each load fetches unfinished general sources plus at most two category searches, rotating through selected interests. This adds more matching content without excluding general exploration or issuing 21 interest requests at once.
- Keyword/title/tag matches and dedicated interest-search results receive a visible **For you** badge. Matching uses the existing category query terms; it is not ML ranking or verified editorial category classification.
- Each new batch is Fisher–Yates shuffled within the interest/general pools and interleaved at up to two interest matches to one general discovery while both pools have entries. Every remaining unique result is kept. Loaded cards do not reorder during the current browsing session.
- Stable, type-prefixed IDs deduplicate overlapping category searches and previous pages without conflating an archived page with its newspaper edition.

## Reading and video

Cards are previews. Newspaper and archive links use the existing `/newspapers/:id` and `/archives/:id` readers and their subscription/entitlement checks. No paid access is granted by following an interest or entering Discover. Inline full-story text is available only for stories explicitly marked public (`attributes.access === 1`); other stories link to plans.

Videos can open their existing detail page. Validated YouTube videos also offer click-to-play embeds using the existing allowlisted embed helper. Nothing autoplays before a click, only the active card can play, and scrolling away or opening a story dialog removes the embed. Story bodies are displayed as text, never injected HTML. Remote image URLs are restricted to HTTP(S) or same-origin paths, with artwork/solid-colour fallbacks.

## Pagination, retries, and end state

An IntersectionObserver rooted in the feed loads more as the reader approaches the end. Load more / Retry controls work without observer support. Each source has its own page cursor and exhaustion state. Successful sources advance independently; failed sources keep their cursor for retry, with partial results retained and a visible error message. Auto-loading pauses on errors to avoid retry loops. Concurrent loads are suppressed, and a generation token ignores stale requests after a data-source change or unmount.

The sample feed serves 84 unique records in seven 12-card batches with no live API requests. The live feed uses the source pagination above.

The feed is endless-style, not an artificial infinite loop: when all available sources are exhausted, it shows a caught-up state and offers links to interests and newspapers. Previously seen items are not recycled automatically. The browser renders offscreen cards with `content-visibility: auto`; this is not a windowed/virtualised list, so metadata/DOM still accumulate during very long sessions.

## Interaction and accessibility

- Touch/wheel scrolling, previous/next buttons, and Arrow Up/Down or Page Up/Down when the feed is focused.
- Interactive controls keep their native keyboard behaviour.
- Reduced-motion mode disables snap/smooth scrolling; no timed advancement is used.
- Appended results do not move keyboard focus. Cards expose feed position metadata, and loading/error states are announced.
- Headless UI contains/restores focus and locks background scrolling for the public-story dialog.

## Validation

`node --test tests/*.test.mjs` includes deterministic tests for weighted shuffling, stable-ID deduplication, source pagination, partial failure/retry, stale-request cancellation, concurrent-load guards, URL safety, keyword matching, and reader routes. `npm run build` also passes. Real catalogue integration, remote images/video playback, touch behaviour and subscription entitlements require browser/integration verification against the content backend; no synthetic content was substituted for unavailable upstream data.


## Sample content and backend modelling

`mocks/discover.ts` exports **84 fictional records**: all 21 interests, with a story, video outline, newspaper preview and archive preview for each. Each has a unique ID, content type, category ID, title, summary, body, publication ID, publication timestamp, access tier, local thumbnail and `isMock: true`. Fixtures are not real news, job offers, tenders, exchange-rate quotations or promotions. Every sample card is labelled, opens its own sample preview, and offers **Inspect sample backend record** with the actual JSON. No fixture links to a nonexistent reader record, pretends to play a video, or grants paid access.

A backend implementation can use:

- `content_items(id, content_type, title, summary, body_or_document_id, publication_id, published_at, expires_at, access_tier, thumbnail_url, status)` for the underlying record. Only publish verified records; notices/offers should have expiry dates.
- `content_categories(content_id, category_id)` for multi-category content rather than hard-coding a single category column as the fixtures do for simplicity.
- `reader_interests(reader_id, category_id)` and separately `notification_preferences(reader_id_or_device_id, category_id, enabled)` to keep reading interests and push consent independent.
- A feed response with `items`, an opaque `nextCursor`, `hasMore` and a ranking reason per item. Return canonical reader IDs/URLs and access metadata rather than full subscriber-only bodies. Pagination should use a stable feed/session cursor to prevent repeats during reshuffling.

The current UI maps the fixtures into the existing `DiscoverItem` view model; this is a prototype contract, not a database migration or an implemented backend endpoint.

## Mobile layout

The page fills the dynamic viewport beneath the existing responsive app header, with a compact title/source toolbar, edge-to-edge cards, safe-area padding and a flexible scroll region (no old 420px minimum height). Mobile uses snap-to-card scrolling, full-width readable copy, and at least 44px action targets; desktop retains arrow controls and roomier typography. Short screens simplify excerpts, while copy remains scrollable for larger text sizes. A resize observer keeps the active-card index aligned as browser chrome/orientation changes. The default layout suppresses the footer, PWA install button and floating research launcher on Discover only, so they cannot cover the feed actions. Other pages are unchanged.
