import type { PartnerStats, PartnerEngagementReport, PartnerSubscriber, CommercialPartnerApiKey, PartnerAnalyticsCharts, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getPartnerStats() {
 
    const response = await partnerHttpClient<BaseApiResponse<PartnerStats>>('partners/get-stats', "");
    return response.result;
}


export async function getCommercialPartnerApiKeys() {
 
    const response = await partnerHttpClient<BaseApiResponse<CommercialPartnerApiKey[]>>('partners/get-api-keys', "");
    return response.result;
}


export async function updateCommercialPartnerApiKey(payload: object) {
    const response = await partnerHttpClient<BaseApiResponse<object>>('partners/update-partner-api-key', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function generateCommercialPartnerApiKey(payload: object) {
    const response = await partnerHttpClient<BaseApiResponse<CommercialPartnerApiKey>>('partners/generate-partner-api-key', "", {
        method: "post",
        body: payload,
    });
    return response.result;
}


export async function revokeCommercialPartnerApiKey(keyId: string) {
    const response = await partnerHttpClient<BaseApiResponse<object>>(`partners/revoke-partner-api-key?id=${keyId}`, "");
    return response.success;
}

export async function activateCommercialPartnerApiKey(keyId: string) {
    const response = await partnerHttpClient<BaseApiResponse<object>>(`partners/activate-partner-api-key?id=${keyId}`, "");
    return response.success;
}



export async function deleteCommercialPartnerApiKey(keyId: string) {
    const response = await partnerHttpClient<BaseApiResponse<object>>(`partners/update-partner-api-key?id=${keyId}`, "", {
        method: "delete",
    });
    return response.success;
}

export async function getPartnerEngagementReport(query: object) {
 
    const response = await partnerHttpClient<BaseApiResponse<PartnerEngagementReport>>('partners/get-all-subscription-plans', "", { query });
    return response.result;
}

export async function getPartnerAnalyticsCharts(query: object) {
 
    const response = await partnerHttpClient<BaseApiResponse<PartnerAnalyticsCharts>>('partners/get-all-subscription-plans', "", { query });
    return response.result;
}

export async function getPartnerSubscribers(query: object) {
 
    const response = await partnerHttpClient<BaseApiResponse<BasePaginationModel<PartnerSubscriber[]>>>('partners/get-subscribers', "", { query });
    return response.result;
}

export async function getPartnerDefaultSubscriptionPlan(query: object) {
 
    const response = await partnerHttpClient<BaseApiResponse<PartnerAnalyticsCharts>>('partners/get-default-subscription-plan', "", { query });
    return response.result;
}

export async function createPartnerSubscriber(payload: object) {
    
  const response = await partnerHttpClient<BaseApiResponse<object>>('partners/create-subscriber', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function bulkUploadSubscriber(payload: object) {
    
  const response = await partnerHttpClient<BaseApiResponse<object>>('partners/create', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

 
export async function updatePartnerSubscriber(payload: object) {
    
  const response = await partnerHttpClient<BaseApiResponse<object>>('partners/update-subscriber', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteSubscriber(query: object) {
 
    const response = await partnerHttpClient<BaseApiResponse<object>>('partners/delete-subscriber', "", { query, method: "delete", });
    return response.success;
}