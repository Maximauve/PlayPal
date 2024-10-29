import {Catch, ExceptionFilter, UnauthorizedException, ArgumentsHost} from '@nestjs/common';
import {Response} from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(401).json({
      statusCode: 401,
      message: 'Tu n\'es pas connecté',
    });
  }
}