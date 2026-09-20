import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ALL_ACHIEVEMENTS } from '../data/achievements';
import { UserProfile, TestResult, Achievement } from '../types';
import { formatDurationHours } from '../services/wpmCalculator';
import { 
  Flame, 
  Zap, 
  Target, 
  BookOpen, 
  Clock, 
  Trophy, 
  Download, 
  Trash2, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  TrendingUp,
  User,
  Edit2
} from 'lucide-react';

interface UserDashboardProps {
  onOpenCertificateModal?: () => void;
  onNavigateToLessons?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onOpenCertificateModal,
  onNavigateToLessons,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [history, setHistory] = useState<TestResult[]>(() => storage.getTestHistory());
  const [lessonProgress, setLessonProgress] = useState(() => storage.getLessonProgress());
  const [achievements, setAchievements] = useState<Record<string, string>>(() => storage.getAchievements());

  const [isEditingGoals, setIsEditingGoals] = useState<boolean>(false);
  const [targetWpmInput, setTargetWpmInput] = useState<number>(profile.goals.targetWpm);
  const [targetAccInput, setTargetAccInput] = useState<number>(profile.goals.targetAccuracy);
  const [dailyMinutesInput, setDailyMinutesInput] = useState<number>(profile.goals.dailyMinutes);

  useEffect(() => {
    setProfile(storage.getProfile());
    setHistory(storage.getTestHistory());
    setLessonProgress(storage.getLessonProgress());
    setAchievements(storage.getAchievements());
  }, []);

  // Compute calculated metrics
  const bestWpm = history.reduce((max, h) => Math.max(max, h.wpm), 0);
  const currentWpm = history.length > 0 ? history[0].wpm : 0;
  const avgWpm =
    history.length > 0
      ? Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / history.length)
      : 0;
  const avgAccuracy =
    history.length > 0
      ? Math.round((history.reduce((acc, h) => acc + h.accuracy, 0) / history.length) * 10) / 10
      : 100;
  const lessonsCompletedCount = Object.values(lessonProgress).filter((p) => p.completed).length;

  const handleSaveGoals = () => {
    const updated = {
      ...profile,
      goals: {
        targetWpm: Number(targetWpmInput) || 60,
        targetAccuracy: Number(targetAccInput) || 98,
        dailyMinutes: Number(dailyMinutesInput) || 15,
      },
    };
    storage.saveProfile(updated);
    setProfile(updated);
    setIsEditingGoals(false);
  };

  const handleDeleteHistoryItem = (id: string) => {
    storage.deleteTestResult(id);
    setHistory(storage.getTestHistory());
  };

  const handleExportCSV = () => {
    const csvData = storage.exportHistoryCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typemaster_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonData = storage.exportAllDataJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typemaster_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all your progress, history, and streaks? This cannot be undone.')) {
      storage.resetAllProgress();
      setProfile(storage.getProfile());
      setHistory([]);
      setLessonProgress({});
      setAchievements({});
    }
  };

  // SVG Performance Graph points
  const recentTests = history.slice(0, 12).reverse();
  const maxChartWpm = Math.max(80, ...recentTests.map((t) => t.wpm));

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div id="user-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* User Header & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-indigo-600/25">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {profile.name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold">
                Level {Math.min(10, Math.floor(lessonsCompletedCount / 10) + 1)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Member since {profile.joinedDate} • Touch Typist in Training
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenCertificateModal && (
            <button
              id="dashboard-open-cert-btn"
              onClick={onOpenCertificateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <Award className="w-4 h-4" />
              View Certificates
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50"
            title="Backup JSON"
          >
            <Download className="w-3.5 h-3.5" />
            Backup
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Speed</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100">
            {currentWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">From latest session</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Personal Best</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {bestWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">All-time record</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Accuracy</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {avgAccuracy}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Average consistency</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lessons Completed</span>
            <BookOpen className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400">
            {lessonsCompletedCount} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{100 - lessonsCompletedCount} lessons left</div>
        </div>
      </div>

      {/* Row 2: Performance Chart + Daily Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WPM Progress SVG Chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                Progress Trajectory
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Speed (WPM) Over Recent Sessions
              </h3>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>

          {recentTests.length > 1 ? (
            <div className="w-full h-48 sm:h-56 relative pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[40, 80, 120, 160].map((y, idx) => (
                  <line
                    key={idx}
                    x1="0"
                    y1={y}
                    x2="500"
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Polyline Path */}
                {(() => {
                  const points = recentTests.map((t, i) => {
                    const x = (i / (recentTests.length - 1)) * 480 + 10;
                    const y = 170 - (t.wpm / maxChartWpm) * 140;
                    return `${x},${y}`;
                  });

                  const areaPoints = `10,170 ${points.join(' ')} 490,170`;

                  return (
                    <>
                      <polygon points={areaPoints} fill="url(#chartGrad)" />
                      <polyline
                        points={points.join(' ')}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {recentTests.map((t, i) => {
                        const x = (i / (recentTests.length - 1)) * 480 + 10;
                        const y = 170 - (t.wpm / maxChartWpm) * 140;
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4.5"
                            className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900 stroke-2"
                          />
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-center text-slate-400 text-xs">
              Complete at least two typing sessions to visualize your speed curve graph.
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Average: {avgWpm} WPM</span>
            <span>Peak: {bestWpm} WPM</span>
          </div>
        </div>

        {/* Daily Streak & Practice Time Card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                Consistency
              </span>
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {profile.streak.count} Day Streak!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Practice every day to form permanent neuromotor pathways.
            </p>

            {/* Weekdays Checkmarks */}
            <div className="grid grid-cols-7 gap-1.5 mt-6">
              {weekDays.map((day, idx) => {
                const isActive = profile.streak.weeklyHistory[idx];
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold">{day}</span>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isActive ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Total Practice
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {formatDurationHours(profile.totalPracticeTimeSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Personal Goals */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
              Personal Targets
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Skill Benchmarks & Objectives
            </h3>
          </div>
          <button
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditingGoals ? 'Cancel' : 'Edit Goals'}
          </button>
        </div>

        {isEditingGoals ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-medium text-slate-500">Target Speed (WPM)</label>
              <input
                type="number"
                value={targetWpmInput}
                onChange={(e) => setTargetWpmInput(Number(e.target.value))}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Target Accuracy (%)</label>
              <input
                type="number"
                value={targetAccInput}
                onChange={(e) => setTargetAccInput(Number(e.target.value))}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Daily Practice (Minutes)</label>
              <input
                type="number"
                value={dailyMinutesInput}
                onChange={(e) => setDailyMinutesInput(Number(e.target.value))}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <button
                onClick={handleSaveGoals}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Save Goals
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Speed Goal</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {bestWpm} / {profile.goals.targetWpm} WPM
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-indigo-600 h-full"
                  style={{ width: `${Math.min(100, (bestWpm / profile.goals.targetWpm) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Accuracy Goal</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {avgAccuracy}% / {profile.goals.targetAccuracy}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-emerald-500 h-full"
                  style={{
                    width: `${Math.min(100, (avgAccuracy / profile.goals.targetAccuracy) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Daily Practice</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  Target: {profile.goals.dailyMinutes} mins/day
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3">
                <div className="bg-amber-500 h-full" style={{ width: '70%' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Row 4: Achievements Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
              Gamified Milestones
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Achievements ({Object.keys(achievements).length} / {ALL_ACHIEVEMENTS.length} Unlocked)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_ACHIEVEMENTS.map((ach) => {
            const unlockedDate = achievements[ach.id];
            const isUnlocked = Boolean(unlockedDate);

            return (
              <div
                key={ach.id}
                id={`achievement-card-${ach.id}`}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{isUnlocked ? '🏆' : '🔒'}</span>
                    {isUnlocked && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ach.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {isUnlocked && (
                  <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    Earned: {unlockedDate.split('T')[0]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 5: Test History Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
              Logs
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Recent Practice History
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">{history.length} records</span>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Mode / Title</th>
                  <th className="py-3 px-4 font-mono">Net WPM</th>
                  <th className="py-3 px-4 font-mono">Accuracy</th>
                  <th className="py-3 px-4 font-mono">Consistency</th>
                  <th className="py-3 px-4 font-mono">Duration</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {history.slice(0, 15).map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                    <td className="py-3 px-4 text-slate-400">{h.date}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{h.title}</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {h.wpm}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">{h.accuracy}%</td>
                    <td className="py-3 px-4 font-mono">{h.consistency}%</td>
                    <td className="py-3 px-4 font-mono">{h.durationSeconds}s</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteHistoryItem(h.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No test records saved yet. Take a typing test to begin tracking your history!
          </div>
        )}

        {/* Reset button at bottom */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={handleResetData}
            className="text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors"
          >
            Reset All Local Data
          </button>
        </div>
      </div>
    </div>
  );
};
