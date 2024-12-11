import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "@/components/_layout/admin/admin-layout";
import GameLayout from "@/components/_layout/admin/game-layout";
import TagLayout from "@/components/_layout/admin/tag-layout";
import MainLayout from "@/components/_layout/default/main-layout";
import UserPageLayout from "@/components/_layout/user-page-layout";
import AdminGuard from "@/guard/admin-guard";
import GamePage from "@/routes/pages/game-page";
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
    element: (
      <AdminGuard>
        <AdminLayout/>
      </AdminGuard>
    ),
    children: [
      {
        path: "",
        element: <div>Tableau de Bord</div>, // Remplacez par un vrai composant
      },
      {
        path: "dashboard",
        element: <div>Tableau de Bord</div>, // Remplacez par un vrai composant
      },
      {
        path: "game",
        element: <GameLayout />,
      },
      {
        path: "loan",
        element: <div>Liste de Prêts</div>, // Remplacez par un vrai composant
      },
      {
        path: "tag",
        element: <TagLayout />, // Remplacez par un vrai composant
      },
    ],
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
  },
  {
    path: "/game/:id",
    element: <MainLayout/>,
    children: [
      {
        path: "",
        element: <GamePage />
      }
    ]
  },
]);

export default router;
