import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Circle } from './circle.entity';

export enum CircleMemberStatus {
  ACTIVE = 'ACTIVE',
  EXITED = 'EXITED',
}

@Entity('circle_members')
export class CircleMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  payoutPosition: number;

  @Column({
    type: 'enum',
    enum: CircleMemberStatus,
    default: CircleMemberStatus.ACTIVE,
  })
  status: CircleMemberStatus;

  @ManyToOne(() => User, (user) => user.circleMembers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Circle, (circle) => circle.members)
  @JoinColumn({ name: 'circleId' })
  circle: Circle;

  @Column()
  circleId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

