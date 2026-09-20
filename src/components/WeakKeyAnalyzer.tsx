import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { KeyStat } from '../types';
import { TypingEngine } from './TypingEngine';
import { Target, Sparkles, Zap, AlertTriangle, Play, RotateCcw, CheckCircle2 } from 'lucide-react';

interface WeakKeyAnalyzerProps {
  onReturnHome?: () => void;
}

export const WeakKeyAnalyzer: React.FC<WeakKeyAnalyzerProps> = () => {
  const [keyStats, setKeyStats] = useState<Record<string, KeyStat>>({});
  const [activeDrillText, setActiveDrillText] = useState<string | null>(null);

  useEffect(() => {
    setKeyStats(storage.getKeyStats());
  }, []);

  // Compute keys with errors sorted by error count
  const weakKeys = Object.values(keyStats)
    .filter((k) => k.errors > 0)
    .sort((a, b) => b.errors - a.errors);

  // Generate personalized exercises from weak keys
  const generateDrillForKeys = (keys: string[]): string => {
    if (keys.length === 0) {
      // Default diagnostic baseline drill
      return 'q p z x b n m quiz pixel quick prefix zebra rhythm luxury dynamic';
    }

    const chars = keys.map((k) => k.toLowerCase()).slice(0, 5);
    const repeats = chars.map((c) => `${c}${c}${c}`).join(' ');
    const pairs = chars.map((c, i) => `${c}${chars[(i + 1) % chars.length]}`).join(' ');

    // Sample vocabulary bank targeting specific letters
    const vocabBank: Record<string, string[]> = {
      q: ['quick', 'quiet', 'quest', 'equal', 'unique', 'quote'],
      p: ['power', 'point', 'paper', 'pixel', 'apply', 'purple'],
      z: ['zero', 'zone', 'zebra', 'freeze', 'prize', 'breeze'],
      x: ['exact', 'extra', 'exist', 'index', 'relax', 'matrix'],
      b: ['build', 'brave', 'about', 'table', 'labor', 'brick'],
      c: ['clear', 'cycle', 'reach', 'voice', 'exact', 'focus'],
      v: ['voice', 'vivid', 'level', 'every', 'event', 'brave'],
      m: ['match', 'smart', 'model', 'limit', 'frame', 'human'],
      w: ['water', 'power', 'world', 'write', 'award', 'allow'],
      y: ['yield', 'entry', 'layer', 'party', 'style', 'cycle'],
    };

    const targetWords: string[] = [];
    chars.forEach((c) => {
      const words = vocabBank[c] || [`${c}at`, `${c}an`, `re${c}`];
      targetWords.push(...words.slice(0, 2));
    });

    return `${repeats} ${pairs} ${targetWords.join(' ')} ${pairs}`;
  };

  const handleStartTargetedDrill = () => {
    const keys = weakKeys.map((k) => k.key);
    const drill = generateDrillForKeys(keys);
    setActiveDrillText(drill);
  };

  if (activeDrillText) {
    return (
      <div id="active-weak-key-drill-view" className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveDrillText(null)}
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            ← Back to Weak Key Analysis
          </button>
          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold">
            Targeted Weak-Key Drill
          </span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-rose-600 dark:text-rose-400 mb-1">
            <Target className="w-4 h-4" />
            Adaptive Neural Conditioning
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Personalized Weak-Key Workout
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            This exercise is dynamically engineered to strengthen your fingers on the exact keys you previously mistyped.
          </p>
        </div>

        <TypingEngine
          key="weak-key-active-session"
          title="Personalized Weak-Key Drill"
          category="Adaptive Drills"
          practiceText={activeDrillText}
          mode="weak-keys"
          showKeyboard={true}
          showFingerGuide={true}
          onPracticeWeakKeys={handleStartTargetedDrill}
        />
      </div>
    );
  }

  return (
    <div id="weak-key-analyzer-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-rose-600 dark:text-rose-400 mb-1">
            <Target className="w-4 h-4" />
            Adaptive Coaching
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Weak-Key Diagnostics & Targeted Drills
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Our real-time diagnostic engine monitors every single keystroke to identify awkward reach patterns and fatigue.
          </p>
        </div>

        <button
          id="start-weak-drill-btn"
          onClick={handleStartTargetedDrill}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 hover:scale-105 transition-all self-start md:self-auto"
        >
          <Play className="w-4 h-4" />
          Practice Weak Keys Drill
        </button>
      </div>

      {/* Weak Keys Heatmap / List */}
      {weakKeys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weakKeys.slice(0, 8).map((k) => {
            const accuracy = Math.max(
              10,
              Math.round(((k.totalAttempts - k.errors) / Math.max(1, k.totalAttempts)) * 100)
            );
            return (
              <div
                key={k.key}
                id={`weak-key-card-${k.key}`}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-mono font-extrabold text-2xl flex items-center justify-center">
                    {k.key === ' ' ? '␣' : k.key.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mistakes</div>
                    <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                      {k.errors} errors
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Accuracy</span>
                  <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                    {accuracy}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Zero Weak Keys Recorded
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            Take a typing test or complete a few lessons! As you type, any errors will automatically populate here with customized recovery exercises.
          </p>
          <button
            onClick={handleStartTargetedDrill}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Run Diagnostic Calibration Drill
          </button>
        </div>
      )}

      {/* Educational Tips on Weak Keys */}
      <div className="p-6 bg-slate-100 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
          How to Overcome Weak Keys Faster:
        </h4>
        <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
          <li><strong>Identify the responsible finger:</strong> The pinky finger accounts for 65% of all typing errors due to lower baseline muscle endurance.</li>
          <li><strong>Slow down on target digrams:</strong> Intentionally pause for half a second before striking awkward pairs like `P-L`, `B-R`, or `Q-U`.</li>
          <li><strong>Return to Home Row anchor:</strong> Always reset your index fingers to the tactile bumps on F and J after every stretch.</li>
        </ul>
      </div>
    </div>
  );
};
