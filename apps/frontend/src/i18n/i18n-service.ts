import { I18n } from 'i18n-js';

import translations from '@/assets/translations';

type PathsToStringProperties<T> = T extends string ? [] : {
  [K in Extract<keyof T, string>]: [K, ...PathsToStringProperties<T[K]>]
}[Extract<keyof T, string>];

type Join<T extends string[], D extends string> =
    T extends [] ? never :
      T extends [infer F] ? F :
        T extends [infer F, ...infer R] ?
          F extends string ? 
    `${F}${D}${Join<Extract<R, string[]>, D>}` : never : string;    

export type LanguageTag = keyof typeof translations;
export type WordingKey = Join<PathsToStringProperties<typeof translations[LanguageTag]>, '.'>;

const acceptedLocales: Record<string, LanguageTag> = {
  FR: 'fr-FR',
};

export function initI18n(): I18n {
  const i18n = new I18n(translations);
  i18n.defaultLocale = acceptedLocales.FR;
  i18n.locale = acceptedLocales.FR;

  return i18n;
}

export function changeLocale(i18n: I18n, locale: string) {
  i18n.locale = locale;
}
