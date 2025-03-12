/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { LoginForm } from './Section/login';
import { LoginFormData } from '@/lib/login';
// import AuthService from "@/services/AuthService";

const LoginModule = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const updateFormData = (data: Partial<LoginFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
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

  const handleLogin = async () => {
    if (isFormValid) {
      const { isValid, emailErr, commentErr } = validateFormOnSubmit();
      setEmailError(emailErr);
      setPasswordError(commentErr);

      if (isValid) {
        try {
          console.log(formData);
          // TODO: ganti api dengan variabel di env file
          const response = await fetch('http://50.17.124.12:8000/api/auth/login-talent', {
            body: JSON.stringify(formData),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });
          const result = await response.json();
          if (result.status === 'success') {
            console.log(result);
            const token = result.data.token.plainTextToken;

            document.cookie = `access_token=${token}; path=/; Secure; SameSite=None`;
            console.log('berhasil');
            console.log(token);
          } else {
            console.log('gagal');
            console.log(result);
            setEmailError('Email atau password salah');
            setPasswordError('Email atau password salah');
          }
          // // Tambahkan navigasi ke halaman utama
          // // navigate('/home');
        } catch (error) {
          if (error instanceof Error && (error as any).response) {
            console.error('Login Failed:', (error as any).response.data);
          } else {
            console.error('Login Failed:', error);
          }
        }
      }
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
