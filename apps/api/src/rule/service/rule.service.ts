import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Game } from "@/game/game.entity";
import { RuleDto } from "@/rule/dto/rule.dto";
import { RuleUpdatedDto } from "@/rule/dto/ruleUpdated.dto";
import { Rule } from "@/rule/rule.entity";
import { TranslationService } from "@/translation/translation.service";

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private ruleRepository: Repository<Rule>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private readonly translationsService: TranslationService
  ) { }

  async getAllRules(gameId: string): Promise<Rule[]> {
    return this.ruleRepository
      .createQueryBuilder('rule')
      .where("rule.gameId = :id", { id: gameId })
      .leftJoinAndSelect("rule.game", "game")
      .getMany();
  }

  async getRule(gameId: string, ruleId: string): Promise<Rule | null> {
    return this.ruleRepository
      .createQueryBuilder("rule")
      .where("rule.gameId = :gameId", { gameId: gameId })
      .andWhere("rule.id = :ruleId", { ruleId: ruleId })
      .leftJoinAndSelect("rule.game", "game")
      .getOne();
  }

  async getRuleByYoutubeId(gameId: string, youtubeId: string): Promise<Rule | null> {
    return this.ruleRepository
      .createQueryBuilder("rule")
      .where("rule.gameId = :gameId", { gameId: gameId })
      .andWhere("rule.youtubeId = :youtubeId", { youtubeId: youtubeId })
      .leftJoinAndSelect("rule.game", "game")
      .getOne();
  }

  async create(game: Game, ruleDto: RuleDto): Promise<Rule | null> {
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    //check if already exists
    if (await this.getRuleByYoutubeId(game.id, ruleDto.youtubeId)) {
      throw new HttpException(await this.translationsService.translate("error.RULE_ALREADY_EXISTS"), HttpStatus.BAD_REQUEST);
    }

    const rule = this.ruleRepository.create({
      ...ruleDto,
      game: game
    });

    return this.ruleRepository.save(rule);
  }

  async update(ruleId: string, ruleUpdatedDto: RuleUpdatedDto): Promise<void> {
    const query = await this.ruleRepository
      .createQueryBuilder("rule")
      .update(Rule)
      .set(ruleUpdatedDto)
      .where("rule.id = :ruleId", { ruleId: ruleId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate("error.RULE_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }

    return;
  }

  async delete(gameId: string, ruleId: string): Promise<void> {
    const query = await this.ruleRepository
      .createQueryBuilder("rule")
      .delete()
      .from(Rule)
      .where("rule.id = :ruleId", { ruleId: ruleId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate("error.RULE_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }

    return;
  }
}