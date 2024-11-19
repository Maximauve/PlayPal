import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Game } from "@/game/game.entity";
import { GameModule } from "@/game/game.module";
import { TagController } from "@/tag/controller/tag.controller";
import { TagService } from "@/tag/service/tag.service";
import { Tag } from "@/tag/tag.entity";
import { TranslationService } from "@/translation/translation.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([Game]),
    forwardRef(() => GameModule)
  ],
  controllers: [TagController],
  providers: [TagService, TranslationService],
  exports: [TagService]
})
export class TagModule { }