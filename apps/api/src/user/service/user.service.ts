import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type Repository } from "typeorm";

import { type RegisterDto } from "@/auth/dto/register.dto";
import { User } from "@/user/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(user: RegisterDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
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

  async checkUnknownUser(user: RegisterDto): Promise<boolean> {
    const unknownUser = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.username= :username", { username: user.username })
      .orWhere("user.email= :email", { email: user.email })
      .getOne();
    if (unknownUser == null) {
      return false;
    }
    return true;
  }
}