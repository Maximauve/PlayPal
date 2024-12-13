import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@playpal/schemas';

import { UserAuthGuard } from '@/auth/guards/user-auth.guard';
import { TranslationService } from '@/translation/translation.service';
import { UserService } from '@/user/service/user.service';
import { RequestWithUser } from '@/user/types/RequestWithUser';

@Injectable()
export class AdminGuard extends UserAuthGuard {
  constructor(
    protected readonly translationsService: TranslationService,
    protected readonly userService: UserService,
  ) {
    super(translationsService, userService);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = (await super.canActivate(context));
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
