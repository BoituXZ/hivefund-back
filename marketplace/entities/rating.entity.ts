import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Gig } from './gig.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  score: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => Gig)
  @JoinColumn({ name: 'gigId' })
  gig: Gig;

  @Column()
  gigId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'raterId' })
  rater: User;

  @Column()
  raterId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

