import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException, } from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    response.status(401).json({
      statusCode: 401,
      message: 'Tu n\'es pas connecté',
    });
  }
}