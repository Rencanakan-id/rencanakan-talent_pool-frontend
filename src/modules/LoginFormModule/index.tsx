/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { LoginForm } from './Section/login';
import { LoginFormData } from '@/lib/login';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  const validateFormOnSubmit = () => {
    let isValid = true;
    let emailErr = '';
    let commentErr = '';

    if ((formData.email ?? '').length < 4) {
      emailErr = 'Email yang dimasukkan tidak valid';
      isValid = false;
    }

    if ((formData.password ?? '').length < 6) {
      commentErr = 'Kata sandi harus memiliki setidaknya 8 karakter';
      isValid = false;
    }

    return { isValid, emailErr, commentErr };
  };

  const processLoginResponse = async (response: Response) => {
    const result = await response.json();
    console.log(response.ok);
    if (response.ok) {
      console.log(result);
      const token = result.token;
      document.cookie = `access_token=${token}; path=/; Secure; SameSite=None`;
      console.log('berhasil');
      console.log(token);
      navigate('/preview');
      return true;
    } else {
      console.log('gagal');
      console.log(result);
      setEmailError('Email atau password salah');
      setPasswordError('Email atau password salah');
      return false;
    }
  };

  const handleLogin = async () => {
    if (!isFormValid) return;

    const { isValid, emailErr, commentErr } = validateFormOnSubmit();
    setEmailError(emailErr);
    setPasswordError(commentErr);

    if (!isValid) return;

    try {
      console.log(formData);
      // TODO: ganti api dengan variabel di env file
      const response = await fetch('http://localhost:8080/api/auth/login', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
        method: 'POST',
      });
      await processLoginResponse(response);
      // // Tambahkan navigasi ke halaman utama
      // navigate('/');
    } catch (error) {
      if (error instanceof Error && (error as any).response) {
        console.error('Login Failed:', (error as any).response.data);
      } else {
        console.error('Login Failed:', error);
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
