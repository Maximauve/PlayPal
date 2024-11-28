import { type I18n } from "i18n-js";
import { useContext } from "react";

import { i18nContext, type I18nContextType } from "@/context/i18n/i18n-provider";

export default function useTranslation(): I18n {
  const context = useContext<I18nContextType>(i18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within an AppProvider');
  }

  return context.i18n;
}
