export enum LeadStatus {
    PENDING = 'PENDING',
    REACHED_OUT = 'REACHED_OUT'
}
  
export type InterestedVisa = 
    | 'O-1'
    | 'EB-1A'
    | 'EB-2 NIW'
    | 'I don\'t know';
  
export interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    linkedin: string;
    countryOfCitizenship: string;
    interestedVisas: string[];
    resumeUrl: string;
    openInput: string;
    status: LeadStatus;
    createdAt: string;
    updatedAt: string;
}