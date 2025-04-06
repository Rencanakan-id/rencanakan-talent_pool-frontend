import { EmploymentType, LocationType } from "@/components/ui/experience";

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