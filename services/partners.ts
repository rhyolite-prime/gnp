import type { PartnerStats, Role, CommercialPartner, PartnerEngagementReport, PartnerSubscriber, CommercialPartnerApiKey, PartnerAnalyticsCharts, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getPartnerStats() {
 
    const response = await partnerHttpClient<BaseApiResponse<PartnerStats>>('partners/get-stats', "");
    return response.result;
}

export async function getPartnerDetails() {
 
    const response = await partnerHttpClient<BaseApiResponse<CommercialPartner>>('partners/get-details', "");
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
 
    const response = await partnerHttpClient<BaseApiResponse<PartnerEngagementReport>>('partners/get-engagement-report', "", { query });
    return response.result;
}

export async function getPartnerAnalyticsCharts(query: object) {
 
    const response = await partnerHttpClient<BaseApiResponse<PartnerAnalyticsCharts>>('partners/get-analytics-charts', "", { query });
    return response.result;
}

export async function getApiUsageStats(query: object) {
    const response = await partnerHttpClient<BaseApiResponse<ApiUsageStats>>('partners/get-api-usage-stats', "", { query });
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


export async function createCommercialPartnerSubscriber(payload: object) {
    const response = await partnerHttpClient<BaseApiResponse<object>>('partners/create-subscriber', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function bulkUploadSubscriber(payload: object) {
    
  const response = await partnerHttpClient<BaseApiResponse<object>>('partners/bulk-upload-subscribers', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

 
export async function updateCommercialPartnerSubscriber(payload: object) {
    
  const response = await partnerHttpClient<BaseApiResponse<object>>('partners/update-subscriber', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

export async function deleteCommercialSubscriber(query: object) {
 
    const response = await partnerHttpClient<BaseApiResponse<object>>('partners/delete-subscriber', "", { query, method: "delete", });
    return response.success;
}

export async function updatePartnerSettings(file?: File, requireTwoFactorAuth?: boolean) {
    const formData = new FormData();
    
    if (file) {
        formData.append('file', file);
    }
    
    if (requireTwoFactorAuth !== undefined) {
        formData.append('requireTwoFactorAuth', requireTwoFactorAuth.toString());
    }

    const response = await partnerHttpClient<BaseApiResponse<object>>('partners/update-logo', "", {
        method: "post",
        body: formData,
    });
    
    return response.success;
}


//roles

export async function getPartnerRoles(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<Role[]>>>('partners/get-roles', "", { query });
    return response.result;
}

export async function createPartnerRole(payload: object) {
    
    const response = await httpClient<BaseApiResponse<object>>('partners/create-role', "", {
        method: "post",
        body: payload,
    });
    
    return response.success;
}

export async function updatePartnerRole(payload: object) {
    
    const response = await httpClient<BaseApiResponse<object>>('partners/update-role', "", {
        method: "post",
        body: payload,
    });
    
    return response.success;
}

export async function deletePartnerRole(query: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('partners/delete-role', "", { query, method: "delete", });
    return response.success;
}