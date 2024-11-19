import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Rule } from "@/rule/rule.entity";
import { RequestWithRule } from "@/rule/types/RequestWithRule";
import { TranslationService } from "@/translation/translation.service";
import { uuidRegex } from "@/utils/regex.variable";

@Injectable()
export class RuleGuard implements CanActivate {
  constructor(
    @InjectRepository(Rule)
    private ruleRepository: Repository<Rule>,
    private readonly translationService: TranslationService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithRule>();
    const ruleId = request.params.ruleId;

    if (!uuidRegex.test(ruleId)) {
      throw new HttpException(this.translationService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }

    const rule = await this.ruleRepository.findOne({
      where: {
        id: ruleId,
      }
    });

    if (!rule) {
      throw new HttpException(this.translationService.translate('error.RULE_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    request.rule = rule;
    return true;
  }
}