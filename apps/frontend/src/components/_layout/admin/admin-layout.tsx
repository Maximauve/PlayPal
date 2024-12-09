import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

import AdminNavbar from "@/components/_layout/admin/admin-navbar";

export default function AdminLayout(): React.JSX.Element {
  return (
    <Fragment>
      <div className="admin">
        <div className="admin-layout">
          <AdminNavbar />
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
}
