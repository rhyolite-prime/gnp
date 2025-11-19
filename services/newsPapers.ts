import type { NewsPaper, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getNewsPapers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<NewsPaper[]>>>('news-papers/get-all', "", { query });
    
   return response.result;
}

export async function getNewsPaperDetails(query: object) {
 
    const response = await httpClient<BaseApiResponse<NewsPaper>>('news-papers/get-details', "", { query });
    
   return response.result;
}

const blobCache: Record<string, string> = {};

export async function getSecureThumbnail(fileId: string) {
    // Return cached URL if it exists
    if (blobCache[fileId]) {
        return blobCache[fileId];
    }

    try {
        const response = await httpClient<Blob>('assetproxy/getfileasset', "https://archive.graphic.com.gh/", {
            query: { fileId },
            config: {
                responseType: 'blob',
                headers: {
                    "RequestVerificationToken": "",
                },
            },
        });

        const url = URL.createObjectURL(response);
        blobCache[fileId] = url; // cache it
        return url;

    } catch (error) {
        console.error("Failed to load secure image:", error);
        return 'https://archive.graphic.com.gh/img/news-avatar.png';
    }
}