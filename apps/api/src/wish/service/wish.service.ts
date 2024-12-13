import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, User, Wish } from '@playpal/schemas';
import { type Repository } from "typeorm";

import { TranslationService } from '@/translation/translation.service';
import { WishDto } from '@/wish/dto/wish.dto';
import { WishUpdatedDto } from '@/wish/dto/wishUpdated.dto';

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
      .leftJoinAndSelect('game.rating', 'rating')
      .getMany();
  }

  async getAllWishesForUser(userId: string): Promise<Wish[]> {
    return this.wishRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.user', 'user')
      .leftJoinAndSelect('wish.game', 'game')
      .leftJoinAndSelect('game.rating', 'rating')
      .where('wish.user = :userId', { userId })
      .getMany();
  }

  async getAllWishesForGame(gameId: string): Promise<Wish[]> {
    return this.wishRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.user', 'user')
      .leftJoinAndSelect('wish.game', 'game')
      .leftJoinAndSelect('game.rating', 'rating')
      .where('game.user = :gameId', { gameId })
      .getMany();
  }

  async getWish(id: string): Promise<Wish | null> {
    return this.wishRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.user', 'user')
      .leftJoinAndSelect('wish.game', 'game')
      .leftJoinAndSelect('game.rating', 'rating')
      .where('wish.id = :id', { id })
      .getOne();
  }

  async create(wishDto: WishDto, userId: string): Promise<Wish | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .getOne();
    if (!user) {
      throw new HttpException(
        await this.translationService.translate('error.USER_NOT_FOUND'),
        HttpStatus.NOT_FOUND
      );
    }
    const game = await this.gameRepository
      .createQueryBuilder('game')
      .where('game.id = :id', { id: wishDto.gameId })
      .getOne();
    if (!game) {
      throw new HttpException(
        await this.translationService.translate('error.GAME_NOT_FOUND'),
        HttpStatus.NOT_FOUND
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
    const game = await this.gameRepository
      .createQueryBuilder('game')
      .where('game.id = :id', { id: wishUpdatedDto.gameId })
      .getOne();
    if (!game) {
      throw new HttpException(
        await this.translationService.translate('error.GAME_NOT_FOUND'),
        HttpStatus.NOT_FOUND
      );
    }
    const query = await this.wishRepository
      .createQueryBuilder()
      .update(Wish)
      .set(game)
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
      .where('id = :id', { id: wishId })
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
