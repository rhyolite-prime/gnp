import type { NewsPaper, Payment, CommercialPartner, CommercialPartnerStat, GnpDocumentResponseModel, BaseApiResponse, BasePaginationModel } from "~/models";

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