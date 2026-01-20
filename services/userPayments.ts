import type { Payment, BaseApiResponse, BasePaginationModel } from "~/models";

export async function getUserPayments(query: object) {
    try {
        const response = await httpClient<BaseApiResponse<BasePaginationModel<Payment[]>>>('subscription/get-user-payments', "", { query });
        return response.result;
    } catch (error) {
        console.error('Failed to fetch user payments', error);
        // Fallback to empty pagination if API is not yet available
        return {
            data: [],
            totalCount: 0,
            totalPages: 0,
            pageNo: 1,
            lowerBound: 0,
            upperBound: 0
        };
    }
}
