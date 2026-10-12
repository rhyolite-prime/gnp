import type { ArchiveSearchRequest, ArchiveSearchResponse, ArchiveSearchResult } from "~/models";

export const ARCHIVE_PAGE_SIZE = 12;

/**
 * Builds the POST body for news-papers/search-archives.
 * Empty strings are sent for unset text/date filters; `publicationYear` is only
 * included when a year was chosen from the "Browse Collections" tab.
 */
export function buildArchiveSearchRequest(params: {
    pageNo: number;
    pageSize?: number;
    query?: string | null;
    dateFrom?: string | null;
    dateTo?: string | null;
    publicationDate?: string | null;
    publicationYear?: number | null;
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
