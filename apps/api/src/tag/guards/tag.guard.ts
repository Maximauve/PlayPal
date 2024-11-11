import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Tag } from "@/tag/tag.entity";
import { RequestWithTag } from "@/tag/types/RequestWithTag";
import { TranslationService } from "@/translation/translation.service";

@Injectable()
export class TagGuard implements CanActivate {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private readonly translationService: TranslationService
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithTag>();
    const tagId = request.params.tagId;

    const tag = await this.tagRepository.findOne({
      where: {
        id: tagId,
      }
    });

    if (!tag) {
      throw new HttpException(this.translationService.translate('error.TAG_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    request.tag = tag;
    return true;
  }

}