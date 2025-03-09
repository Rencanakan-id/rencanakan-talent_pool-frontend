import { useState } from "react";
import { LoginForm } from './Section/login';
import { LoginFormData } from "@/lib/login";

const LoginModule = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const updateFormData = (data: Partial<LoginFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const isFormValid = !!formData.email && !!formData.password;

  const validateFormOnSubmit = () => {
    let isValid = true;
    let emailErr = '';
    let commentErr = '';

    if ((formData.email ?? '').length < 4) {
      emailErr = 'Email harus memiliki setidaknya 4 karakter';
      isValid = false;
    }

    if ((formData.password ?? '').length < 6) {
     commentErr = 'Kata sandi harus memiliki setidaknya 6 karakter';
      isValid = false;
    }

    return { isValid, emailErr, commentErr };
  };

  const handleLogin = () => {
    if (isFormValid) {
      const { isValid, emailErr, commentErr } = validateFormOnSubmit();
      setEmailError(emailErr);
      setPasswordError(commentErr);

      if (isValid) {
        console.log('Login Data:', formData);
        // Handle login logic
      }
    } else {
      setEmailError(formData.email ? '' : 'Email harus diisi');
      setPasswordError(formData.password ? '' : 'Kata sandi harus diisi');
    }
  };

  return (
    <LoginForm
      formData={formData}
      updateFormData={updateFormData}
      isFormValid={isFormValid}
      handleLogin={handleLogin}
      emailError={emailError}
      commentError={passwordError}
    />
  );
};

export default LoginModule;