import { Module } from '@nestjs/common';

import { FileUploadController } from '@/files/files.controller';
import { FileUploadService } from '@/files/files.service';
import { TranslationService } from '@/translation/translation.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, TranslationService],
})
export class FileUploadModule {}
