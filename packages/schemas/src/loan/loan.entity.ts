import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @CreateDateColumn()
  startDate: Date;

  @ManyToOne(() => User, user => user.loan, { nullable : true })
  user: User | null;

  @ManyToOne(() => Product, product => product.loan, {
    onDelete: 'SET NULL' 
  })
  product: Product | null;
}
