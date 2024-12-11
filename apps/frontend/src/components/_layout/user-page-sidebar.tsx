import React from 'react';
import { NavLink } from 'react-router-dom';

export default function UserPageSidebar(): React.JSX.Element {

  return (
    <div className="user-page-sidebar h-full bg-neutral-700 text-2xl">
      <NavLink to="/user" className={({ isActive }) => isActive ? "first:bg-[#CDCDCD]" : ""}  >
        <div className="flex justify-center items-center h-24 w-full border-b-2 border-slate-50 hover:bg-cyan-600"> Edit Profil</div>
      </NavLink>
      <NavLink to="/user/history" className={({ isActive }) => isActive ? "first:bg-[#CDCDCD]" : ""} >
        <div className="flex justify-center items-center h-24 w-full border-b-2 border-slate-50 hover:bg-cyan-600"> History</div>
      </NavLink>
    </div>
  );
}
