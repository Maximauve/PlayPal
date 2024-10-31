import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type Repository } from "typeorm";

import { type CreatedUserDto } from "@/user/dto/user.dto";
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

  async create(user: CreatedUserDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async checkUnknownUser(user: CreatedUserDto): Promise<boolean> {
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