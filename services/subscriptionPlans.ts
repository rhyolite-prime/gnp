import type { UserSubscription, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getSubscriptionPlans(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<object[]>>>('admin/get-all-campaigns', "", { query });
    return response.result;
}