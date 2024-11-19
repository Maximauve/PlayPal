import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameRequest } from "@/game/decorators/game.decorator";
import { Game } from "@/game/game.entity";
import { GameService } from "@/game/service/game.service";
import { Rule } from "@/rule/rule.entity";
import { RuleService } from "@/rule/service/rule.service";
import { TranslationService } from "@/translation/translation.service";

@UseGuards(JwtAuthGuard)
@ApiTags('rule')
@ApiParam({ name: 'gameId', description: 'ID of game', required: true })
@ApiUnauthorizedResponse()
@ApiNotFoundResponse()
@Controller('/games/:gameId/rule')
export class RuleController {
    
  constructor(
    private readonly ruleService: RuleService,
    private readonly gameService: GameService,
    private readonly translationService: TranslationService
  ) { }

  @Get("")
  @ApiOperation({ summary: 'Returns all game\'s rules' })
  @ApiOkResponse({ type: Rule, isArray: true })
  async getAllRules(@GameRequest() game: Game): Promise<Rule[]> {
    return this.ruleService.getAllRules(game.id);
  }

}