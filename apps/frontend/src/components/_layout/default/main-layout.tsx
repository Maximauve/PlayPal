import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

import Footer from "@/components/_layout/default/footer";
import Navbar from "@/components/_layout/default/navbar";

export default function MainLayout(): React.JSX.Element {
  return (
    <Fragment>
      <Navbar />
      <Outlet />
      <Footer />
    </Fragment>
  );
}
