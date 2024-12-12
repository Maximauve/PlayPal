import { Optional } from "@nestjs/common";
import { LoanStatus } from "@playpal/schemas";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

import { I18nTranslations } from "@/generated/i18n.generated";  

export class LoanDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_STRING') })
  gameId: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @Optional()
  status?: LoanStatus;
}
