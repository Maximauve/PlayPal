import { useContext } from "react";

import { type AppUser, authContext, type AuthContextType } from "@/context/auth/auth-provider";

interface ReturnType {
  refreshUser: () => void;
  user: AppUser | null;
}

export default function useAuth(): ReturnType {
  const context = useContext<AuthContextType>(authContext);

  if (!context) {
    throw new Error('useAuth must be used within an AppProvider');
  }

  return {
    user: context.user,
    refreshUser: context.refreshUser,
  };
}
