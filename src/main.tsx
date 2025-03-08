import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import App from './App';
import { DesignSystemModule } from './modules/DesignSystemModule';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<App />}>
        <Route path="/" element={<>TODO: Make this landing page</>} />
        <Route path="/design" element={<DesignSystemModule />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
