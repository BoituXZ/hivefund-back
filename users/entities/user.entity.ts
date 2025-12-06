import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CircleMember } from '../../circles/entities/circle-member.entity';
import { Transaction } from '../../payments/entities/transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ unique: true })
  ecocashNumber: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(() => CircleMember, (circleMember) => circleMember.user)
  circleMembers: CircleMember[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
