import React from 'react';
import { Outlet } from 'react-router-dom';

import UserPageSidebar from '@/components/_layout/user-page-sidebar';

// import useTranslation from "@/hooks/use-translation";

export default function UserPageLayout(): React.JSX.Element {
//   const i18n = useTranslation();
  return (
    <div className="user-page grid grid-cols-7 grid-rows-1 h-[calc(100vh-64px)]">
      <div className='col-span-1 bg-slate-50 h-full'>
        <UserPageSidebar />
      </div>
      <div className='col-start-2 col-span-6 bg-stone-100 h-full overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
}
