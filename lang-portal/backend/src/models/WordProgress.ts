import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Word } from './Word';

@Entity('word_progress')
export class WordProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.wordProgress)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Word, word => word.progress)
  @JoinColumn({ name: 'wordId' })
  word: Word;

  @Column()
  wordId: string;

  @Column({ type: 'float', default: 0 })
  masteryLevel: number;

  @Column({ default: 0 })
  timesReviewed: number;

  @Column({ type: 'jsonb', default: [] })
  reviewHistory: {
    date: Date;
    correct: boolean;
    responseTime: number;
  }[];

  @Column({ type: 'timestamp', nullable: true })
  nextReviewDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
