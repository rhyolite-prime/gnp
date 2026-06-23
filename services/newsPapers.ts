import type { NewsPaper, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getNewsPapers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<NewsPaper[]>>>('news-papers/get-all', "", { query });
    
   return response.result;
}

export async function getLatestNewsPapers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<NewsPaper[]>>>('news-papers/get-latest', "", { query });
    
   return response.result;
}

export async function getNewsPaperDetails(query: object) {
 
    const response = await httpClient<BaseApiResponse<NewsPaper>>('news-papers/get-redacted-details', "", { query });
    
   return response.result;
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
            blobCache[fileId] = url; // Save to fast cache
            return url;
        }

        // 3. Fallback to network request
        const response = await httpClient<Blob>('assetproxy/getfileasset', "https://archive.graphic.com.gh/", {
            query: { fileId },
            config: {
                responseType: 'blob',
                headers: {
                    "RequestVerificationToken": "",
                },
            },
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