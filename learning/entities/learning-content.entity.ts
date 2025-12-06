import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserProgress } from './user-progress.entity';

export enum LearningContentType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
}

@Entity('learning_content')
export class LearningContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: LearningContentType,
  })
  type: LearningContentType;

  @Column('int')
  pointsReward: number;

  @OneToMany(() => UserProgress, (userProgress) => userProgress.learningContent)
  userProgress: UserProgress[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

