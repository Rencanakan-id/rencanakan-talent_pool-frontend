// main.tsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App';
import { DesignSystemModule, LandingPageModule, PreviewTalentModule } from './modules';
import { RegisterModule } from './modules/RegisterFormModule';
import LoginModule from './modules/LoginFormModule';
import { EditProfileModule } from './modules/EditProfileModule';

// Inisialisasi Sentry
Sentry.init({
  dsn: "https://7394d93c3045e34bd05d76f4690b310c@o4509283489546240.ingest.de.sentry.io/4509283502653520",
  tracesSampleRate: 1.0,
  environment: 'development',
  release: 'rencanakan-id-fe@1.0.0',
  sendDefaultPii: true,
});

// Render
createRoot(document.getElementById('root')!).render(
  <Sentry.ErrorBoundary fallback={<p>Terjadi kesalahan. Mohon coba lagi nanti.</p>}>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<App />}>
          <Route path="/" element={<LandingPageModule />} />
          <Route path="/design" element={<DesignSystemModule />} />
          <Route path="/preview" element={<PreviewTalentModule />} />
          <Route path="/register" element={<RegisterModule />} />
          <Route path="/login" element={<LoginModule />} />
          <Route path="/edit" element={<EditProfileModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Sentry.ErrorBoundary>
);