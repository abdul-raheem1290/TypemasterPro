import React, { useState, useMemo } from 'react';
import { ALL_LESSONS, LEVEL_METADATA } from '../data/lessons';
import { Lesson, LessonProgress } from '../types';
import { storage } from '../services/storage';
import { TypingEngine } from './TypingEngine';
import { 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Clock, 
  Zap, 
  Filter, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface LessonLibraryProps {
  onPracticeLesson?: (lesson: Lesson) => void;
  initialLessonId?: number;
}

export const LessonLibrary: React.FC<LessonLibraryProps> = ({ initialLessonId }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(() => {
    if (initialLessonId) {
      return ALL_LESSONS.find((l) => l.id === initialLessonId) || null;
    }
    return null;
  });

  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  const [progressMap, setProgressMap] = useState<Record<number, LessonProgress>>(() =>
    storage.getLessonProgress()
  );
  const [profile, setProfile] = useState(() => storage.getProfile());

  const toggleFavorite = (e: React.MouseEvent, lessonId: number) => {
    e.stopPropagation();
    const currentFavorites = profile.favoriteLessonIds || [];
    const updated = currentFavorites.includes(lessonId)
      ? currentFavorites.filter((id) => id !== lessonId)
      : [...currentFavorites, lessonId];

    const newProfile = { ...profile, favoriteLessonIds: updated };
    storage.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const filteredLessons = useMemo(() => {
    return ALL_LESSONS.filter((lesson) => {
      if (selectedLevel !== 'all' && lesson.level !== selectedLevel) return false;
      if (selectedDifficulty !== 'all' && lesson.difficulty !== selectedDifficulty) return false;
      if (favoritesOnly && !profile.favoriteLessonIds?.includes(lesson.id)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          lesson.title.toLowerCase().includes(q) ||
          lesson.description.toLowerCase().includes(q) ||
          lesson.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedLevel, selectedDifficulty, favoritesOnly, searchQuery, profile.favoriteLessonIds]);

  const completedCount = Object.values(progressMap).filter((p) => p.completed).length;

  const handleLessonComplete = (lesson: Lesson, wpm: number, accuracy: number) => {
    const progressData: LessonProgress = {
      lessonId: lesson.id,
      completed: true,
      bestWpm: wpm,
      bestAccuracy: accuracy,
      completedAt: new Date().toISOString(),
    };
    storage.saveLessonProgress(progressData);
    setProgressMap(storage.getLessonProgress());

    // Check achievement milestones
    const updatedAll = storage.getLessonProgress();
    const count = Object.values(updatedAll).filter((p) => p.completed).length;
    if (count >= 10) storage.unlockAchievement('lessons_10');
    if (count >= 25) storage.unlockAchievement('lessons_25');
    if (count >= 50) storage.unlockAchievement('lessons_50');
    if (count >= 100) storage.unlockAchievement('lessons_100');
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const next = ALL_LESSONS.find((l) => l.id === activeLesson.id + 1);
    if (next) {
      setActiveLesson(next);
    } else {
      setActiveLesson(null);
    }
  };

  // If active lesson is chosen, render the focused lesson runner view
  if (activeLesson) {
    const progress = progressMap[activeLesson.id];

    return (
      <div id="active-lesson-container" className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <button
            id="back-to-curriculum-btn"
            onClick={() => setActiveLesson(null)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            ← Back to 100 Lessons
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
              Lesson {activeLesson.id} of 100
            </span>
            {progress?.completed && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Best: {progress.bestWpm} WPM
              </span>
            )}
          </div>
        </div>

        {/* Lesson Objective Banner */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
              {activeLesson.levelName}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Target: {activeLesson.completionRequirement}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {activeLesson.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {activeLesson.description}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Learning Objective: {activeLesson.learningObjective}</span>
          </div>
        </div>

        {/* Lesson Typing Engine */}
        <TypingEngine
          key={`lesson-${activeLesson.id}`}
          title={`Lesson ${activeLesson.id}: ${activeLesson.title}`}
          category={activeLesson.category}
          practiceText={activeLesson.practiceText}
          mode="lesson"
          showKeyboard={profile.showKeyboard}
          showFingerGuide={profile.showFingerGuide}
          caretStyle={profile.caretStyle}
          onComplete={(res) => handleLessonComplete(activeLesson, res.wpm, res.accuracy)}
          onNext={handleNextLesson}
        />
      </div>
    );
  }

  return (
    <div id="lesson-library-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header & Overall Curriculum Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <BookOpen className="w-4 h-4" />
            100 Structured Lessons
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Typing Curriculum & Learning Path
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Master touch typing progressively from home row anchor keys to expert programming code.
          </p>
        </div>

        {/* Completion Progress Card */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs min-w-[260px]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            <span>Overall Completion</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {completedCount} / 100 ({completedCount}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${completedCount}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-lessons-input"
            type="text"
            placeholder="Search lessons by title, key, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Level Pills Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedLevel === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            All Levels (1–10)
          </button>
          {LEVEL_METADATA.map((lvl) => (
            <button
              key={lvl.level}
              onClick={() => setSelectedLevel(lvl.level)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLevel === lvl.level
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              Lvl {lvl.level}: {lvl.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Favorites Filter */}
        <button
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
            favoritesOnly
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : ''}`} />
          <span>Favorites</span>
        </button>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredLessons.map((lesson) => {
          const progress = progressMap[lesson.id];
          const isFavorited = profile.favoriteLessonIds?.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              id={`lesson-card-${lesson.id}`}
              onClick={() => setActiveLesson(lesson)}
              className="cursor-pointer group p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                      #{lesson.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Level {lesson.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleFavorite(e, lesson.id)}
                      className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                      aria-label="Star lesson"
                    >
                      <Star className={`w-4 h-4 ${isFavorited ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    {progress?.completed && (
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.recommendedTime}s
                </span>

                {progress ? (
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {progress.bestWpm} WPM ({progress.bestAccuracy}%)
                  </span>
                ) : (
                  <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    Start <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
