import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Rating } from '@/rating/rating.entity';
import { Role } from '@/user/role.enum';

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

  @CreateDateColumn()
  creationDate: Date;

  @OneToMany(() => Rating, rating => rating.user)
  rating: Rating[];
}