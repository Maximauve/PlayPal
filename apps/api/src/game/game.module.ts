import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "@playpal/schemas";

import { FileUploadService } from "@/files/files.service";
import { GameController } from "@/game/controller/game.controller";
import { GameService } from "@/game/service/game.service";
import { ProductModule } from "@/product/product.module";
import { TagModule } from "@/tag/tag.module";
import { TranslationService } from "@/translation/translation.service";
import { UsersModule } from "@/user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Game]), forwardRef(() => UsersModule), forwardRef(() => TagModule), forwardRef(() => ProductModule)],
  controllers: [GameController],
  providers: [GameService, TranslationService, FileUploadService],
  exports: [GameService],
})
export class GameModule { }
