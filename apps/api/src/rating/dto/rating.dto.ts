import { IsNotEmpty, IsString, Max, Min } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

import { I18nTranslations } from "@/generated/i18n.generated";

export class RatingDto {
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_STRING') })
  comment: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @Min(1, { message: i18nValidationMessage<I18nTranslations>('validation.MIN_NUMBER') })
  @Max(5, { message: i18nValidationMessage<I18nTranslations>('validation.MAX_NUMBER') })
  note: number;
}