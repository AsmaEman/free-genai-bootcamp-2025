import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { WordProgress } from './WordProgress';

@Entity('words')
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  arabicText!: string;

  @Column({ nullable: true })
  diacritics?: string;

  @Column()
  englishTranslation!: string;

  @Column({ type: 'text', array: true, default: [] })
  examples!: string[];

  @Column({ nullable: true })
  audioUrl?: string;

  @Column({ type: 'text', array: true, default: [] })
  tags!: string[];

  @Column({ type: 'jsonb', default: {} })
  metadata!: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    usage: string[];
  };

  @Column({ type: 'text', array: true, default: [] })
  relatedWords?: string[];

  @OneToMany(() => WordProgress, progress => progress.word)
  progress!: WordProgress[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
