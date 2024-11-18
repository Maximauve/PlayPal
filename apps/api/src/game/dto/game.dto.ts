import { IsArray, IsEmpty, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

import { I18nTranslations } from "@/generated/i18n.generated";

export class GameDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_STRING') })
  name: string;
  
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_STRING') })
  description: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_INT') })
  minPlayers: number;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_INT') })
  maxPlayers: number;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_INT') })
  difficulty: number;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_STRING') })
  duration: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_INT') })
  minYear: number;

  @IsOptional()
  @IsEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.IS_EMPTY') })
  image?: string;

  @IsOptional()
  @IsArray({ message: i18nValidationMessage<I18nTranslations>('validation.IS_NOT_ARRAY') })
  @IsUUID('all', { each: true, message: i18nValidationMessage<I18nTranslations>('validation.IS_NOT_UUID') })
  readonly tagIds?: string[];
}