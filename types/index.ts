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