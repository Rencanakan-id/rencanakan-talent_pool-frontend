export interface UserProps {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  photo?: string;
  aboutMe?: string;
  nik: string;
  npwp?: string;
  photoKtp?: string;
  photoNpwp?: string;
  photoIjazah?: string;
  experienceYears?: number;
  skkLevel?: string;
  currentLocation?: string;
  preferredLocations: string[];
  skill?: string;
  price?: number;
}
