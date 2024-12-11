import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@playpal/schemas';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TranslationService } from '@/translation/translation.service';
import { RequestWithUser } from '@/user/types/RequestWithUser';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  constructor(
    private readonly translationsService: TranslationService
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = (await super.canActivate(context)) as boolean;
    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || user.role !== Role.Admin) {
      throw new ForbiddenException(await this.translationsService.translate('error.PERMISSION_DENIED'));
    }

    return true;
  }
}
