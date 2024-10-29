import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { CreatedUserDto } from "../dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async create(user: CreatedUserDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async checkUnknownUser(user: CreatedUserDto): Promise<boolean> {
    let unknownUser = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.username= :username", {username: user.username})
      .orWhere("user.email= :email", {email: user.email})
      .getOne()
    if (unknownUser == null) return false;
    return true;
  }
}