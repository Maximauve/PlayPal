import { AfterInsert, AfterLoad, AfterUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../product/product.entity';
import { Rating } from '../rating/rating.entity';
import { Rule } from '../rule/rule.entity';
import { Tag } from '../tag/tag.entity';
import { Wish } from '../wish/wish.entity';

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

  @OneToMany(() => Rating, rating => rating.game, {
      cascade: true,
      onDelete: 'CASCADE',
  })
  rating?: Rating[];

  @OneToMany(() => Product, product => product.game, {
      cascade: true,
      onDelete: 'CASCADE',
  })
  product?: Product[];

  @OneToMany(() => Wish, wish => wish.game, {
      cascade: true,
      onDelete: 'CASCADE',
  })
  wish?: Wish[];

  @ManyToMany(() => Tag, tag => tag.games)
  tags: Tag[];

  @OneToMany(() => Rule, rule => rule.game, {
      cascade: true,
      onDelete: 'CASCADE',
  })
  rules?: Rule[];

  averageRating: number | null;
  count: { rating: number; count: number }[];

  @AfterInsert()
  @AfterUpdate()
  @AfterLoad()
  private calculateStats() {
    if (this.rating && this.rating.length > 0) {
      const total = this.rating.reduce((sum, rating) => sum + rating.note, 0);
      this.averageRating = parseFloat((total / this.rating.length).toFixed(1));
      const countMap = this.rating.reduce((acc, rating) => {
        acc[rating.note] = (acc[rating.note] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      this.count = Object.entries(countMap).map(([rating, count]) => ({
        rating: parseInt(rating, 10),
        count
      }));
    } else {
      this.averageRating = null;
      this.count = [];
    }
  }
}

export interface GameWithStats {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  difficulty: number;
  duration: string;
  minYear: number;
  brand: string;
  image?: string;
  rating?: Rating[];
  product?: Product[];
  wish?: Wish[];
  tags: Tag[];
  rules?: Rule[];
  averageRating: number | null;
  count: { rating: number; count: number }[];
}
