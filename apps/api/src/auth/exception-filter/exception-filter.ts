import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException, } from '@nestjs/common';
import { Response } from 'express';

import { TranslationService } from '@/translation/translation.service';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  constructor (private readonly translationService: TranslationService) {}

  async catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    response.status(401).json({
      statusCode: 401,
      message: await this.translationService.translate('error.UNAUTHORIZED'),
    });
  }
}