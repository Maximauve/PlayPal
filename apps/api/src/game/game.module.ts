import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GameController } from "@/game/controller/game.controller";
import { Game } from "@/game/game.entity";
import { GameService } from "@/game/service/game.service";
import { TranslationService } from "@/translation/translation.service";
import { UsersModule } from "@/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Game]), forwardRef(() => UsersModule)],
  controllers: [GameController],
  providers: [GameService, TranslationService],
  exports: [GameService],
})
export class GameModule { }