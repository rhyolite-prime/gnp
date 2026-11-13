import type {
  ArchiveAccessMetadata,
  ArchiveAccessResponse,
  ArchiveFileType,
  ArchiveSearchItem,
} from '~/models';

/**
 * Everything the archive detail page needs to know after calling
 * `subscription/validate-archive-access/{id}`.
 *
 * The API answers with `{ success, message, result: { metadata } }`; this state
 * flattens the parts the page branches on so the template never has to guard
 * against a missing envelope or a null `result`.
 */
export interface ArchiveAccessState {
  /** False when the request itself failed (401, network); not the same as no access. */
  success: boolean;
  /** API message, e.g. `Archive access granted`. */
  message: string;
  /** Document metadata; null when the API returned none. */
  metadata: ArchiveAccessMetadata | null;
  /** The single paywall flag. Anything other than a literal `true` is no access. */
  hasAccess: boolean;
}

/** State shown before the request resolves or when it must not be attempted. */
function emptyState(message: string): ArchiveAccessState {
  return { success: false, message, metadata: null, hasAccess: false };
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toTagList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => text(tag)).filter(Boolean);
  }
  // A single string is tolerated (some backends flatten one-element tag lists).
  const single = text(value);
  return single ? [single] : [];
}

/**
 * Validates the `result.metadata` payload. Returns null when the API sent
 * nothing usable so the page can fall back instead of rendering `undefined`.
 *
 * `newspaperId` / `publicationName` are the only fields we insist on: without
 * them the page has no document to describe.
 */
export function normalizeArchiveMetadata(raw: unknown): ArchiveAccessMetadata | null {
  if (!raw || typeof raw !== 'object') return null;

  const source = raw as Record<string, unknown>;
  const newspaperId = text(source.newspaperId);
  const publicationName = text(source.publicationName);

  if (!newspaperId && !publicationName) return null;

  return {
    fileType: text(source.fileType).toUpperCase() || 'PDF',
    hasAccess: source.hasAccess === true,
    newspaperId,
    publicationDate: text(source.publicationDate),
    publicationName,
    tags: toTagList(source.tags),
  };
}

/** Maps the API envelope onto the page state. Never throws. */
export function toArchiveAccessState(response: unknown): ArchiveAccessState {
  if (!response || typeof response !== 'object') {
    return emptyState('We could not verify your access to this document.');
  }

  const envelope = response as Partial<ArchiveAccessResponse>;
  const result = envelope.result as { metadata?: unknown } | null | undefined;
  const metadata = normalizeArchiveMetadata(result?.metadata);

  // Access is granted only when the flag is literally true; a missing result,
  // a failed envelope or a null metadata block all land on the paywall.
  const hasAccess = envelope.success !== false && metadata?.hasAccess === true;

  return {
    success: envelope.success !== false,
    message: text(envelope.message),
    metadata,
    hasAccess,
  };
}

/** Human label for `metadata.fileType` — `IMAGE` → `Image`, `PDF` → `PDF`. */
export function formatArchiveFileType(fileType: ArchiveFileType | null | undefined): string {
  const value = text(fileType);
  if (!value) return 'Document';
  if (value.toUpperCase() === 'PDF') return 'PDF';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/** True when the document should be rendered with the page-by-page PDF reader. */
export function isPdfArchive(fileType: ArchiveFileType | null | undefined): boolean {
  const value = text(fileType).toUpperCase();
  // Unknown formats are treated as PDF: the reader surfaces a clean failure,
  // whereas an <img> tag would silently fail for a PDF asset.
  return value === 'PDF' || value === '';
}

/**
 * URL of the archive document, streamed through the existing server-side proxy.
 *
 * `/api/pdf` validates the reader's grant with the subscription service before
 * fetching the asset from storage, so the raw storage URL (and the token) never
 * reach the page markup directly.
 */
export function buildArchiveDocumentUrl(
  newspaperId: string | null | undefined,
  accessToken: string | null | undefined,
): string {
  const id = text(newspaperId);
  if (!id) return '';

  const token = text(accessToken);
  const query = `uniqueId=${encodeURIComponent(id)}`;
  return `/api/pdf?${query}&accessToken=${encodeURIComponent(token)}`;
}

/** `1950-12-18` → `18 December 1950` (kept UTC so the day never shifts). */
export function formatArchivePublicationDate(value: string | null | undefined): string {
  const raw = text(value);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return raw;

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * "You may also like" strip: other archive pages from the same search result
 * set, never the document being viewed, capped for the grid.
 */
export function pickRelatedArchives(
  items: readonly ArchiveSearchItem[] | null | undefined,
  currentId: string | null | undefined,
  limit = 3,
): ArchiveSearchItem[] {
  const exclude = text(currentId);
  const seen = new Set<string>();

  return (items ?? [])
    .filter((item) => {
      const id = text(item?.id);
      if (!id || id === exclude || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .slice(0, Math.max(0, limit));
}
