import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from '@/game/game.entity';
import { User } from '@/user/user.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  comment: string;

  @Column({ type: 'int', nullable: false })
  note: number;

  @CreateDateColumn()
  creationDate: Date;

  @ManyToOne(() => User, user => user.rating)
  user: User;

  @ManyToOne(() => Game, game => game.rating)
  game: Game;
}