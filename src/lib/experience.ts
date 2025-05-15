export interface ExperienceFormData {
    title: string;
    company: string;
    employmentType: EmploymentType;
    startDate: string;
    endDate: string;
    location: string;
    locationType: LocationType;
    talentId: number;
    }

export interface ExperienceRequestDTO {
    title: string;
    company: string;
    companyImage: string;
    employmentType: EmploymentType;
    startDate: string;
    endDate: string | null;
    location: string;
    locationType: LocationType;
    }

export interface ExperienceResponseDTO {
    id: number;
    title: string;
    company: string;
    companyImage: string;
    employmentType: EmploymentType;
    startDate: string;
    endDate: string | null;
    location: string;
    locationType: LocationType;
    }

export type EmploymentType =
    | 'FULL_TIME'
    | 'PART_TIME'
    | 'SELF_EMPLOYED'
    | 'FREELANCE'
    | 'CONTRACT'
    | 'INTERNSHIP'
    | 'APPRENTICESHIP'
    | 'SEASONAL'
    | '';

export type LocationType = 'ON_SITE' | 'HYBRID' | 'REMOTE' | '';