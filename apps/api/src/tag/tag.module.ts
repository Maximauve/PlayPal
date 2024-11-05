import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TagController } from "@/tag/controller/tag.controller";
import { TagService } from "@/tag/service/tag.service";
import { Tag } from "@/tag/tag.entity";
import { TranslationService } from "@/translation/translation.service";

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService, TranslationService],
  exports: [TagService]
})
export class TagModule { }