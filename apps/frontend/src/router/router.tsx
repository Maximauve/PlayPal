import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/_layout/main-layout";
import HomePage from "@/router/pages/home-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    children: [
      {
        path: "",
        element: <HomePage/>
      }
    ]
  }
]);

export default router;
