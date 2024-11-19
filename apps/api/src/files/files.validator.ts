import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { Express } from "express";
// Make an error with nest, ignoring...
// eslint-disable-next-line unicorn/import-style
import { extname } from 'node:path';

import { TranslationService } from '@/translation/translation.service';
import { imageRegex } from '@/utils/regex.variable';

@Injectable()
export class ParseFilePipeDocument implements PipeTransform {
  constructor(private readonly translationService: TranslationService) {}

  async transform(value: Express.Multer.File): Promise<Express.Multer.File | void> {
    if (!value) {
      return;
    }
    const extension = extname(value.originalname).toLowerCase();
    if (!imageRegex.test(extension)) {
      throw new HttpException(await this.translationService.translate("error.EXTENSION_NOT_ALLOWED"), HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}