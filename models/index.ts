export interface BaseApiResponse<T> {
    result: T;
    success: boolean;
    unAuthorizedRequest: boolean;
    error: Error;
}
  

export interface Error {
    code: boolean;
    details: boolean;
    message: any;
    validationErrors: any;
}


export interface BasePaginationModel<T> {
    pageNo: number;
    totalCount: number;
    totalPages: number;
    data: T;

    lowerBound: number;
    upperBound: number;
}

export interface GnpUserAuthModel {
    email: string;
    fullName: string;
    token: number;
    userId: string;
    username: number
    
}


export interface NewsPaper {
    documentId: string;
    editionNumber: string;
    fileType: string;
    fullDescription: string;
    id: string;
    price: string;
    publishedDate: string;
    shortDescription: string;
    slug: string;
    thumbnailId: string;
    title: string;
}
