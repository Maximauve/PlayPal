import { Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';

import { FileUploadService } from '@/files/files.service';
import { TranslationService } from '@/translation/translation.service';

@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService, private readonly translationService: TranslationService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const key = await this.fileUploadService.uploadFile(file);
    return { message: await this.translationService.translate("files.FILE_UPLOAD"), key };
  }

  @Get(':key')
  async getFile(@Param('key') key: string, @Res() response: Response) {
    const fileStream = await this.fileUploadService.getFile(key);
    fileStream.pipe(response);
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string): Promise<string> {
    await this.fileUploadService.deleteFile(key);
    return this.translationService.translate("files.FILE_UPLOAD");
  }
}
