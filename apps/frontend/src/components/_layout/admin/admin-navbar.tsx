import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminNavbar(): React.JSX.Element {
  return (
    <main className="admin-navbar">
      <div className="nav-logo">
        <p>PlayPal</p>
      </div>
      <div className="nav-links">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          end
        >
          Tableau de Bord
        </NavLink>
        <NavLink
          to="/admin/games"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          Liste de Jeux
        </NavLink>
        <NavLink
          to="/admin/loans"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          Liste de Prêts
        </NavLink>
        <NavLink
          to="/admin/wishlist"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          Wishlist
        </NavLink>      
      </div>
    </main>
  );
}
