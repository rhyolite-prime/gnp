import type { NewsPaper, Payment, CommercialPartner,AdminUser, PartnerInvoiceStat, SubscriptionSummary, Subscriber, CommercialPartnerStat, GnpDocumentResponseModel, BaseApiResponse, BasePaginationModel, CommercialPartnerApiKey, PartnerInvoice } from "~/models";

export async function getNewsPaperPublications(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<NewsPaper[]>>>('admin/get-all-newspapers', "", { query });
    return response.result;
}



export async function uploadGnpDocument(publicationFile: File) {
  
    const formData = new FormData();
    formData.append("publicationFile", publicationFile);

  const response = await httpClient<BaseApiResponse<GnpDocumentResponseModel>>("api/services/app/auxillary/uploadgnpdocument", "https://archive.graphic.com.gh/",
    {
      method: "post",
      body: formData,
    });
    
  return response.result;
}

export async function createNewsPaper(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('admin/ingest-newspaper', "", {
    method: "post",
    body: payload,
  });
  return response.result;
}

export async function publishNewspaperPublication(query: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('admin/publish-newspaper', "", { query });
    return response.success;
}


export async function unPublishNewspaperPublication(query: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('admin/unpublish-newspaper', "", { query });
    return response.success;
}


 
export async function getPayments(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<Payment[]>>>('admin/get-all-payments', "", { query });
    return response.result;
}

// commercial partners

export async function getCommercialPartners(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<CommercialPartner[]>>>('admin/get-all-partners', "", { query });
    return response.result;
}

export async function getCommercialPartnerDetails(partnerId: string) {
 
    const response = await httpClient<BaseApiResponse<CommercialPartner>>(`admin/get-partner-details?partnerId=${partnerId}`, "");
    return response.result;
}

export async function getCommercialPartnerStats() {
 
    const response = await httpClient<BaseApiResponse<CommercialPartnerStat[]>>('admin/get-partner-stats', "");
    return response.result;
}

export async function createCommercialPartner(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('admin/create-partner', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}


export async function updateCommercialPartner(payload: object) {
    
  const response = await httpClient<BaseApiResponse<object>>('admin/update-partner', "", {
    method: "post",
    body: payload,
  });
  return response.success;
}

 
export async function deleteCommercialPartner(id: string) {
  const response = await httpClient<BaseApiResponse<object>>(`admin/delete-partner?partnerId=${id}`, "", {
    method: "delete",
  });
  return response.success;
}

export async function enablePartnerSubaccount(query: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('admin/enable-partner-subaccount', "", { query });
    return response.success;
}

export async function updateCommercialPartnerStatus(query: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('admin/update-partner-status', "", { query });
    return response.success;
}

export async function disablePartnerSubaccount(query: object) {
 
    const response = await httpClient<BaseApiResponse<object>>('admin/disable-partner-subaccount', "", { query });
    return response.success;
}

export async function getCommercialPartnerSubscribers(partnerId: string) {
    const response = await httpClient<BaseApiResponse<BasePaginationModel<Subscriber[]>>>(`admin/get-partner-subscribers?partnerId=${partnerId}`, "");
    return response.result;
}

export async function getCommercialPartnerSubscriptionSummary(partnerId: string) {
    const response = await httpClient<BaseApiResponse<SubscriptionSummary[]>>(`admin/get-partner-subscription-summary?partnerId=${partnerId}`, "");
    return response.result;
}

export async function uploadCommercialPartnerSubscribers(formData: FormData) {
    const response = await httpClient<BaseApiResponse<object>>('admin/upload-partner-subscribers', "", {
        method: "post",
        body: formData,
    });
    return response.success;
}

export async function removeCommercialPartnerSubscriber(partnerId: string,subscriberId: string) {
    const response = await httpClient<BaseApiResponse<object>>(`admin/delete-partner-subscriber?partnerId=${partnerId}&subscriberId=${subscriberId}`, "", {
        method: "delete",
    });
    return response.success;
}

export async function updateCommercialPartnerSubscriberStatus(query: { partnerId: string, subscriberId: string, status: string }) {
    const response = await httpClient<BaseApiResponse<object>>('admin/update-partner-subscriber-status', "", { query });
    return response.success;
}

export async function createPartnerSubscriber(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('admin/create-partner-subscriber', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function assignSubscriptionToCommercialPartnerSubscribers(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('admin/assign-partner-subscribers-plan', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}



// admin users

export async function getAdminUsers(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<AdminUser[]>>>('admin/get-all-users', "", { query });
    return response.result;
}

export async function getPartnerApiKeys(partnerId: string) {
    const response = await httpClient<BaseApiResponse<CommercialPartnerApiKey[]>>(`admin/get-partner-api-keys?partnerId=${partnerId}`, "");
    return response.result;
}

export async function generatePartnerApiKey(payload: object) {
    const response = await httpClient<BaseApiResponse<CommercialPartnerApiKey>>('admin/generate-partner-api-key', "", {
        method: "post",
        body: payload,
    });
    return response.result;
}

export async function revokePartnerApiKey(keyId: string) {
    const response = await httpClient<BaseApiResponse<object>>(`admin/revoke-partner-api-key?keyId=${keyId}`, "", {
        method: "delete",
    });
    return response.success;
}

export async function updatePartnerApiKey(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('admin/update-partner-api-key', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function getPartnerInvoices(query: object) {
    const response = await httpClient<BaseApiResponse<BasePaginationModel<PartnerInvoice[]>>>('admin/get-all-partner-invoices', "", { query });
    return response.result;
}

export async function getPartnerInvoiceStats() {
    const response = await httpClient<BaseApiResponse<PartnerInvoiceStat>>('admin/get-partner-invoice-stats', "");
    return response.result;
}



export async function markPartnerInvoiceAsPaid(invoiceId: string) {
    const response = await httpClient<BaseApiResponse<object>>(`admin/mark-partner-invoice-paid?id=${invoiceId}`, "", {
        method: "get",
    });
    return response.success;
}

export async function createPartnerInvoice(payload: object) {
    const response = await httpClient<BaseApiResponse<object>>('admin/create-partner-invoice', "", {
        method: "post",
        body: payload,
    });
    return response.success;
}

export async function deletePartnerInvoice(invoiceId: string) {
    const response = await httpClient<BaseApiResponse<object>>(`admin/delete-partner-invoice?id=${invoiceId}`, "", {
        method: "delete",
    });
    return response.success;
}