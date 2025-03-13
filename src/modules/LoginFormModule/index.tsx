/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { LoginForm } from './Section/login';
import { LoginFormData } from '@/lib/login';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/context/authContext'; // Import useAuth dari AuthContext

const LoginModule = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isAuthenticated } = useAuth(); // Gunakan login dari AuthContext
  const navigate = useNavigate();

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
      emailErr = 'Email yang dimasukkan tidak valid';
      isValid = false;
    }

    if ((formData.password ?? '').length < 8) {
      commentErr = 'Kata sandi harus memiliki setidaknya 8 karakter';
      isValid = false;
    }

    return { isValid, emailErr, commentErr };
  };

  const handleLogin = async () => {
    if (!isFormValid) return;

    const { isValid, emailErr, commentErr } = validateFormOnSubmit();
    setEmailError(emailErr);
    setPasswordError(commentErr);

    if (!isValid) return;

    try {
      console.log(formData);
      // TODO: Ganti URL API dengan variabel di env file
      const response = await fetch('http://localhost:8080/api/auth/login', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        const token = result.token;
        console.log(token);
        // Gunakan fungsi login dari AuthContext
        login(token);
        console.log(isAuthenticated);
        console.log('Login berhasil');
        navigate('/preview'); // Navigasi ke halaman utama atau halaman lainnya
      } else {
        console.log('Login gagal');
        console.log(result);
        setEmailError('Email atau password salah');
        setPasswordError('Email atau password salah');
      }
    } catch (error) {
      console.error('Login Failed:', error);
      setEmailError('Terjadi kesalahan saat mencoba login');
      setPasswordError('Terjadi kesalahan saat mencoba login');
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