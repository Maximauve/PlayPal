<<<<<<< HEAD
<<<<<<< HEAD
import { forwardRef, Module } from "@nestjs/common";
=======
import { Module } from "@nestjs/common";
>>>>>>> db782ed (feat(api/games): WIP add games crud)
=======
import { forwardRef, Module } from "@nestjs/common";
>>>>>>> 2c1d836 (feat(game): finish game and add TU)
import { TypeOrmModule } from "@nestjs/typeorm";

import { GameController } from "@/game/controller/game.controller";
import { Game } from "@/game/game.entity";
import { GameService } from "@/game/service/game.service";
import { TranslationService } from "@/translation/translation.service";
<<<<<<< HEAD
<<<<<<< HEAD
import { UsersModule } from "@/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Game]), forwardRef(() => UsersModule)],
=======

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
>>>>>>> db782ed (feat(api/games): WIP add games crud)
=======
import { UsersModule } from "@/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Game]), forwardRef(() => UsersModule)],
>>>>>>> 2c1d836 (feat(game): finish game and add TU)
  controllers: [GameController],
  providers: [GameService, TranslationService],
  exports: [GameService],
})
<<<<<<< HEAD
<<<<<<< HEAD
export class GameModule { }
=======
export class GamesModule { }
>>>>>>> db782ed (feat(api/games): WIP add games crud)
=======
export class GameModule { }
>>>>>>> 2c1d836 (feat(game): finish game and add TU)
