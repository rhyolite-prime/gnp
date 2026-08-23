import type { Campaign, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getCampaigns(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<Campaign[]>>>('admin/get-all-campaigns', "", { query });
    return response.result;
}

export async function createCampaign(payload: object) {
    
  const response = await gnpAdminUserHttpClient<BaseApiResponse<object>>('admin/create-campaign', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}

export async function publishCampaign(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<object[]>>>('admin/publish-campaign', "", { query });
    return response.success;
}

export async function deleteCampaign(query: object) {
 
    const response = await gnpAdminUserHttpClient<BaseApiResponse<BasePaginationModel<object[]>>>('admin/delete-campaign', "", { query });
    return response.success;
}