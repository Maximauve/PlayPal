import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from '@/game/game.entity';
import { State } from '@/product/state.enum';
import { User } from '@/user/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  state: State;

  @Column({ type: 'boolean', nullable: false })
  available: boolean;

  @ManyToOne(() => Game, game => game.product, { nullable : true })
  game: Game | null;

  @ManyToOne(() => User, user => user.product, { nullable : true })
  user: User | null;
}