import { ObjectType, Field, InputType } from 'type-graphql';
import { StudySession } from './StudySession';
import { WordProgress } from './WordProgress';

@ObjectType()
class NotificationSettings {
  @Field()
  email!: boolean;

  @Field()
  push!: boolean;
}

@ObjectType()
class UserSettings {
  @Field()
  preferredLanguage!: string;

  @Field(() => NotificationSettings)
  notifications!: NotificationSettings;
}

@ObjectType()
class UserProgress {
  @Field()
  level!: number;

  @Field()
  experience!: number;

  @Field()
  totalWordsLearned!: number;

  @Field()
  currentStreak!: number;

  @Field()
  longestStreak!: number;

  @Field()
  lastStudyDate!: Date;

  @Field(() => [String])
  achievements!: string[];
}

@ObjectType()
export class User {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  passwordHash!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  isEmailVerified!: boolean;

  @Field(() => UserSettings)
  settings!: UserSettings;

  @Field(() => UserProgress)
  progress!: UserProgress;

  @Field(() => [StudySession])
  studySessions: StudySession[];

  @Field(() => [WordProgress])
  wordProgress: WordProgress[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  constructor(data: {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    settings: UserSettings;
    progress: UserProgress;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.isEmailVerified = data.isEmailVerified;
    this.settings = data.settings;
    this.progress = data.progress;
    this.studySessions = [];
    this.wordProgress = [];
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

@InputType()
class UserSettingsInput {
  @Field()
  preferredLanguage!: string;

  @Field(() => NotificationSettings)
  notifications!: NotificationSettings;
}

@InputType()
class UserProgressInput {
  @Field()
  level!: number;

  @Field()
  experience!: number;

  @Field()
  totalWordsLearned!: number;

  @Field()
  currentStreak!: number;

  @Field()
  longestStreak!: number;

  @Field()
  lastStudyDate!: Date;

  @Field(() => [String])
  achievements!: string[];
}

@InputType()
export class UserCreateInput {
  @Field()
  email!: string;

  @Field()
  passwordHash!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  isEmailVerified: boolean = false;

  @Field(() => UserSettingsInput)
  settings!: UserSettingsInput;

  @Field(() => UserProgressInput)
  progress!: UserProgressInput;

  @Field()
  createdAt: Date = new Date();

  @Field()
  updatedAt: Date = new Date();
}
