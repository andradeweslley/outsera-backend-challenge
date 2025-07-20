import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  year!: number;

  @Column()
  title!: string;

  @Column()
  studios!: string;

  @Column()
  producers!: string;

  @Column({ nullable: true })
  winner!: boolean;
}