import { createBrowserRouter, Navigate } from "react-router-dom";

import AdminLayout from "@/components/_layout/admin/admin-layout";
import GameLayout from "@/components/_layout/admin/game-layout";
import LoanLayout from "@/components/_layout/admin/loan-layout";
import ProductLayout from "@/components/_layout/admin/product-layout";
import TagLayout from "@/components/_layout/admin/tag-layout";
import MainLayout from "@/components/_layout/default/main-layout";
import UserPageLayout from "@/components/_layout/user-page-layout";
import AdminGuard from "@/guard/admin-guard";
import GamePage from "@/routes/pages/game-page";
import HomePage from "@/routes/pages/home-page";
import SearchPage from "@/routes/pages/search-page";
import UserHistoryPage from "@/routes/pages/user-history-page";
import UserProfilePage from "@/routes/pages/user-profile-page";
import WishlistPage from "@/routes/pages/wishlist-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <HomePage />
      },
      {
        path: "/games/:id",
        element: <GamePage />
      },
      {
        path: "/search/",
        element: <SearchPage />
      },
      {
        path: "user",
        element: <UserPageLayout />,
        children: [
          {
            path: "",
            element: <UserProfilePage />
          },
          {
            path: "history",
            element: <UserHistoryPage />
          },
        ]
      },
      {
        path: "search",
        element: <SearchPage />
      },
      {
        path: "game",
        children: [
          {
            path: ":id",
            element: <GamePage />
          }
        ]
      },
      {
        path: "wishlist",
        element: <WishlistPage />
      }
    ]
  },
  {
    path: "/admin",
    element: (
      <AdminGuard>
        <AdminLayout/>
      </AdminGuard>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/admin/dashboard" />
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
        element: <LoanLayout />,
      },
      {
        path: "tag",
        element: <TagLayout />,
      },
      {
        path: "products",
        element: <ProductLayout />, // Remplacez par un vrai composant
      },
    ],
  },
]);

export default router;