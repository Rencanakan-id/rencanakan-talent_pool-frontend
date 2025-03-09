import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App.tsx';
import { DesignSystemModule } from './modules/DesignSystemModule/index.tsx';
import { RegisterModule } from './modules/RegisterFormModule/index.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<App />} />
        <Route path="/design" element={<DesignSystemModule />} />
        <Route path="/register" element={<RegisterModule />} />
    </Routes>
  </BrowserRouter>
);
