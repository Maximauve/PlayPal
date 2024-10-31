import { Injectable } from '@nestjs/common';
import { I18nService, TranslateOptions } from 'nestjs-i18n';

@Injectable()
export class TranslationService {
  constructor(private readonly i18n: I18nService) {}

  async translate(key: string, options?: TranslateOptions): Promise<string> {
    return this.i18n.translate(key, options);
  }
}