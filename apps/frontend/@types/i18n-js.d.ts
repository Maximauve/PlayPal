/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'i18n-js';
import { type DateTime, type Dict, type FormatNumberOptions, type I18nOptions, type Locales, type MissingPlaceholderHandler, type MissingTranslation, type NullPlaceholderHandler, type NumberToCurrencyOptions, type NumberToDelimitedOptions, type NumberToHumanOptions, type NumberToHumanSizeOptions, type NumberToPercentageOptions, type NumberToRoundedOptions, type Numeric, type OnChangeHandler, type Pluralization, type Scope, type StrftimeOptions, type TimeAgoInWordsOptions, type ToSentenceOptions, type TranslateOptions } from 'i18n-js';

import { type WordingKey } from '@/i18n/i18n-service';

//* What is changed here ?
// The class declaration from nodes_modules/i18n-js/index.d.ts has been imported here
// only the t & translate functions have been overriden to accept WordingKey as a parameter
declare module 'i18n-js' {
  export declare class I18n {
    private _locale;
    private _defaultLocale;
    private _version;
    onChangeHandlers: OnChangeHandler[];
    defaultSeparator: string;
    enableFallback: boolean;
    locales: Locales;
    pluralization: Pluralization;
    missingBehavior: string;
    missingPlaceholder: MissingPlaceholderHandler;
    missingTranslationPrefix: string;
    nullPlaceholder: NullPlaceholderHandler;
    missingTranslation: MissingTranslation;
    placeholder: RegExp;
    translations: Dict;
    transformKey: (key: string) => string;
    interpolate: typeof interpolate;
    constructor(translations?: Dict, options?: Partial<I18nOptions>);
    store(translations: Dict): void;
    get locale(): string;
    set locale(newLocale: string);
    get defaultLocale(): string;
    set defaultLocale(newLocale: string);
    translate<T = string>(scope: WordingKey, options?: TranslateOptions): T | string;
    t: <T = string>(scope: WordingKey, options?: TranslateOptions) => T | string;
    pluralize(count: number, scope: Scope, options?: TranslateOptions): string;
    p: (count: number, scope: Scope, options?: TranslateOptions) => string;
    localize(type: string, value: Date | number | string | null | undefined, options?: Dict): string;
    l: (type: string, value: Date | number | string | null | undefined, options?: Dict) => string;
    toTime(scope: Scope, input: DateTime): string;
    numberToCurrency(input: Numeric, options?: Partial<NumberToCurrencyOptions>): string;
    numberToPercentage(input: Numeric, options?: Partial<NumberToPercentageOptions>): string;
    numberToHumanSize(input: Numeric, options?: Partial<NumberToHumanSizeOptions>): string;
    numberToHuman(input: Numeric, options?: Partial<NumberToHumanOptions>): string;
    numberToRounded(input: Numeric, options?: Partial<NumberToRoundedOptions>): string;
    numberToDelimited(input: Numeric, options?: Partial<NumberToDelimitedOptions>): string;
    withLocale(locale: string, callback: () => void): Promise<void>;
    strftime(date: Date, format: string, options?: Partial<StrftimeOptions>): string;
    update(path: string, override: any, options?: {
      strict: boolean;
    }): void;
    toSentence(items: any[], options?: Partial<ToSentenceOptions>): string;
    timeAgoInWords(fromTime: DateTime, toTime: DateTime, options?: TimeAgoInWordsOptions): string;
    distanceOfTimeInWords: (fromTime: DateTime, toTime: DateTime, options?: TimeAgoInWordsOptions) => string;
    onChange(callback: OnChangeHandler): () => void;
    get version(): number;
    formatNumber(input: Numeric, options?: Partial<FormatNumberOptions>): string;
    get(scope: Scope): any;
    private runCallbacks;
    private hasChanged;
  }
}
