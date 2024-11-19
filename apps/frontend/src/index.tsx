import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import I18nProvider from '@/i18n/i18n-provider';
import router from '@/router/router';
import "@/assets/styles/index.scss";

// Disabled eslint rule because document cannot be undefined
// eslint-disable-next-line no-undef
createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  </StrictMode>,
);
