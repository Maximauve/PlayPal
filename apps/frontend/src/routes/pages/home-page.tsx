import React from 'react';

import useTranslation from '@/hooks/use-translation';

export default function HomePage(): React.JSX.Element {
  const i18n = useTranslation();
  return (
    <p className="text-3xl w-full h-40 flex justify-center items-center">{i18n.t('home.title')}</p>
  );
}
