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

`ArchivePageRecommendations` appears below the archive reader/paywall when validation supplied metadata:

- **Keep reading** is populated by `getRelatedArchivedContent` (`services/newsPapers.ts`, POST `news-papers/get-related-archived-content`). The request body, built by `buildRelatedArchivePayload`, is `{ id, publicationDate }`: the archive/page ID from the route and the publication date from the access-validation metadata. `result` is a plain array of `{ fileType, newspaperId, pageNumber, publicationDate, publicationName, tags, thumbnailId }`. The records carry **no `id`**, so each card links to `/archives/<newspaperId>` (an `id` is preferred if the API ever sends one). `newspaperId` is unique per archive page, not per edition, so "same edition" means same publication name and date. `keepReadingPages` drops the page being read (route ID or the current document's `newspaperId`) and duplicates, lists pages of the current edition first in numeric page order, and keeps the API order for anything else (those cards also show their publication and date, and the heading changes from "More pages from this edition" to "More pages from the archives"). The horizontally scrollable, keyboard-focusable strip uses uncropped thumbnails, page labels and safe `/archives/:id` links. `thumbnailId` is an absolute image URL; broken images show the fallback tile. Loading (skeleton), empty and error-with-retry states do not block the current reader; a 401/403 shows a sign-in hint instead of a retry.
- **Related High-Ranking Results** preserves the original archive search keyword and ranks cached search hits by the API's `relevance` value. If fewer than three candidates are available (including direct entry with no search state), it requests fresh most-relevant results using the original keyword, first metadata tag or publication name. Results exclude the current page and duplicates. A lack of matching results is shown explicitly; no ranking scores or thumbnail data are fabricated.
- These requests have separate local state; neither mutates the main Archives search filters/results. Late responses after a document change/unmount are ignored. Thumbnail cards provide navigation only; full access is still checked on each destination page.

Recommendation helpers and UI wiring are covered by `tests/archiveRecommendations.test.mjs`. Vue compilation has been checked for both the archive page and recommendations component; opening `/archives/<newspaperId>` from a Keep reading card still requires verification against the upstream backend.
