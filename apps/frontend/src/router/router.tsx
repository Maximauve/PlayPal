import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "@/components/_layout/admin-layout";
import GameList from "@/components/_layout/game-list";
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
  },
  {
    path: "/admin/",
    element: <AdminLayout/>,
    children: [
      {
        path: "",
        element: <GameList/>
      }
    ]
  }
]);

export default router;
