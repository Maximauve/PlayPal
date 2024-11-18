import { CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Game } from "@/game/game.entity";
import { User } from "@/user/user.entity";



export class Wish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.wish)
  user: User;

  @ManyToOne( () => Game, game => game.wish)
  game: Game;

  @CreateDateColumn()
  date: Date;
}