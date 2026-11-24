import type { ArchiveSearchRequest, ArchiveSearchResponse, ArchiveSearchResult, ArchiveSortOrder } from "~/models";

export const ARCHIVE_PAGE_SIZE = 12;

/**
 * Builds the POST body for news-papers/search-archives.
 * Empty strings are sent for unset text/date filters; `publicationYear` is only
 * included when a year was chosen from the "Browse Collections" tab, and `sortOrder`
 * only for a date sort (null = Most Relevant, backend default).
 */
export function buildArchiveSearchRequest(params: {
    pageNo: number;
    pageSize?: number;
    query?: string | null;
    dateFrom?: string | null;
    dateTo?: string | null;
    publicationDate?: string | null;
    publicationYear?: number | null;
    sortOrder?: ArchiveSortOrder | null;
}): ArchiveSearchRequest {
    const request: ArchiveSearchRequest = {
        pageNo: params.pageNo,
        pageSize: params.pageSize ?? ARCHIVE_PAGE_SIZE,
        query: (params.query ?? "").trim(),
        dateFrom: params.dateFrom ?? "",
        dateTo: params.dateTo ?? "",
        publicationDate: params.publicationDate ?? "",
    };

    if (params.publicationYear != null) {
        request.publicationYear = params.publicationYear;
    }

    if (params.sortOrder) {
        request.sortOrder = params.sortOrder;
    }

    return request;
}

export async function searchArchives(payload: ArchiveSearchRequest): Promise<ArchiveSearchResult> {
    const response = await httpClient<ArchiveSearchResponse>('news-papers/search-archives', "", {
        method: "post",
        body: payload,
    });

    if (!response?.success || !response.result) {
        const reason = response?.error?.message || response?.message || "Archive search failed.";
        throw new Error(typeof reason === "string" ? reason : "Archive search failed.");
    }

    return response.result;
}

const archiveBlobCache: Record<string, string> = {};
const archiveThumbnailRequests: Record<string, Promise<string>> = {};

const ARCHIVE_THUMBNAIL_DB_NAME = 'GNP_Archive_Thumbnails';
const ARCHIVE_THUMBNAIL_STORE_NAME = 'blobs';

const getArchiveThumbnailDB = (): Promise<IDBDatabase | null> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            return resolve(null);
        }
        try {
            const request = window.indexedDB.open(ARCHIVE_THUMBNAIL_DB_NAME, 1);
            request.onupgradeneeded = (e) => {
                const db = (e.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(ARCHIVE_THUMBNAIL_STORE_NAME)) {
                    db.createObjectStore(ARCHIVE_THUMBNAIL_STORE_NAME);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        } catch (e) {
            resolve(null);
        }
    });
};

const deleteArchiveBlobFromDB = async (id: string) => {
    const db = await getArchiveThumbnailDB();
    if (!db) return;
    try {
        const tx = db.transaction(ARCHIVE_THUMBNAIL_STORE_NAME, 'readwrite');
        tx.objectStore(ARCHIVE_THUMBNAIL_STORE_NAME).delete(id);
    } catch (e) {
        console.error("IDB Delete Error", e);
    }
};

const saveArchiveBlobToDB = async (id: string, blob: Blob) => {
    const db = await getArchiveThumbnailDB();
    if (!db) return;
    try {
        const tx = db.transaction(ARCHIVE_THUMBNAIL_STORE_NAME, 'readwrite');
        tx.objectStore(ARCHIVE_THUMBNAIL_STORE_NAME).put(blob, id);
    } catch (e) {
        console.error("IDB Save Error", e);
    }
};

const getArchiveBlobFromDB = async (id: string): Promise<Blob | null> => {
    const db = await getArchiveThumbnailDB();
    if (!db) return null;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(ARCHIVE_THUMBNAIL_STORE_NAME, 'readonly');
            const req = tx.objectStore(ARCHIVE_THUMBNAIL_STORE_NAME).get(id);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        } catch (e) {
            resolve(null);
        }
    });
};

export async function getArchiveThumbnail(fileId: string, forceReload: boolean = false): Promise<string> {
    const normalizedId = (fileId ?? '').trim();
    if (!normalizedId || (typeof import.meta !== 'undefined' && (import.meta as { server?: boolean }).server)) {
        return '';
    }

    if (forceReload) {
        if (archiveBlobCache[normalizedId]) {
            URL.revokeObjectURL(archiveBlobCache[normalizedId]);
            delete archiveBlobCache[normalizedId];
        }
        delete archiveThumbnailRequests[normalizedId];
        await deleteArchiveBlobFromDB(normalizedId);
    }

    // 1. Check in-memory fast cache
    if (archiveBlobCache[normalizedId]) {
        return archiveBlobCache[normalizedId];
    }

    if (normalizedId in archiveThumbnailRequests) {
        return archiveThumbnailRequests[normalizedId];
    }

    const requestPromise = (async (): Promise<string> => {
        try {
            // 2. Check IndexedDB persistent cache
            const cachedBlob = await getArchiveBlobFromDB(normalizedId);
            if (cachedBlob) {
                const url = URL.createObjectURL(cachedBlob);
                archiveBlobCache[normalizedId] = url;
                return url;
            }

            // 3. Fallback to network request
            const response = await gnpUserHttpClient<Blob>(
                `g3/get-file/archive-thumbnails/${encodeURIComponent(normalizedId)}.jpg`,
                "",
                { responseType: 'blob' },
            );

            if (
                !(response instanceof Blob) ||
                response.size === 0 ||
                response.type?.startsWith('text/') ||
                response.type?.includes('json')
            ) {
                return '';
            }

            // 4. Save to both caches
            saveArchiveBlobToDB(normalizedId, response); // Fire-and-forget IDB save
            const url = URL.createObjectURL(response);
            archiveBlobCache[normalizedId] = url;
            return url;
        } catch (error) {
            console.error("Failed to load archive thumbnail:", error);
            return '';
        } finally {
            delete archiveThumbnailRequests[normalizedId];
        }
    })();

    archiveThumbnailRequests[normalizedId] = requestPromise;
    return requestPromise;
}
