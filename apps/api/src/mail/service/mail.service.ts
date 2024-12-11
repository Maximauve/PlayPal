import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { type Game, type User } from "@playpal/schemas";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendGameAvailability(
    to: User,
    game: Game,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: to.email,
      subject: 'Game availability',
      template: 'gameAvailable',
      context: {
        user: to,
        game: {
          ...game,
          url: `${process.env.FRONT_BASE_URL}/games/${game.id}`,
        },
        config: {
          appName: 'Playpal',
        }
      }
    });
  }
}
