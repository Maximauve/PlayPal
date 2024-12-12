import React from "react";
import { NavLink } from "react-router-dom";

import useTranslation from "@/hooks/use-translation";

export default function AdminNavbar(): React.JSX.Element {
  const i18n = useTranslation();
  return (
    <main className="admin-navbar">
      <div className="nav-logo">
        <p> {i18n.t("admin.navbar.title")} </p>
      </div>
      <div className="nav-links">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          end
        >
          {i18n.t("admin.navbar.dashboard")}
        </NavLink>
        <NavLink
          to="/admin/game"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          {i18n.t("admin.navbar.game-list")}
        </NavLink>
        <NavLink
          to="/admin/loan"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          {i18n.t("admin.navbar.loan-waiting")}
        </NavLink>
        <NavLink
          to="/admin/tag"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          {i18n.t("admin.navbar.tag")}
        </NavLink>      
      </div>
    </main>
  );
}
