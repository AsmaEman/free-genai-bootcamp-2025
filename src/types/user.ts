export type UserData = {
  id: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  settings: {
    preferredLanguage: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  progress: {
    level: number;
    experience: number;
    totalWordsLearned: number;
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: Date;
    achievements: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}; 