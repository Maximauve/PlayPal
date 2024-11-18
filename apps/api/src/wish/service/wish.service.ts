import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository } from "typeorm";

import { Game } from '@/game/game.entity';
import { TranslationService } from '@/translation/translation.service';
import { User } from '@/user/user.entity';
import { WishDto } from '@/wish/dto/wish.dto';
import { WishUpdatedDto } from '@/wish/dto/wishUpdated.dto';
import { Wish } from '@/wish/wish.entity';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private translationService: TranslationService
  ) { }

  async getAllWishes(): Promise<Wish[]> {
    return this.wishRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.user', 'user')
      .leftJoinAndSelect('wish.game', 'game')
      .getMany();
  }

  async getAllWishesForUser(userId: string): Promise<Wish[]> {
    return this.wishRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.user', 'user')
      .leftJoinAndSelect('wish.game', 'game')
      .where('wish.user = :userId', { userId })
      .getMany();
  }

  async getAllWishesForGame(gameId: string): Promise<Wish[]> {
    return this.wishRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.user', 'user')
      .leftJoinAndSelect('wish.game', 'game')
      .where('game.user = :gameId', { gameId })
      .getMany();
  }

  async getWish(id: string): Promise<Wish | null> {
    return this.wishRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.user', 'user')
      .leftJoinAndSelect('wish.game', 'game')
      .where('wish.id = :id', { id })
      .getOne();
  }

  async create(userId: string, gameId: string, wishDto: WishDto): Promise<Wish | null> {
    const game = await this.gameRepository
      .createQueryBuilder('game')
      .where('game.id = :id', { id: gameId })
      .getOne();
    if (!game) {
      throw new HttpException(
        await this.translationService.translate("error.GAME_NOT_FOUND"),
        HttpStatus.NOT_FOUND
      );
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();
    if (!user) {
      throw new HttpException(
        await this.translationService.translate("error.USER_NOT_FOUND"),
        HttpStatus.NOT_FOUND
      );
    }
    const existingWish = await this.getWish(userId);
    if (existingWish) {
      throw new HttpException(
        await this.translationService.translate("error.WISH_ALREADY_EXISTS"),
        HttpStatus.BAD_REQUEST
      );
    }
    const wish = this.wishRepository.create({
      ...wishDto,
      user,
      game
    });
    return this.wishRepository.save(wish);
  }

  async updateWish(wishId: string, wishUpdatedDto: WishUpdatedDto): Promise<void> {
    const query = await this.wishRepository
      .createQueryBuilder()
      .update(Wish)
      .set(wishUpdatedDto)
      .where('id = :id', { wishId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationService.translate("error.WISH_NOT_FOUND"),HttpStatus.NOT_FOUND
      );
    }
    return;
  }

  async deleteWish(wishId: string): Promise<void> {
    const query = await this.wishRepository
      .createQueryBuilder()
      .delete()
      .from(Wish)
      .where('id = :id', { wishId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(
        await this.translationService.translate('error.WISH_NOT_FOUND'),
        HttpStatus.NOT_FOUND
      );
    }
    return;
  }

}
