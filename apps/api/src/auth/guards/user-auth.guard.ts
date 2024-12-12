import { BadRequestException, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { TranslationService } from '@/translation/translation.service';
import { UserService } from '@/user/service/user.service';
import { RequestWithUser } from '@/user/types/RequestWithUser';

@Injectable()
export class UserAuthGuard extends JwtAuthGuard {
  constructor(
    protected readonly translationsService: TranslationService,
    protected readonly userService: UserService
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = (await super.canActivate(context)) as boolean;
    if (!isAuthenticated) {
      return false;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    if (!request.user) {
      throw new BadRequestException(await this.translationsService.translate('error.USER_NOT_FOUND'));
    }

    const user = this.userService.findOneUser(request.user.id);

    if(!user) {
      throw new NotFoundException(await this.translationsService.translate('error.USER_NOT_FOUND'));
    }
    return true;
  }
}
