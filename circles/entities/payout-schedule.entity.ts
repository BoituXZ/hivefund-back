import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cycle } from './cycle.entity';
import { User } from '../../users/entities/user.entity';

@Entity('payout_schedules')
export class PayoutSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz' })
  scheduledDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string;

  @ManyToOne(() => Cycle, (cycle) => cycle.payoutSchedules)
  @JoinColumn({ name: 'cycleId' })
  cycle: Cycle;

  @Column()
  cycleId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

