import { UserProfile, LessonProgress, TestResult, KeyStat, Achievement } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'typemaster_profile_v1',
  LESSON_PROGRESS: 'typemaster_lesson_progress_v1',
  TEST_HISTORY: 'typemaster_history_v1',
  KEY_STATS: 'typemaster_key_stats_v1',
  ACHIEVEMENTS: 'typemaster_achievements_v1',
  CUSTOM_TEXTS: 'typemaster_custom_texts_v1',
};

export const defaultProfile: UserProfile = {
  name: 'Typing Scholar',
  avatarSeed: 'scholar-1',
  joinedDate: new Date().toISOString().split('T')[0],
  theme: 'system',
  caretStyle: 'line',
  soundEnabled: true,
  soundVolume: 0.3,
  fontSize: 'base',
  showKeyboard: true,
  showFingerGuide: true,
  goals: {
    targetWpm: 60,
    targetAccuracy: 98,
    dailyMinutes: 15,
  },
  streak: {
    count: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    weeklyHistory: [true, false, false, false, false, false, false],
  },
  totalPracticeTimeSeconds: 420, // initial 7 mins practice sample
  favoriteLessonIds: [1, 10, 81],
};

class StorageService {
  public getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) return defaultProfile;
      return { ...defaultProfile, ...JSON.parse(data) };
    } catch {
      return defaultProfile;
    }
  }

  public saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }

  public updateStreak(): UserProfile {
    const profile = this.getProfile();
    const today = new Date().toISOString().split('T')[0];
    const lastActive = profile.streak.lastActiveDate;

    if (lastActive === today) {
      return profile;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = profile.streak.count;
    if (lastActive === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1; // reset streak if broken
    }

    // Update weekly day flags
    const dayOfWeek = new Date().getDay(); // 0 is Sun, 1 is Mon
    const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const newWeekly = [...profile.streak.weeklyHistory];
    newWeekly[mondayIndex] = true;

    profile.streak = {
      count: newStreak,
      lastActiveDate: today,
      weeklyHistory: newWeekly,
    };

    this.saveProfile(profile);
    return profile;
  }

  public getLessonProgress(): Record<number, LessonProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public saveLessonProgress(progress: LessonProgress): void {
    try {
      const all = this.getLessonProgress();
      const existing = all[progress.lessonId];
      if (!existing || progress.bestWpm > existing.bestWpm) {
        all[progress.lessonId] = progress;
      } else {
        all[progress.lessonId] = {
          ...existing,
          completed: true,
          bestAccuracy: Math.max(existing.bestAccuracy, progress.bestAccuracy),
        };
      }
      localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save lesson progress', e);
    }
  }

  public getTestHistory(): TestResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEST_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public addTestResult(result: TestResult): void {
    try {
      const history = this.getTestHistory();
      history.unshift(result);
      // Keep last 150 results for storage hygiene
      const trimmed = history.slice(0, 150);
      localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(trimmed));

      // Also increment total practice time
      const profile = this.getProfile();
      profile.totalPracticeTimeSeconds += result.durationSeconds;
      this.saveProfile(profile);
    } catch (e) {
      console.error('Failed to save test result', e);
    }
  }

  public deleteTestResult(id: string): void {
    try {
      const history = this.getTestHistory().filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to delete test result', e);
    }
  }

  public getKeyStats(): Record<string, KeyStat> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KEY_STATS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public recordKeyStats(mistypedKeys: Record<string, number>, totalTyped: number): void {
    try {
      const stats = this.getKeyStats();
      const now = Date.now();

      // Update recorded mistyped keys
      Object.entries(mistypedKeys).forEach(([char, errorCount]) => {
        const key = char.toLowerCase();
        if (!stats[key]) {
          stats[key] = { key, totalAttempts: errorCount, errors: errorCount, lastTested: now };
        } else {
          stats[key].totalAttempts += errorCount;
          stats[key].errors += errorCount;
          stats[key].lastTested = now;
        }
      });

      localStorage.setItem(STORAGE_KEYS.KEY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to update key stats', e);
    }
  }

  public getAchievements(): Record<string, string> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public unlockAchievement(achievementId: string): boolean {
    try {
      const current = this.getAchievements();
      if (!current[achievementId]) {
        current[achievementId] = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(current));
        return true; // Newly unlocked
      }
      return false;
    } catch {
      return false;
    }
  }

  public getCustomTexts(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEXTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveCustomText(text: string): void {
    if (!text.trim()) return;
    try {
      const current = this.getCustomTexts();
      if (!current.includes(text.trim())) {
        current.unshift(text.trim());
        localStorage.setItem(STORAGE_KEYS.CUSTOM_TEXTS, JSON.stringify(current.slice(0, 20)));
      }
    } catch (e) {
      console.error('Failed to save custom text', e);
    }
  }

  public exportAllDataJSON(): string {
    const backup = {
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      lessonProgress: this.getLessonProgress(),
      testHistory: this.getTestHistory(),
      keyStats: this.getKeyStats(),
      achievements: this.getAchievements(),
    };
    return JSON.stringify(backup, null, 2);
  }

  public exportHistoryCSV(): string {
    const history = this.getTestHistory();
    if (history.length === 0) return 'Date,Mode,Title,WPM,Raw WPM,Accuracy,Consistency,Duration\n';
    const header = 'Date,Mode,Title,WPM,Raw WPM,Accuracy,Consistency,DurationSeconds\n';
    const rows = history
      .map(
        (h) =>
          `"${h.date}","${h.mode}","${h.title.replace(/"/g, '""')}",${h.wpm},${h.rawWpm},${h.accuracy}%,${h.consistency}%,${h.durationSeconds}`
      )
      .join('\n');
    return header + rows;
  }

  public resetAllProgress(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
}

export const storage = new StorageService();
