import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('study_sessions')
export class StudySession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, user => user.studySessions)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @Column('jsonb')
  sessionData!: {
    duration: number;
    wordsStudied: string[];
    correctAnswers: number;
    incorrectAnswers: number;
    score: number;
  };

  @Column({
    type: 'enum',
    enum: ['completed', 'interrupted', 'in_progress'],
    default: 'in_progress'
  })
  status!: 'completed' | 'interrupted' | 'in_progress';

  @Column('jsonb')
  performance!: {
    accuracy: number;
    speed: number;
    retention: number;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
