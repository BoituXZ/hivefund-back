import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Circle } from './circle.entity';

export enum ExitRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('exit_requests')
export class ExitRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  reason: string;

  @Column({
    type: 'enum',
    enum: ExitRequestStatus,
    default: ExitRequestStatus.PENDING,
  })
  status: ExitRequestStatus;

  @ManyToOne(() => Circle)
  @JoinColumn({ name: 'circleId' })
  circle: Circle;

  @Column()
  circleId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

