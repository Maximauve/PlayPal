import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App.tsx';

// eslint-disable-next-line no-undef
createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
