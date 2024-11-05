import { IsNotEmpty, MaxLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

import { I18nTranslations } from "@/generated/i18n.generated";

export class TagDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @MaxLength(100, { message: i18nValidationMessage<I18nTranslations>('validation.MAX', { length: 100 }) })
  name: string;
}