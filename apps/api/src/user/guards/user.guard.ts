import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TranslationService } from "@/translation/translation.service";
import { RequestWithParamUser } from "@/user/types/RequestWithParamUser";
import { User } from "@/user/user.entity";
import { uuidRegex } from "@/utils/regex.variable";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly translationsService: TranslationService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithParamUser>();
    const userId = request.params.userId;

    if (!uuidRegex.test(userId)) {
      throw new HttpException(await this.translationsService.translate("error.ID_INVALID"), HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        rating: true,
        product: true,
        loan: true
      }
    });
    if (!user) {
      throw new HttpException(await this.translationsService.translate("error.RATING_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }

    request.user = user;
    return true;
  }
}