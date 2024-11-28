import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import AuthProvider from '@/context/auth/auth-provider';
import I18nProvider from '@/context/i18n/i18n-provider';
import "@/assets/styles/index.scss";
import router from '@/routes/router';
import { setupStore } from '@/store';


const store = setupStore();

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <I18nProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </I18nProvider>
    </ReduxProvider>
  </StrictMode>,
);
