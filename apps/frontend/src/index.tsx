import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import router from '@/router/router';
import "@/assets/styles/index.scss";

// Disabled eslint rule because document cannot be undefined
// eslint-disable-next-line no-undef
createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
