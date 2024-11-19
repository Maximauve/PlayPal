import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Game } from '@/game/game.entity';
import { Loan } from '@/loan/loan.entity';
import { State } from '@/product/state.enum';
import { User } from '@/user/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  state: State;

  @Column({ type: 'boolean', nullable: true })
  available: boolean;

  @ManyToOne(() => Game, game => game.product)
  game: Game;

  @ManyToOne(() => User, user => user.product, { nullable : true })
  user: User | null;

  @OneToMany(() => Loan, loan => loan.product)
  loan?: Loan[];
}