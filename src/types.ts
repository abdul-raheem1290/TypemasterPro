export type ThemeMode = 'light' | 'dark' | 'system';
export type CaretStyle = 'line' | 'block' | 'underline';
export type TestDuration = 15 | 30 | 60 | 120 | 300 | 'custom';
export type TestCategory = 'words' | 'sentences' | 'paragraph' | 'code' | 'numbers' | 'punctuation' | 'custom';
export type DifficultyLevel = 'beginner' | 'easy' | 'intermediate' | 'advanced' | 'expert';

export interface KeyStat {
  key: string;
  totalAttempts: number;
  errors: number;
  lastTested: number;
}

export interface Lesson {
  id: number;
  level: number;
  levelName: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  description: string;
  learningObjective: string;
  completionRequirement: string;
  recommendedTime: number; // in seconds
  practiceText: string;
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  completedAt: string;
}

export interface TestResult {
  id: string;
  date: string;
  mode: 'test' | 'lesson' | 'game' | 'custom' | 'weak-keys';
  title: string;
  durationSeconds: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctCharacters: number;
  incorrectCharacters: number;
  totalCharacters: number;
  mistypedKeys: Record<string, number>;
}

export interface UserGoals {
  targetWpm: number;
  targetAccuracy: number;
  dailyMinutes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'lessons' | 'streak' | 'special';
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserProfile {
  name: string;
  avatarSeed: string;
  joinedDate: string;
  theme: ThemeMode;
  caretStyle: CaretStyle;
  soundEnabled: boolean;
  soundVolume: number;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  showKeyboard: boolean;
  showFingerGuide: boolean;
  goals: UserGoals;
  streak: {
    count: number;
    lastActiveDate: string;
    weeklyHistory: boolean[]; // 7 days (Mon-Sun)
  };
  totalPracticeTimeSeconds: number;
  favoriteLessonIds: number[];
}

export type ViewTab = 
  | 'home'
  | 'lessons'
  | 'tests'
  | 'practice'
  | 'games'
  | 'weak-keys'
  | 'dashboard'
  | 'learn'
  | 'blog'
  | 'faq'
  | 'certificate'
  | 'privacy';
