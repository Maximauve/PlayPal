import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Product } from "@playpal/schemas";

import { events } from "@/event/types/events";
import { MailService } from "@/mail/service/mail.service";
import { RedisService } from "@/redis/service/redis.service";
import { UserService } from "@/user/service/user.service";

@Injectable()
export class EventListener {

  constructor(
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  @OnEvent(events.product.returned)
  async ProductReturned(product: Product) {
    const gameId = product.game.id;
    const isGameInWaitingList = await this.redisService.exists(`game-waiting-${gameId}`);
    if (!isGameInWaitingList) {
      return;
    }
    const usersWaiting = await this.redisService.lgetall(`game-waiting-${gameId}`);

    usersWaiting.forEach(async (userId) => {
      const user = await this.userService.findOneUser(userId);
      if (!user) {
        return;
      }
      this.mailService.sendGameAvailability(user, product.game);
    });

    this.redisService.del(`game-waiting-${gameId}`);
  }
}	
