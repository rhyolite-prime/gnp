import type { PartnerStats, PartnerEngagementReport, PartnerAnalyticsCharts, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getPartnerStats(query: object) {
 
    const response = await httpClient<BaseApiResponse<PartnerStats>>('partners/get-all-subscription-plans', "", { query });
    return response.result;
}

export async function getPartnerEngagementReport(query: object) {
 
    const response = await httpClient<BaseApiResponse<PartnerEngagementReport>>('partners/get-all-subscription-plans', "", { query });
    return response.result;
}

export async function getPartnerAnalyticsCharts(query: object) {
 
    const response = await httpClient<BaseApiResponse<PartnerAnalyticsCharts>>('partners/get-all-subscription-plans', "", { query });
    return response.result;
}

export async function getPartnerSubscribers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<PartnerSubscriber[]>>>('partners/get-all-subscription-plans', "", { query });
    return response.result;
}

export async function getPartnerDefaultSubscriptionPlan(query: object) {
 
    const response = await httpClient<BaseApiResponse<PartnerAnalyticsCharts>>('partners/get-default-subscription-plan', "", { query });
    return response.result;
}

export async function createSubscriber(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('partners/create-subscriber', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function bulkUploadSubscriber(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('partners/create', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

 
export async function updateSubscriber(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('partners/update-subscriber', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteSubscriber(query: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('partners/delete-subscriber', "", { query, method: "delete", });
    return response.success;
}