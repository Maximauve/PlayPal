import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "@/components/_layout/admin/admin-layout";
import MainLayout from "@/components/_layout/default/main-layout";
import GameList from "@/components/game-list";
import HomePage from "@/routes/pages/home-page";
import SearchPage from "@/routes/pages/search-page";

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
  },
  {
    path: "/search/",
    element: <MainLayout/>,
    children: [
      {
        path: "",
        element: <SearchPage />
      }
    ]
  }
]);

export default router;
