import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Game } from "@/game/game.entity";
import { User } from "@/user/user.entity";



export class Wish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  game: Game;

  @CreateDateColumn()
  date: Date;
}