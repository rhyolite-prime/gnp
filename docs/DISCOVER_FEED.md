# Discover / For you

`/discover` is a vertically scrolling, snap-style mixed-content feed. The homepage's **Your next great read. One swipe away.** teaser, desktop/mobile header, and footer link to it. The desktop Discover link replaces Interests to avoid adding another item to an already crowded header; interests remain accessible from the feed, mobile navigation, and footer.

## Content and personalisation

- Fetches public archive search previews, newspaper editions, video catalogue entries, and top stories through existing services. This covers the available catalogues exposed by those APIs, not a newly invented all-content backend.
- Reads the existing `gnp-content-interests-v1` browser preference. Anonymous visitors receive the general mix. Shuffle again reloads the stored interests and starts a new browsing session.
- Each load fetches unfinished general sources plus at most two category searches, rotating through selected interests. This adds more matching content without excluding general exploration or issuing 21 interest requests at once.
- Keyword/title/tag matches and dedicated interest-search results receive a visible **For you** badge. Matching uses the existing category query terms; it is not ML ranking or verified editorial category classification.
- Each new batch is Fisher–Yates shuffled within the interest/general pools and interleaved at up to two interest matches to one general discovery while both pools have entries. Every remaining unique result is kept. Loaded cards do not reorder until the reader explicitly shuffles again.
- Stable, type-prefixed IDs deduplicate overlapping category searches and previous pages without conflating an archived page with its newspaper edition.

## Reading and video

Cards are previews. Newspaper and archive links use the existing `/newspapers/:id` and `/archives/:id` readers and their subscription/entitlement checks. No paid access is granted by following an interest or entering Discover. Inline full-story text is available only for stories explicitly marked public (`attributes.access === 1`); other stories link to plans.

Videos can open their existing detail page. Validated YouTube videos also offer click-to-play embeds using the existing allowlisted embed helper. Nothing autoplays before a click, only the active card can play, and scrolling away or opening a story dialog removes the embed. Story bodies are displayed as text, never injected HTML. Remote image URLs are restricted to HTTP(S) or same-origin paths, with artwork/solid-colour fallbacks.

## Pagination, retries, and end state

An IntersectionObserver rooted in the feed loads more as the reader approaches the end. Load more / Retry controls work without observer support. Each source has its own page cursor and exhaustion state. Successful sources advance independently; failed sources keep their cursor for retry, with partial results retained and a visible error message. Auto-loading pauses on errors to avoid retry loops. Concurrent loads are suppressed, and a generation token ignores stale requests after a shuffle or unmount.

The feed is endless-style, not an artificial infinite loop: when all available sources are exhausted, it shows a caught-up state and offers a new shuffle. Previously seen items are not recycled automatically. The browser renders offscreen cards with `content-visibility: auto`; this is not a windowed/virtualised list, so metadata/DOM still accumulate during very long sessions.

## Interaction and accessibility

- Touch/wheel scrolling, previous/next buttons, and Arrow Up/Down or Page Up/Down when the feed is focused.
- Interactive controls keep their native keyboard behaviour.
- Reduced-motion mode disables snap/smooth scrolling; no timed advancement is used.
- Appended results do not move keyboard focus. Cards expose feed position metadata, and loading/error states are announced.
- Headless UI contains/restores focus and locks background scrolling for the public-story dialog.

## Validation

`node --test tests/*.test.mjs` includes deterministic tests for weighted shuffling, stable-ID deduplication, source pagination, partial failure/retry, stale-request cancellation, concurrent-load guards, URL safety, keyword matching, and reader routes. `npm run build` also passes. Real catalogue integration, remote images/video playback, touch behaviour and subscription entitlements require browser/integration verification against the content backend; no synthetic content was substituted for unavailable upstream data.
