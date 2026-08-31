import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import { RouterProvider } from './lib/router';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>,
);
