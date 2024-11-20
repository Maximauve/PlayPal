import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Game } from "@/game/game.entity";

@Entity()
export class Rule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  youtubeId?: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @ManyToOne(() => Game, game => game.rules, {
    cascade: true
  })
  game: Game;
}