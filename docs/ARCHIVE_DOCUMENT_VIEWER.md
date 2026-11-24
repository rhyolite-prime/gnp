# Archive document viewer and authenticated proxy

`/archives/:id` validates `subscription/validate-archive-access/:id` and renders `ArchiveDocumentViewer` only when the response grants access. PDF metadata selects the existing `NewspaperReader` (PDF.js). IMAGE/JPG/JPEG and other recognised image labels select the scan viewer, with fit, zoom, scrolling and mouse drag-to-pan controls. The open-in-new-tab control is available only for PDFs. Unsupported formats display an explicit error rather than attempting to decode them as PDFs.

## Authentication fix

The page captures the runtime API base, identity cookie and auth store during setup. Each async-data request receives the current token explicitly through `validateArchiveAccess(id, { accessToken, apiBase })`, instead of calling an auth composable from inside an asynchronous handler and reading a stale `gnpUserAuth` useState snapshot. The explicit service branch forwards `Authorization: Bearer <token>` with `$fetch`.

Access validation is client-side (`server: false`), watches token changes, uses no cached access payload, clears grants immediately on document/session changes, and ignores results whose document or token no longer matches. Manual refreshes after sign-in/purchase still work. Guests/denied requests retain the existing paywall behaviour. Other service callers can still use the backward-compatible implicit-auth branch.

## File flow

1. Build `/api/archive-file?archiveId=<archive/page ID>&fileType=IMAGE|PDF` using the file type from validation metadata. Do not substitute the parent `newspaperId` for the archive/page ID.
2. The viewer requests a Blob from this same-origin URL, forwarding the current bearer header (with same-origin cookies as fallback). Tokens are not placed in URLs.
3. `server/api/archive-file.get.ts` revalidates the same archive ID using that bearer token. Missing authentication returns 401; denied access returns 403. The browser's file-type hint never grants access or overrides the validated type.
4. The proxy's `fetchAsset` follows the newspaper proxy approach but fetches **`g3/get-archived-file/gnp-master-documents/{archiveId}.jpg`** for image metadata, or **`.../{archiveId}.pdf`** for PDF metadata, relative to the existing API base. Image labels map to the archive storage contract's canonical `.jpg` suffix, not `.image`.
5. Return inline JPEG or PDF bytes with `private, no-store`, `Vary: Cookie, Authorization`, and `nosniff`. There is no shared protected-file cache. Validation/storage 401, 403 and 404 statuses are preserved; network failures return 502. A stale type hint returns 409.
6. The client creates a local Blob URL for PDF.js/image rendering and the PDF-only open-in-new-tab link. It aborts old requests and revokes object URLs on token/document changes or unmount. Loading, unsupported-type and fetch-error states have explicit messages and retry controls.

The newspaper `/api/pdf` implementation and `/newspapers/:id/open` flow remain unchanged. No changes to backend access rules or subscription purchases are required. The upstream archived-file endpoint must enforce the same authenticated storage contract.

## Validation

Run `node --test tests/*.test.mjs`. Regression tests cover JPEG/PDF suffixes, secret-free URLs, explicit fresh-token forwarding, cookie/header proxy authentication, canonical archive asset paths, denied/expired sessions, type-hint mismatch, unsupported types and missing assets. A production build passes. Actual storage assets, sign-in/purchase transitions and PDF/image rendering still need integration testing against the upstream backend.


## Image mouse interaction

When zoom is above Fit (100%), the image viewport shows a grab cursor. Hold the primary mouse button and drag in either direction to pan; pointer capture keeps the drag working when the cursor leaves the viewport. Release, cancellation, lost capture, changing zoom, replacing the document, and unmount all stop dragging. Image boundaries clamp scroll offsets. Native image dragging is disabled. Touch scrolling and keyboard scrolling remain available, and mouse panning is disabled at Fit. Image viewers no longer offer an open-in-new-tab button; PDF controls are unchanged.

## Edition navigation and related results

### Page list beside the reader (`ArchiveEditionPages`)

On `/archives/:id` the reader sits in a two-column row: `components/archives/ArchiveEditionPages.vue` on the left, the image/PDF viewer (or the paywall) on the right. It replaces the "Keep reading" strip that used to sit below the reader.

- **Data.** The list comes from `getRelatedArchivedContent` (`services/newsPapers.ts`, POST `news-papers/get-related-archived-content`). The request body, built by `buildRelatedArchivePayload`, is `{ id, publicationDate }`: the archive/page ID from the route and the publication date from the access-validation metadata. `result` is a plain array of `{ fileType, newspaperId, pageNumber, publicationDate, publicationName, tags, thumbnailId }`. The records carry **no `id`**, so each thumbnail links to `/archives/<newspaperId>` (an `id` is preferred if the API ever sends one). `newspaperId` is unique per archive page, not per edition, so "same edition" means same publication name and date. `thumbnailId` is an absolute image URL; broken images show a fallback tile.
- **Order.** `keepReadingPages` drops the page being read and duplicates, lists pages of the current edition first in numeric page order, and keeps the API order for anything else (those tiles also show their publication and date, and the heading changes from "Pages in this edition" to "Related archive pages"). `editionPages` then puts the page being read back into the list at its place, so the list is a complete table of contents with the open page marked (`aria-current="page"`, red outline, "Reading" badge).
- **The page being read.** The API does not return the page it was asked about. When that page was reached from the list or from a search result, its record is already in memory. On a direct visit it is not, so the pane makes **one extra call** with a sibling's ID and takes the open page's thumbnail and number from that response. If that call fails or does not contain the page, the open page is still listed, labelled "This page" with the fallback tile, at the top of the list.
- **Layout.** From the `lg` breakpoint the pane is a 176 px column exactly as tall as the reader, with its own vertical scrollbar. Below `lg` it is a horizontally scrollable strip above the reader. Only the list is ever scrolled to keep the open page visible (`scrollBy` on the list element, never `scrollIntoView`), so the window does not move.
- **Opening a page.** Thumbnails are ordinary `NuxtLink`s, so they have real URLs, work with the keyboard, new tabs and the browser's back/forward buttons. `definePageMeta({ key: 'archive-detail', scrollToTop: (to, from) => to.name !== from.name })` keeps one page instance for every archive ID and stops the router from scrolling to the top, so a click swaps the document in the main area and leaves the window and the list where they were. While the next page is being validated the header card keeps the previous page's details and the viewer area shows an "Opening page…" placeholder of the same size (for readers without access the paywall stays, dimmed). Access is still validated for every page; the viewer and the paywall only ever act on the new page's own validation result.
- **States.** Skeleton while loading. A failed request shows "We could not load the other pages." with a retry button and does not affect the reader. A 401/403 hides the pane (the paywall already explains). If the API returns no other pages the pane is not rendered and the reader uses the full width. Responses that arrive after the reader has moved to another page are ignored.

### Related results below the reader (`ArchivePageRecommendations`)

- **Related High-Ranking Results** preserves the original archive search keyword and ranks cached search hits by the API's `relevance` value. If fewer than three candidates are available (including direct entry with no search state), it requests fresh most-relevant results using the original keyword, first metadata tag or publication name. Results exclude the current page and duplicates. A lack of matching results is shown explicitly; no ranking scores or thumbnail data are fabricated.
- Opening one of these results scrolls the window back to the top, because the reader is above the fold from there.
- The pane and this section have separate local state; neither mutates the main Archives search filters/results.

### Verification

Helpers and UI wiring are covered by `tests/archiveRecommendations.test.mjs`. The pane was exercised in a browser against a local mock of the API (image and PDF documents, desktop and mobile widths, signed-in and guest, error states). Still to be confirmed against the upstream backend:

- that `/archives/<newspaperId>` opens the page a thumbnail points to (the related-content records have no `id` of their own);
- that the related-content endpoint accepts a sibling's ID with the same `publicationDate` and returns the page being read, which is what the extra call on a direct visit relies on.
