import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App.tsx';
import { DesignSystemModule } from './modules/DesignSystemModule/index.tsx';
import { RegisterModule } from './modules/RegisterFormModule/index.tsx';
import LoginModule from './modules/LoginFormModule/index.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<App />} />
      <Route path="/" element={<>TODO: Make this landing page</>} />
      <Route path="/design" element={<DesignSystemModule />} />
      <Route path="/register" element={<RegisterModule />} />
      <Route path="/login" element={<LoginModule />} />
    </Routes>
  </BrowserRouter>
);
