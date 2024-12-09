import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Game } from "@playpal/schemas";

import { MailService } from "@/mail/service/mail.service";
import { RedisService } from "@/redis/service/redis.service";

@Injectable()
export class EventListener {

  constructor(
    private readonly mailService: MailService,
    private readonly redisService: RedisService
  ) {}

  @OnEvent('game.available')
  Test(game: Game) {

    console.log('game:', game);
    // const users = await this.redisService.hgetall(`awaiting.game.${game.id}`);
  } 
}	
