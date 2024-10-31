import { Injectable } from '@nestjs/common';
import { I18nService, TranslateOptions } from 'nestjs-i18n';

type TranslateFunction = (key: string, options?: TranslateOptions) => Promise<string>;

@Injectable()
export class TranslationService {
  private readonly translateFn: TranslateFunction;

  constructor(private readonly i18n: I18nService) {}

  async translate(key: string, options?: TranslateOptions): Promise<string> {
    try {
      return await this.translateFn(key, options);
    } catch (error) {
      console.error("Translation error:", error);
      throw new Error('Erreur de traduction');
    }
  }
}