import { I18n } from "i18n-js";
import { createContext, type PropsWithChildren } from "react";

import { initI18n } from "@/i18n/i18n-service";

export interface I18nContextType {
  changeLocale: (locale: string) => void;
  i18n: I18n;
}

export const i18nContext = createContext<I18nContextType>({
  i18n: new I18n(),
  changeLocale: () => null
}); 

export default function I18nProvider({ children }: PropsWithChildren) {
  const i18n = initI18n();

  const changeLocale = (locale: string) => {
    i18n.locale = locale;
  };

  return (
    <i18nContext.Provider value={{ i18n, changeLocale }}>
      {children}
    </i18nContext.Provider>
  );
}
