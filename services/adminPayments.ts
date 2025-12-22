import type { Payment, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getPayments(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<Payment[]>>>('admin/get-all-payments', "", { query });
    return response.result;
}