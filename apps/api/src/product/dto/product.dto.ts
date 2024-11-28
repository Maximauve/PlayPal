import { State } from "@playpal/schemas";
import { IsEnum, IsNotEmpty } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

import { I18nTranslations } from "@/generated/i18n.generated";

export class ProductDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsEnum(State, { message: i18nValidationMessage<I18nTranslations>('validation.IS_STATE') })
  state: State;
}
