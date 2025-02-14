import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { StudySession } from './StudySession';
import { WordProgress } from './WordProgress';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column('jsonb')
  settings!: {
    preferredLanguage: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };

  @Column('jsonb')
  progress!: {
    level: number;
    experience: number;
    achievements: string[];
    lastActivity: Date;
  };

  @OneToMany(() => StudySession, session => session.user)
  studySessions!: StudySession[];

  @OneToMany(() => WordProgress, progress => progress.user)
  wordProgress!: WordProgress[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
