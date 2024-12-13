import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import useTranslation from "@/hooks/use-translation";

const routes = [
  { text: 'admin.navbar.dashboard', path: '/admin/dashboard' },
  { text: 'admin.navbar.game-list', path: '/admin/game' },
  { text: 'admin.navbar.product-list', path: '/admin/products' },
  { text: 'admin.navbar.loan-list', path: '/admin/loan' },
  { text: 'admin.navbar.tag', path: '/admin/tag' },
];

export default function AdminNavbar(): React.JSX.Element {
  const i18n = useTranslation();
  const navigate = useNavigate();
  return (
    <main className="col-[1/2] w-full h-full bg-background-dark rounded-2xl p-2 shadow-admin">
      <div className="flex items-center justify-center p-2 rounded-lg m-1">
        <p className="text-2xl" onClick={() => navigate('/')}> {i18n.t("admin.navbar.title")} </p>
      </div>
      <div className="flex flex-col gap-1 p-2 rounded-lg m-1">
        { routes.map(route => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) => ('p-2 rounded-lg m-2 cursor-pointer transition-colors duration-300' + (isActive ? ' bg-button-active text-text-dark' : ' bg-button-default hover:bg-button-active hover:text-text-dark'))}
          >
            {i18n.t(route.text)}
          </NavLink>
        ))}
      </div>
    </main>
  );
}
