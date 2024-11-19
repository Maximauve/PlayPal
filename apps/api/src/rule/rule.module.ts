import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Game } from "@/game/game.entity";
import { GameModule } from "@/game/game.module";
import { RuleController } from "@/rule/controller/rule.controller";
import { Rule } from "@/rule/rule.entity";
import { RuleService } from "@/rule/service/rule.service";
import { TranslationService } from "@/translation/translation.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rule]),
    TypeOrmModule.forFeature([Game]),
    forwardRef(() => GameModule)
  ],
  controllers: [RuleController],
  providers: [RuleService, TranslationService],
  exports: [RuleService],
})

export class RuleModule { }