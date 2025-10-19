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
    companyType: string;
    registrationNumber: string;
    economicCode: string;
    nationalId: string;
    establishmentDate: string;
}

export interface ContractorCeoInfo {
    ceoFirstName: string;
    ceoLastName: string;
    ceoNationalId: string;
    ceoBirthDate: string;
    ceoMobile: string;
    ceoPosition: string;
}

export interface ContractorContactInfo {
    phone: string;
    fax: string;
    email: string;
    address: string;
    postalCode: string;
    website: string;
}

export interface ContractorBankingInfo {
    bankName: string;
    accountNumber: string;
    ibanNumber: string;
    branchName: string;
    branchCode: string;
}

export interface ContractorRepresentativeInfo {
    repFirstName: string;
    repLastName: string;
    repNationalId: string;
    repPhone: string;
    repEmail: string;
    repPosition: string;
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
}