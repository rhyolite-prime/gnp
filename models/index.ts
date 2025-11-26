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

export interface BaseEntityModel {
    id: string;
    createdAt: string;
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

export interface GuestSubscriptionResponseModel {
    paymentUrl: string;
    reference: string;
}


export interface NewsPaper {
    documentId: string;
    editionNumber: string;
    fileType: string;
    fullDescription: string;
    publicationName: string;
    id: string;
    price: string;
    publishedDate: string;
    shortDescription: string;
    slug: string;
    thumbnailId: string;
    featuredStories: FeaturedStory[]
    title: string;
}

export interface FeaturedStory {
    title: string;
    description: string;
}



export interface UserSubscription extends BaseEntityModel {
    subscriptionIdentifier: string;
    userId: string;
    username: string;
    email: string;
    currentSubscriptionPlanId: string;
    startDate: string;
    endDate: string;
    currentBillingCycle: string;
    isActive: boolean;
    nextRenewalDate: string;
    fee: number;
}
