import { type I18n } from "i18n-js";
import { useContext } from "react";

import { i18nContext, type I18nContextType } from "@/i18n/i18n-provider";

export default function useTranslation(): I18n {
  const appContext = useContext<I18nContextType>(i18nContext);

  if (!appContext) {
    throw new Error('useTranslation must be used within an AppProvider');
  }

  return appContext.i18n;
}
