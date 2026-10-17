import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import '../index.css';
import AdminPanel from './admin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AdminPanel />
    </HelmetProvider>
  </StrictMode>,
);
