import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AuthProvider from '@/context/auth/auth-provider';
import "@/assets/styles/index.scss";
import I18nProvider from '@/context/i18n/i18n-provider';
import router from '@/routes/router';
import { setupStore } from '@/store';
import 'react-toastify/dist/ReactToastify.css';


const store = setupStore();

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <I18nProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </AuthProvider>
      </I18nProvider>
    </ReduxProvider>
  </StrictMode>,
);
