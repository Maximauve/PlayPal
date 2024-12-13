import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

import AdminNavbar from "@/components/_layout/admin/admin-navbar";

export default function AdminLayout(): React.JSX.Element {
  return (
    <Fragment>
      <div className="grid grid-cols-[250px_1fr] gap-4 m-6 place-items-center w-[calc(100vw-3rem)] h-[calc(100vh-3rem)] rounded-2xl p-4 bg-background-dark shadow-md">
        <AdminNavbar />
        <section className="flex flex-col justify-start w-full h-full gap-4">
          <Outlet />
        </section>
      </div>
    </Fragment>
  );
}
