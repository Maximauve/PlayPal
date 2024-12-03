import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "@/components/_layout/admin/admin-layout";
import MainLayout from "@/components/_layout/default/main-layout";
import UserPageLayout from "@/components/_layout/user-page-layout";
import GameList from "@/components/game-list";
import HomePage from "@/routes/pages/home-page";
import SearchPage from "@/routes/pages/search-page";
import UserHistoryPage from "@/routes/pages/user-history-page";
import UserProfilePage from "@/routes/pages/user-profile-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout  />,
    children: [
      {
        path: "",
        element: <HomePage />
      },
      {
        path: "/user/",
        element: <UserPageLayout />,
        children: [
          {
            path: "profile",
            element: <UserProfilePage />
          },
          {
            path: "history",
            element: <UserHistoryPage />
          },
        ]
      }
    ]
  },
  {
    path: "/admin/",
    element: <AdminLayout />,
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
