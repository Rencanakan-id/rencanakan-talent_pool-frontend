import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App';
import { DesignSystemModule, LandingPageModule } from './modules';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<App />}>
        <Route path="/" element={<LandingPageModule />} />
        <Route path="/design" element={<DesignSystemModule />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
