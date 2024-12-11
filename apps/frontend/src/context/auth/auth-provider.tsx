import { type LightUser } from "@playpal/schemas";
import { createContext, type PropsWithChildren, useEffect, useState } from "react";

import { useRefreshUserQuery } from "@/services/user";

export type AppUser = Partial<LightUser> & { loading?: boolean };

export interface AuthContextType {
  refreshUser: () => void;
  user: AppUser | null;
}

export const authContext = createContext<AuthContextType>({
  user: null,
  refreshUser: () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>({ loading: true });
  const { isError, isLoading, data, error, refetch } = useRefreshUserQuery();

  const refreshUser = () => {
    refetch();
  };

  useEffect(() => {
    if (isLoading) {
      setUser({ loading: true });
      return;
    }

    if (isError) {
      setUser(null);
      console.error("Error while fetching user", error);
      return;
    }

    if (data) {
      setUser({ username: data.username, role: data.role, image: data.image });
    } 

  }, [isError, isLoading, data, error]);

  return (
    <authContext.Provider value={{ user, refreshUser }}>
      {children}
    </authContext.Provider>
  );
}
