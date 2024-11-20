import { createContext, type PropsWithChildren } from "react";

export interface AuthContextType { }

export const authContext = createContext<AuthContextType>({
}); 

export default function I18nProvider({ children }: PropsWithChildren) {

  return (
    <authContext.Provider value={{ }}>
      {children}
    </authContext.Provider>
  );
}
