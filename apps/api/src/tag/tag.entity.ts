import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Game } from "@/game/game.entity";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToMany( () => Game , game => game.tags)
  games: Game[];
}