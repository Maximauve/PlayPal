import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '@/product/product.entity';
import { Rating } from '@/rating/rating.entity';
import { Rule } from '@/rule/rule.entity';
import { Tag } from '@/tag/tag.entity';
import { Wish } from '@/wish/wish.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'int' })
  minPlayers: number;

  @Column({ type: 'int' })
  maxPlayers: number;

  @Column({ type: 'int' })
  difficulty: number;

  @Column({ type: 'varchar' })
  duration: string;

  @Column({ type: 'int' })
  minYear: number;

  @Column({ type: 'varchar' })
  brand: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @OneToMany(() => Rating, rating => rating.game)
  rating?: Rating[];

  @OneToMany(() => Product, product => product.game)
  product?: Product[];

  @OneToMany(() => Wish, wish => wish.game)
  wish?: Wish[];

  @ManyToMany(() => Tag, tag => tag.games)
  tags: Tag[];

  @OneToMany(() => Rule, rule => rule.game)
  rules?: Rule[];
}