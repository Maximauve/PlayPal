import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Rule } from "@/rule/rule.entity";
import { RuleService } from "@/rule/service/rule.service";
import { TranslationService } from "@/translation/translation.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rule]),
  ],
  controllers: [],
  providers: [RuleService, TranslationService],
  exports: [],
})

export class RuleModule { }