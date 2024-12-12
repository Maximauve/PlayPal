import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { LoanStatus } from './loanStatus.enum';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', nullable: false })
  endDate: Date;
  
  @Column({ type: 'timestamptz', nullable: false })
  startDate: Date;

  @CreateDateColumn()
  createDate: Date;

  @ManyToOne(() => User, user => user.loan, { nullable : true })
  user: User | null;

  @ManyToOne(() => Product, product => product.loan, {
    onDelete: 'SET NULL' 
  })
  product: Product | null;

  @Column({ type: 'varchar', nullable: false })
  status: LoanStatus;
}
