import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game, Rule } from "@playpal/schemas";

import { AuthModule } from "@/auth/auth.module";
import { GameModule } from "@/game/game.module";
import { RuleController } from "@/rule/controller/rule.controller";
import { RuleService } from "@/rule/service/rule.service";
import { TranslationService } from "@/translation/translation.service";
import { UsersModule } from "@/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rule]),
    TypeOrmModule.forFeature([Game]),
    forwardRef(() => GameModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule)
  ],
  controllers: [RuleController],
  providers: [RuleService, TranslationService],
  exports: [RuleService],
})

export class RuleModule { }
