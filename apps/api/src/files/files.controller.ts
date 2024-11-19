import { Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Express, Response } from 'express';

import { FileUploadService } from '@/files/files.service';
import { TranslationService } from '@/translation/translation.service';

@Controller('files')
@ApiTags('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService, private readonly translationService: TranslationService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'File successfully uploaded' })
  @ApiBadRequestResponse({ description: 'File is missing or invalid' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const key = await this.fileUploadService.uploadFile(file);
    return { message: await this.translationService.translate("files.FILE_UPLOAD"), key };
  }

  @Get(':key')
  @ApiOperation({ summary: 'Retrieve a file by its key' })
  @ApiParam({ name: 'key', description: 'The unique key of the file to retrieve' })
  @ApiOkResponse({ description: 'File stream returned successfully' })
  @ApiBadRequestResponse({ description: 'File not found' })
  async getFile(@Param('key') key: string, @Res() response: Response) {
    const fileStream = await this.fileUploadService.getFile(key);
    fileStream.pipe(response);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete a file by its key' })
  @ApiParam({ name: 'key', description: 'The unique key of the file to delete' })
  @ApiOkResponse({ description: 'File successfully deleted' })
  @ApiNotFoundResponse({ description: 'File not found' })
  async deleteFile(@Param('key') key: string): Promise<string> {
    await this.fileUploadService.deleteFile(key);
    return this.translationService.translate("files.FILE_UPLOAD");
  }
}
