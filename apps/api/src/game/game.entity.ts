import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}