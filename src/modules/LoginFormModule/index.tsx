// index.tsx - Logic and state management
import { useState } from "react";
import { LoginForm } from './Section/login';
import { LoginFormData } from "@/lib/login";

const LoginModule = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const updateFormData = (data: Partial<LoginFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const validateForm = (): boolean => {
    return !!(formData.email && formData.password);
  };

  const isFormValid = validateForm();

  const handleLogin = () => {
    if (isFormValid) {
      console.log('Login Data:', formData);
      // Handle login logic here
      // Such as API calls, authentication, etc.
    }
  };

  return (
    <LoginForm
      formData={formData}
      updateFormData={updateFormData}
      isFormValid={isFormValid}
      handleLogin={handleLogin}
    />
  );
};

export default LoginModule;