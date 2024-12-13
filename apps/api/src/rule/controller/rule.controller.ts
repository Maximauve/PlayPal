import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Game, Rule } from "@playpal/schemas";

import { UserAuthGuard } from "@/auth/guards/user-auth.guard";
import { GameRequest } from "@/game/decorators/game.decorator";
import { GameGuard } from "@/game/guards/game.guard";
import { GameService } from "@/game/service/game.service";
import { RuleRequest } from "@/rule/decorators/rule.decorator";
import { RuleDto } from "@/rule/dto/rule.dto";
import { RuleUpdatedDto } from "@/rule/dto/ruleUpdated.dto";
import { RuleGuard } from "@/rule/guards/rule.guard";
import { RuleService } from "@/rule/service/rule.service";
import { TranslationService } from "@/translation/translation.service";

@UseGuards(UserAuthGuard, GameGuard)
@ApiTags('rule')
@ApiParam({ name: 'gameId', description: 'ID of game', required: true })
@ApiUnauthorizedResponse({ description: "User not connected" })
@ApiNotFoundResponse({ description: "Game not found" })
@Controller('/games/:gameId/rule')
export class RuleController {
    
  constructor(
    private readonly ruleService: RuleService,
    private readonly gameService: GameService,
    private readonly translationService: TranslationService
  ) { }

  @Get("")
  @ApiOperation({ summary: 'Returns all game\'s rules' })
  @ApiOkResponse({ description: 'Rules found successfully', type: Rule, isArray: true })
  async getAllRules(@GameRequest() game: Game): Promise<Rule[]> {
    return this.ruleService.getAllRules(game.id);
  }

  @UseGuards(RuleGuard)
  @Get("/:ruleId")
  @ApiParam({ name: 'ruleId', description: 'ID of rule', required: true })
  @ApiOperation({ summary: "Return a rule" })
  @ApiOkResponse({ description: "Rule found successfully", type: Rule })
  @ApiNotFoundResponse({ description: "Game or rule is not found" })
  getRule(@RuleRequest() rule: Rule): Rule {
    return rule;
  }

  @Post("")
  @ApiOperation({ summary: "Create the rule of a game" })
  @ApiOkResponse({ type: Rule, description: "Rule created successfully" })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred while creating the rule" })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  @ApiNotFoundResponse({ description: "Game not found" })
  async createRule(@GameRequest() game: Game, @Body() body: RuleDto): Promise<Rule> {
    const rule = await this.ruleService.create(game, body);
    if (!rule) {
      throw new HttpException(await this.translationService.translate("error.RULE_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return rule;
  }

  @UseGuards(RuleGuard)
  @Put("/:ruleId")
  @ApiParam({ name: 'ruleId', description: 'ID of rule', required: true })
  @ApiOperation({ summary: "Update a rule" })
  @ApiOkResponse({ type: Rule, description: "Rule updated successfully" })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  @ApiNotFoundResponse({ description: "Game or rule is not found" })
  async updateRule(@GameRequest() game: Game, @RuleRequest() rule: Rule, @Body() body: RuleUpdatedDto): Promise<Rule> {
    await this.ruleService.update(rule.id, body);
    const updatedRule = await this.ruleService.getRule(game.id, rule.id);
    if (!updatedRule) {
      throw new HttpException(await this.translationService.translate("error.RULE_CANT_UPDATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return updatedRule;
  }

  @UseGuards(RuleGuard)
  @Delete("/:ruleId")
  @ApiParam({ name: 'ruleId', description: 'ID of rule', required: true })
  @ApiOperation({ summary: "Delete a rule" })
  @ApiOkResponse({ description: "Rule deleted successfully" })
  @ApiNotFoundResponse({ description: "Game or rule is not found" })
  async deleteRule(@GameRequest() game: Game, @RuleRequest() rule: Rule): Promise<void> {
    await this.ruleService.delete(game.id, rule.id);
  }
}
