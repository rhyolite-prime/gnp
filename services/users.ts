import type { BaseApiResponse, GnpUser, BasePaginationModel, UserAccountMetaData, PartnerSubscriberSubscriptionSummary } from "~/models";

export async function getUsers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<GnpUser[]>>>('admin/get-all-users', "", { query });
    return response.result;
}

export async function getUserAccountMetaData() {
    
    const response = await gnpUserHttpClient<BaseApiResponse<UserAccountMetaData>>('users/get-meta-data', "");
    return response.result;
}

export async function getUserSubscriptionDetails(id: string) {
    
    const response = await gnpUserHttpClient<BaseApiResponse<PartnerSubscriberSubscriptionSummary | null>>(`users/get-subscriber-info/${encodeURIComponent(id)}`, "");
    if (!response.success) throw new Error(response.message || 'Failed to load subscription details.');
    return response.result;
}

export async function changePassword(payload: object) {
    
    const response = await gnpUserHttpClient<BaseApiResponse<object>>('auth/change-password', "", {
        method: "post",
        body: payload,
    });
    
    return response.success;
}

export async function updateProfile(payload: object) {
    
    const response = await gnpUserHttpClient<BaseApiResponse<object>>('users/update-profile', "", {
        method: "post",
        body: payload,
    });
    
    return response.success;
}
