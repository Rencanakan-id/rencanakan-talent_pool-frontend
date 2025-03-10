/**
 * Validates a person's first name
 * @param firstName The first name to validate
 * @returns Empty string if valid, otherwise an error message
 */
export const validateFirstName = (firstName: string | undefined): string => {
    if (!firstName) return "Nama depan tidak boleh kosong";
    if (firstName.length < 2) return "Nama depan minimal 2 karakter";
    if (!/^[a-zA-Z\s]+$/.test(firstName)) return "Nama depan hanya boleh berisi huruf dan spasi";
    return "";
  };
  
  /**
   * Validates a person's last name
   * @param lastName The last name to validate
   * @returns Empty string if valid, otherwise an error message
   */
  export const validateLastName = (lastName: string | undefined): string => {
    if (!lastName) return "Nama belakang tidak boleh kosong";
    if (lastName.length < 2) return "Nama belakang minimal 2 karakter";
    if (!/^[a-zA-Z\s]+$/.test(lastName)) return "Nama belakang hanya boleh berisi huruf dan spasi";
    return "";
  };
  
  /**
   * Validates an email address
   * @param email The email to validate
   * @returns Empty string if valid, otherwise an error message
   */
  export const validateEmail = (email: string | undefined): string => {
    if (!email) return "Email tidak boleh kosong";
    // Basic email validation pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) return "Format email tidak valid";
    return "";
  };
  
  /**
   * Validates an Indonesian phone number
   * @param phoneNumber The phone number to validate
   * @returns Empty string if valid, otherwise an error message
   */
  export const validatePhoneNumber = (phoneNumber: string | undefined): string => {
    if (!phoneNumber) return "Nomor telepon tidak boleh kosong";
    // Indonesian phone number typically starts with 08 and has 10-13 digits
    if (!/^08\d{8,11}$/.test(phoneNumber.replace(/\s+/g, ''))) return "Nomor telepon tidak valid (harus diawali dengan 08)";
    return "";
  };
  
  /**
   * Validates an Indonesian NIK (National Identity Number)
   * @param nik The NIK to validate
   * @returns Empty string if valid, otherwise an error message
   */
  export const validateNIK = (nik: string | undefined): string => {
    if (!nik) return "NIK tidak boleh kosong";
    // NIK is 16 digits
    if (!/^\d{16}$/.test(nik.replace(/\s+/g, ''))) return "NIK harus terdiri dari 16 digit angka";
    return "";
  };
  
  /**
   * Validates an Indonesian NPWP (Tax ID Number)
   * @param npwp The NPWP to validate
   * @returns Empty string if valid, otherwise an error message
   */
  export const validateNPWP = (npwp: string | undefined): string => {
    if (!npwp) return "NPWP tidak boleh kosong";
    // NPWP format: XX.XXX.XXX.X-XXX.XXX (15 digits + format characters)
    // For validation simplicity, we'll just check for 15 digits
    const npwpDigits = npwp.replace(/[.\-]/g, '');
    if (!/^\d{15}$/.test(npwpDigits)) return "NPWP harus terdiri dari 15 digit angka";
    return "";
  };
  
  /**
   * Validates document file upload
   * @param file The file to validate
   * @param maxSizeMB Maximum file size in MB
   * @returns Empty string if valid, otherwise an error message
   */
  export const validateFile = (file: File | undefined, maxSizeMB: number = 5): string => {
    if (!file) return "File tidak boleh kosong";
    
    // Check file size (convert MB to bytes)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) return `Ukuran file melebihi ${maxSizeMB}MB`;
    
    // Check file type (allow only pdf, jpg, jpeg, png)
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedTypes.includes(fileExt)) return "Format file tidak didukung";
    
    return "";
  };
  
  /**
   * Validates the entire Step One form
   * @param formData The form data to validate
   * @returns An object containing validation status and errors
   */
  export const validateStepOneForm = (formData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    nik?: string;
    npwp?: string;
    ktpFile?: File;
    npwpFile?: File;
    diplomaFile?: File;
  }): { 
    isValid: boolean, 
    errors: { 
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      nik?: string;
      npwp?: string;
      ktpFile?: string;
      npwpFile?: string;
      diplomaFile?: string;
    }
  } => {
    const firstNameError = validateFirstName(formData.firstName);
    const emailError = validateEmail(formData.email);
    const phoneNumberError = validatePhoneNumber(formData.phoneNumber);
    const nikError = validateNIK(formData.nik);
    const npwpError = validateNPWP(formData.npwp);
    const ktpFileError = validateFile(formData.ktpFile);
    const npwpFileError = validateFile(formData.npwpFile);
    const diplomaFileError = validateFile(formData.diplomaFile);
    
    const errors = {
      firstName: formData.firstName !== undefined ? firstNameError : undefined,
      email: formData.email !== undefined ? emailError : undefined,
      phoneNumber: formData.phoneNumber !== undefined ? phoneNumberError : undefined,
      nik: formData.nik !== undefined ? nikError : undefined,
      npwp: formData.npwp !== undefined ? npwpError : undefined,
      ktpFile: formData.ktpFile !== undefined ? ktpFileError : undefined,
      npwpFile: formData.npwpFile !== undefined ? npwpFileError : undefined,
      diplomaFile: formData.diplomaFile !== undefined ? diplomaFileError : undefined,
    };
  
    const isValid = 
      firstNameError === "" && 
      emailError === "" && 
      phoneNumberError === "" && 
      nikError === "" && 
      npwpError === "" && 
      ktpFileError === "" && 
      npwpFileError === "" && 
      diplomaFileError === "";
  
    return { isValid, errors };
  };