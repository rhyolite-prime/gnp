import type { NewsPaper, GnpDocumentResponseModel, BaseApiResponse, BasePaginationModel } from "~/models";

 
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
