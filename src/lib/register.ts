export interface RegisterFormData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    nik?: string;
    npwp?: string;
    ktpFile?: File | null;
    npwpFile?: File | null;
    diplomaFile?: File | null;
  
    // Buat step 2
    aboutMe?: string;
    yearsOfExperience?: string;
    skkLevel?: string;
    currentLocation?: string;
    prefferedLocations?: string[];
    skill?: string ;
    otherSkill?: string;
    skkFile?: File | null;

    // Buat step 3
    price?: string;

    // Buat step 4
}