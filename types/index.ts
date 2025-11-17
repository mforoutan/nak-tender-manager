export interface ContractorLogin {
    id: number;
    contractorId: number;
    username: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    lastLogin: Date | null;
}

export interface Contractor {
    id: number;
    companyName: string;
    nationalId: string;
    email?: string;
    phone?: string;
    isActive: number;
}

export interface SessionUser {
    id: number;
    contractorId: number;
    username: string;
    firstName: string;
    lastName: string;
    companyName: string;
    companyStatus: number;
}

// New interfaces for the contractor registration form
export interface ContractorMainInfo {
    companyName: string;
    companyNameEN: string;
    companyType: string;
    companyCategory: string;
    nationalId: string;
    establishmentDate: string;
    economicCode: string;
    registrationNumber: string;
    registrationPlace: string;
    insuranceBranch: string;
}

export interface ContractorCeoInfo {
    ceoFirstName: string;
    ceoLastName: string;
    ceoNationalId: string;
    ceoMobile: string;
}

export interface ContractorContactInfo {
    phone: string;
    mobile: string;
    fax: string;
    website: string;
    email: string;
    province: string;
    city: string;
    postalCode: string;
}

export interface ContractorBankingInfo {
    bankName: string;
    bankBranch: string;
    accountNumber: string;
    shabaNumber: string;
}

export interface ContractorRepresentativeInfo {
    repFirstName: string;
    repLastName: string;
    repPhone: string;
    repEmail: string;
}

export interface ContractorFormData extends 
    ContractorMainInfo,
    ContractorCeoInfo,
    ContractorContactInfo,
    ContractorBankingInfo,
    ContractorRepresentativeInfo {}

export interface ContractorSignupData extends ContractorFormData {
    password: string;
    uploadedFileIds?: { [key: string]: number };
}

export interface ContractorDocument {
    id: number;
    contractorId: number;
    fileId: number;
    documentType: string;
    uploadDate: Date;
    fileName?: string;
    fileSize?: number;
}

export interface ContractorTask {
    id: number;
    entityType: string;
    entityId: number;
    itemType: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    assignedTo?: number;
    assignedBy?: number;
    assignedDate: string;
    dueDate?: string;
    completedDate?: string;
    actionType?: string;
    actionComment?: string;
    actionBy?: number;
    actionDate?: string;
    taskType?: string;
}

// Published Process Types (for tender listings)
export interface PublishedProcess {
    id: number;
    transactionProcessId: number;
    publicationNumber: string;
    title: string;
    description?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED';
    publishDate?: Date | string;
    deadlineDate?: Date | string;
    submissionStartDate?: Date | string;
    submissionEndDate?: Date | string;
    estimatedValue?: number;
    currency?: string;
    contactInfo?: string;
    termsConditions?: string;
    publicationRound?: number;
    documentPrice?: number;
    documentCurrency?: string;
    purchaseDeadline?: Date | string;
    maxDownloads?: number;
    targetCategoryIds?: string;
    documentsZipFileId?: number;
    createdBy: number;
    createdDate: Date | string;
    modifiedBy?: number;
    modifiedDate?: Date | string;
    publishedDate?: Date | string;
    publishStartDate?: Date | string;
    publishEndDate?: Date | string;
    isActive: number;
    customFields?: string;
    customFieldsVersion?: number;
    // Related data from joins
    processType?: string;
    requestType?: string;
    requestCategory?: string;
    provinceName?: string;
    cityName?: string;
    regionName?: string;
}

// Simplified type for DataTable component
export interface TenderListItem {
    id: number;
    title: string;
    type: string; // processType (مناقصه عمومی, فراخوان, استعلام, etc.)
    status: 'ongoing' | 'upcoming' | 'completed'; // Derived from dates
    endDate: string; // submissionEndDate
    category: string; // requestCategory
    code: string; // publicationNumber
}

// API Query parameters
export interface PublishedProcessFilters {
    search?: string;
    status?: 'ongoing' | 'upcoming' | 'completed' | 'all';
    type?: string; // Process type filter
    category?: string; // Request category filter
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

// API Response
export interface PublishedProcessListResponse {
    data: TenderListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Export alert types
export * from './alert';

// Export form field types
export * from './form-fields';