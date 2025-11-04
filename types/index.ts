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
    ceoFullName: string;
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
    repFullName: string;
    repPhone: string;
    repEmail: string;
}

export interface ContractorFormData extends 
    ContractorMainInfo,
    ContractorCeoInfo,
    ContractorContactInfo,
    ContractorBankingInfo,
    ContractorRepresentativeInfo {}

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