import { Injectable } from '@nestjs/common';
import { I18nService, TranslateOptions } from 'nestjs-i18n';

@Injectable()
export class TranslationService {

  constructor(private readonly i18n: I18nService) {}

  async translate(key: string, options?: TranslateOptions): Promise<string> {
    try {
      return await this.i18n.translate(key, options);
    } catch (error) {
      console.error("Translation error:", error);
      throw new Error('Erreur de traduction');
    }
  }
}