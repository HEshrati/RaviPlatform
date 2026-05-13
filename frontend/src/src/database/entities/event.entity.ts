import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  exactLocation: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  time: string;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 10 })
  capacity: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  hostName: string;

  @Column({ nullable: true })
  hostTitle: string;

  @Column('simple-array', { nullable: true })
  learnings: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}