import type { NewsPaper, Article, Video, VideoPage, BaseApiResponse, BasePaginationModel, SubscriptionPlan, Publication } from "~/models";

 
/**
 * Public list of publications (Daily Graphic, The Mirror, ...) used to filter
 * the newspapers listing. Accepts either the standard pagination envelope or a
 * plain array in `result`.
 */
export async function getPublicPublications(): Promise<Publication[]> {

    const response = await httpClient<BaseApiResponse<BasePaginationModel<Publication[]> | Publication[]>>(
        'news-papers/get-publications', "", { query: { pageNo: 1, pageSize: 100 } });

    if (!response || response.success === false) {
        throw new Error(response?.message || 'Unable to load publications');
    }

    const result: any = response.result;
    const list = Array.isArray(result) ? result : result?.data;

    return Array.isArray(list) ? list : [];
}

/**
 * Supported filters: `query`, `publicationId`, `startDate`, `endDate`
 * (dates as YYYY-MM-DD) plus `pageNo` / `pageSize`. Empty values are dropped.
 */
export async function getNewsPapers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<NewsPaper[]>>>('news-papers/get-all', "", { query });
    
   return response.result;
}

/**
 * Public pricing plans (`regular`, `bundle` and `premium`). The endpoint answers
 * with the standard pagination envelope, so the page receives the plan array.
 */
export async function getPricingPlans() {

    const response = await httpClient<BaseApiResponse<BasePaginationModel<SubscriptionPlan[]>>>(
        'news-papers/get-pricing-plans', "");

    if (!response || response.success === false) {
        throw new Error(response?.message || 'Unable to load pricing plans');
    }

    return {
        data: Array.isArray(response.result?.data) ? response.result.data : [],
        totalCount: response.result?.totalCount ?? 0,
    };
}

export async function getTopStories() {
 
    const response = await httpClient<BaseApiResponse<Article[]>>('news-papers/get-top-stories', "");
    
   return response.result;
}

export async function getVideos(query: object) {
 
    const response = await httpClient<BaseApiResponse<VideoPage>>('news-papers/get-all-videos', "", { query });

    const page = response?.result;

    if (!response || response.success === false || !page || !Array.isArray(page.data)) {
        throw new Error(response?.message || 'Unable to load videos');
    }

   return page;
}

/**
 * Looks up a single video for the details page. The dedicated endpoint is the
 * source of truth, so deep links no longer page through the whole catalogue.
 * Returns null when the video does not exist; real API failures still throw.
 */
export async function getVideoDetails(id: string): Promise<Video | null> {
    const videoId = (id ?? '').trim();

    // An id from the route can be empty (e.g. /videos/); never call the API with it.
    if (!videoId) return null;

    try {
        const response = await httpClient<BaseApiResponse<Video>>(
            `news-papers/get-video-details/${encodeURIComponent(videoId)}`, "");

        if (!response || response.success === false) return null;

        // Guard against a 2xx envelope that carries no actual video payload.
        return response.result?.id ? response.result : null;
    } catch (error: any) {
        // A deleted/unknown video is "not found", not a failure to load the page.
        const status = error?.statusCode ?? error?.status ?? error?.response?.status;
        if (status === 404) return null;
        throw error;
    }
}


export async function getLatestNewsPapers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<NewsPaper[]>>>('news-papers/get-latest', "", { query });
    
   return response.result;
}

export async function getAllPublications() {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<Publication[]>>>('news-papers/get-all-publications', "");
    
   return response.result;
}

export async function getNewsPaperDetails(query: object) {
 
    const response = await httpClient<BaseApiResponse<NewsPaper>>('news-papers/get-redacted-details', "", { query });
    
   return response.result;
}


export async function updateUserEngagementMetrics(payload: object) {
 
    const response = await gnpUserHttpClient<BaseApiResponse<object>>('news-papers/update-user-engagement', "",
        {
            method: "post",
            body: payload,
        });
    
   return response.success;
}



const blobCache: Record<string, string> = {};

const DB_NAME = 'GNP_Thumbnails';
const STORE_NAME = 'blobs';

const getDB = (): Promise<IDBDatabase | null> => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            return resolve(null);
        }
        try {
            const request = window.indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = (e) => {
                const db = (e.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        } catch (e) {
            resolve(null);
        }
    });
};

const saveBlobToDB = async (id: string, blob: Blob) => {
    const db = await getDB();
    if (!db) return;
    try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(blob, id);
    } catch (e) {
        console.error("IDB Save Error", e);
    }
};

const getBlobFromDB = async (id: string): Promise<Blob | null> => {
    const db = await getDB();
    if (!db) return null;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(id);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        } catch (e) {
            resolve(null);
        }
    });
};

export async function getSecureThumbnail(fileId: string) {
    // 1. Check in-memory fast cache
    if (blobCache[fileId]) {
        return blobCache[fileId];
    }

    try {
        // 2. Check IndexedDB persistent cache
        const cachedBlob = await getBlobFromDB(fileId);
        if (cachedBlob) {
            const url = URL.createObjectURL(cachedBlob);
            blobCache[fileId] = url;
            return url;
        }

        // 3. Fallback to network request
        const response = await gnpUserHttpClient<Blob>(`g3/get-file/gnp-thumbnails/${fileId}.png`, "", { 
            responseType: 'blob'
             
        });

        // 4. Save to both caches
        saveBlobToDB(fileId, response); // Fire-and-forget IDB save
        const url = URL.createObjectURL(response);
        blobCache[fileId] = url; 
        return url;

    } catch (error) {
        console.error("Failed to load secure image:", error);
        return 'https://archive.graphic.com.gh/img/news-avatar.png';
    }
}