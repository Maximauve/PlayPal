import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Loan } from '@/loan/loan.entity';
import { Product } from '@/product/product.entity';
import { Rating } from '@/rating/rating.entity';
import { Role } from '@/user/role.enum';
import { Wish } from '@/wish/wish.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', default: Role.Customer })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @CreateDateColumn()
  creationDate: Date;

  @OneToMany(() => Rating, rating => rating.user)
  rating?: Rating[];

  @OneToMany(() => Product, product => product.user)
  product?: Product[];

  @OneToMany(() => Loan, loan => loan.user)
  loan?: Loan[];

  @OneToMany(() => Wish, wish => wish.user)
  wish?: Wish[];
}

