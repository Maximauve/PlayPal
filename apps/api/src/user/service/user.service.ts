import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { type Repository } from "typeorm";

import { type RegisterDto } from "@/auth/dto/register.dto";
import { TranslationService } from "@/translation/translation.service";
import { UserPayload } from "@/types/UserPayload";
import { UpdatedUsersDto } from "@/user/dto/updateUser.dto";
import { User } from "@/user/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private translationService: TranslationService
  ) { }

  async getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(user: RegisterDto): Promise<User | null> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async update(userId: string, user: UpdatedUsersDto): Promise<void> {
    const query = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(user)
      .where("id = :id", { id: userId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return;
  }

  async delete(userId: string): Promise<void> {
    const query = await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id: userId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return;
  }

  async findOneEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email: email })
      .getOne();
    if (!user) {
      return null;
    }
    return user;
  }

  async findOneUser(id: string): Promise<User | null> {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: id })
      .getOne();
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserConnected(request: Request): Promise<User | null> {
    const requestUser: UserPayload = request?.user as UserPayload;
    if (!requestUser) {
      return null;
    }
    const user: User | null = await this.findOneUser(requestUser?.id);
    if (!user) {
      return null;
    }
    return user;
  }

  async checkUnknownUser(user: RegisterDto | UpdatedUsersDto, userId?: string): Promise<boolean> {
    const unknownUser = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.username= :username", { username: user.username })
      .orWhere("user.email= :email", { email: user.email })
      .getOne();
    if (unknownUser == null || (userId ? userId === unknownUser.id : false)) {
      return false;
    }
    return true;
  }
}