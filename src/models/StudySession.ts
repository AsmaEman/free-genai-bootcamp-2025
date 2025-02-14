import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('study_sessions')
export class StudySession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.studySessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'jsonb' })
  sessionData: {
    wordsStudied: string[];
    correctAnswers: number;
    incorrectAnswers: number;
    duration: number;
  };

  @Column({ type: 'enum', enum: ['completed', 'interrupted', 'in_progress'] })
  status: 'completed' | 'interrupted' | 'in_progress';

  @Column({ type: 'jsonb', default: {} })
  performance: {
    accuracy: number;
    averageResponseTime: number;
    masteryLevel: number;
  };

  @CreateDateColumn()
  createdAt: Date;
}
