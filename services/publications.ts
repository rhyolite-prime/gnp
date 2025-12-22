import type { Publication, BaseApiResponse, BasePaginationModel } from "~/models";

 
export async function getPublications(query: object) {
 
    const response = await httpClient<BaseApiResponse<BasePaginationModel<Publication[]>>>('publications/get-all', "", { query });
    return response.result;
}