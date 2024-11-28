import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

import { I18nTranslations } from "@/generated/i18n.generated";

export class RegisterDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_STRING') })
  @MinLength(3, { message: i18nValidationMessage<I18nTranslations>('validation.MIN') })
  username: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_STRING') })
  @IsEmail({}, { message: i18nValidationMessage<I18nTranslations>('validation.INVALID_EMAIL') })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_STRING') })
  @MinLength(6, { message: i18nValidationMessage<I18nTranslations>('validation.MIN') })
  password: string;

  @IsOptional()
  @IsEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.IS_EMPTY') })
  image?: string;
}
