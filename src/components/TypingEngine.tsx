import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CaretStyle, TestResult } from '../types';
import { calculateGrossWpm, calculateNetWpm, calculateAccuracy, calculateConsistency, formatTime } from '../services/wpmCalculator';
import { sound } from '../services/audio';
import { storage } from '../services/storage';
import { VirtualKeyboard } from './VirtualKeyboard';
import { RotateCcw, ArrowRight, Zap, Target, AlertCircle, Clock, CheckCircle2, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TypingEngineProps {
  title: string;
  category?: string;
  practiceText: string;
  mode: 'test' | 'lesson' | 'game' | 'custom' | 'weak-keys';
  timeLimitSeconds?: number; // if set, counts down; if undefined, counts up until text finished
  showKeyboard?: boolean;
  showFingerGuide?: boolean;
  caretStyle?: CaretStyle;
  onComplete?: (result: TestResult) => void;
  onNext?: () => void;
  onPracticeWeakKeys?: () => void;
  onViewCertificate?: () => void;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({
  title,
  category = 'General Practice',
  practiceText,
  mode,
  timeLimitSeconds,
  showKeyboard = true,
  showFingerGuide = true,
  caretStyle = 'line',
  onComplete,
  onNext,
  onPracticeWeakKeys,
  onViewCertificate,
}) => {
  const [typed, setTyped] = useState<string>('');
  const [mistakes, setMistakes] = useState<Record<number, boolean>>({});
  const [mistypedKeys, setMistypedKeys] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [lastErrorKey, setLastErrorKey] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<TestResult | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  const targetChars = practiceText.split('');
  const currentIndex = typed.length;
  const currentChar = currentIndex < targetChars.length ? targetChars[currentIndex] : '';

  // Focus hidden input on click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Reset engine
  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTyped('');
    setMistakes({});
    setMistypedKeys({});
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
    setWpmHistory([]);
    setLastErrorKey(false);
    setFinalResult(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  // Timer tick
  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(diff);

        // Record 1-sec WPM sample for consistency calculation
        if (diff > 0) {
          const currentWpm = calculateNetWpm(typed.length, diff);
          setWpmHistory((prev) => [...prev, currentWpm]);
        }

        // Time limit reached
        if (timeLimitSeconds && diff >= timeLimitSeconds) {
          handleFinish(diff);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isFinished, timeLimitSeconds, typed.length]);

  // Finish session
  const handleFinish = useCallback(
    (durationSec: number) => {
      if (isFinished) return;
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const actualDuration = Math.max(1, durationSec);
      const totalCharsTyped = typed.length;
      const errorCount = Object.keys(mistakes).length;
      const correctChars = Math.max(0, totalCharsTyped - errorCount);

      const netWpm = calculateNetWpm(correctChars, actualDuration);
      const rawWpm = calculateGrossWpm(totalCharsTyped, actualDuration);
      const accuracy = calculateAccuracy(correctChars, totalCharsTyped);
      const consistency = calculateConsistency(wpmHistory);

      const result: TestResult = {
        id: 'res-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        mode,
        title,
        durationSeconds: actualDuration,
        wpm: netWpm,
        rawWpm,
        accuracy,
        consistency,
        correctCharacters: correctChars,
        incorrectCharacters: errorCount,
        totalCharacters: totalCharsTyped,
        mistypedKeys,
      };

      setFinalResult(result);
      storage.addTestResult(result);
      storage.recordKeyStats(mistypedKeys, totalCharsTyped);
      storage.updateStreak();

      // Check achievements
      const profile = storage.getProfile();
      storage.unlockAchievement('first_keystroke');
      if (netWpm >= 30) storage.unlockAchievement('speed_30');
      if (netWpm >= 50) storage.unlockAchievement('speed_50');
      if (netWpm >= 70) storage.unlockAchievement('speed_70');
      if (netWpm >= 90) storage.unlockAchievement('speed_90');
      if (netWpm >= 100) storage.unlockAchievement('speed_100');
      if (accuracy >= 95 && totalCharsTyped > 40) storage.unlockAchievement('accuracy_95');
      if (accuracy >= 98 && totalCharsTyped > 40) storage.unlockAchievement('accuracy_98');
      if (accuracy === 100 && totalCharsTyped > 50) storage.unlockAchievement('accuracy_100');
      if (profile.streak.count >= 3) storage.unlockAchievement('streak_3');
      if (profile.streak.count >= 7) storage.unlockAchievement('streak_7');

      sound.playSuccess();

      // Celebration effect if speed is great
      if (netWpm >= 50) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      if (onComplete) {
        onComplete(result);
      }
    },
    [isFinished, typed.length, mistakes, mistypedKeys, wpmHistory, mode, title, onComplete]
  );

  // Character typing handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    // Ignore modifier keys alone
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
      return;
    }

    // Prevent default tab/space scrolling
    if (e.key === 'Tab' || e.key === ' ') {
      e.preventDefault();
    }

    // Start timer on first keystroke
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typed.length > 0) {
        setTyped((prev) => prev.slice(0, -1));
        setLastErrorKey(false);
        sound.playKeyClick();
      }
      return;
    }

    // Only process printable single character
    if (e.key.length === 1) {
      e.preventDefault();
      const expectedChar = targetChars[currentIndex];
      const isCorrect = e.key === expectedChar;

      if (isCorrect) {
        sound.playKeyClick();
        setLastErrorKey(false);
      } else {
        sound.playError();
        setLastErrorKey(true);
        // Track error by index and key
        setMistakes((prev) => ({ ...prev, [currentIndex]: true }));
        setMistypedKeys((prev) => ({
          ...prev,
          [expectedChar]: (prev[expectedChar] || 0) + 1,
        }));
      }

      const nextTyped = typed + e.key;
      setTyped(nextTyped);

      // Check if text is completed
      if (nextTyped.length >= targetChars.length) {
        const now = Date.now();
        const durationSec = Math.max(1, Math.floor((now - (startTime || now)) / 1000));
        handleFinish(durationSec);
      }
    }
  };

  // Real-time metrics
  const totalTyped = typed.length;
  const currentErrors = Object.keys(mistakes).length;
  const correctCount = Math.max(0, totalTyped - currentErrors);
  const currentNetWpm = calculateNetWpm(correctCount, elapsedSeconds);
  const currentRawWpm = calculateGrossWpm(totalTyped, elapsedSeconds);
  const currentAccuracy = calculateAccuracy(correctCount, totalTyped);
  const progressPercent = Math.min(100, Math.round((totalTyped / targetChars.length) * 100));

  const remainingSeconds = timeLimitSeconds ? Math.max(0, timeLimitSeconds - elapsedSeconds) : elapsedSeconds;

  // Caret styles
  const getCaretClass = () => {
    switch (caretStyle) {
      case 'block':
        return 'bg-indigo-500/40 text-slate-900 dark:text-white';
      case 'underline':
        return 'border-b-2 border-indigo-500 animate-pulse';
      case 'line':
      default:
        return 'border-l-2 border-indigo-500 animate-pulse';
    }
  };

  return (
    <div id="typing-engine-root" className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header Stat Bar */}
      <div
        id="engine-stats-bar"
        className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Speed</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {currentNetWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Accuracy</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {currentAccuracy}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Errors</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {currentErrors}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {timeLimitSeconds ? 'Time Left' : 'Elapsed'}
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {formatTime(remainingSeconds)}
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
          <button
            id="reset-practice-btn"
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-200 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Interactive Typing Area */}
      <div
        id="typing-text-display-box"
        onClick={focusInput}
        ref={textContainerRef}
        className="cursor-text relative p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[220px] flex flex-col justify-between transition-all hover:border-indigo-300 dark:hover:border-indigo-800/80 focus-within:ring-2 focus-within:ring-indigo-500/20"
      >
        {/* Hidden Input that captures all keystrokes */}
        <input
          id="hidden-typing-input"
          ref={inputRef}
          type="text"
          value=""
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="opacity-0 absolute inset-0 w-full h-full cursor-text"
          aria-label="Typing input area"
        />

        {/* Text Presentation */}
        <div className="font-mono text-lg sm:text-2xl leading-relaxed sm:leading-loose tracking-wide select-none text-slate-400 dark:text-slate-500">
          {targetChars.map((char, index) => {
            const isTyped = index < typed.length;
            const isCurrent = index === typed.length;
            const hasMistake = mistakes[index];

            let charClasses = '';

            if (isTyped) {
              if (hasMistake) {
                charClasses = 'text-rose-500 underline decoration-rose-500 decoration-2 bg-rose-50 dark:bg-rose-950/40 rounded-xs';
              } else {
                charClasses = 'text-emerald-600 dark:text-emerald-400 font-medium';
              }
            } else if (isCurrent) {
              charClasses = `text-slate-900 dark:text-white font-bold ${getCaretClass()}`;
            }

            return (
              <span key={index} className={charClasses}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Click prompt helper */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-sans border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Click anywhere here or start typing directly</span>
          </div>
          <div className="text-right">
            <span>{typed.length} / {targetChars.length} characters ({progressPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <VirtualKeyboard
          activeChar={currentChar}
          isError={lastErrorKey}
          showFingerGuide={showFingerGuide}
        />
      )}

      {/* Completion Modal */}
      {isFinished && finalResult && (
        <div
          id="results-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            id="results-modal-card"
            className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
                  Session Completed
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center">
                <div className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">Net WPM</div>
                <div className="text-3xl font-extrabold font-mono text-indigo-700 dark:text-indigo-300 mt-1">
                  {finalResult.wpm}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Raw: {finalResult.rawWpm}</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-center">
                <div className="text-xs text-emerald-600 dark:text-emerald-300 font-medium">Accuracy</div>
                <div className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
                  {finalResult.accuracy}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Errors: {finalResult.incorrectCharacters}</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-center">
                <div className="text-xs text-amber-600 dark:text-amber-300 font-medium">Consistency</div>
                <div className="text-3xl font-extrabold font-mono text-amber-700 dark:text-amber-300 mt-1">
                  {finalResult.consistency}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Cadence Steady</div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/40 text-center">
                <div className="text-xs text-cyan-600 dark:text-cyan-300 font-medium">Duration</div>
                <div className="text-3xl font-extrabold font-mono text-cyan-700 dark:text-cyan-300 mt-1">
                  {formatTime(finalResult.durationSeconds)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{finalResult.totalCharacters} chars</div>
              </div>
            </div>

            {/* Mistyped keys breakdown */}
            {Object.keys(finalResult.mistypedKeys).length > 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 mb-6">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>Weak Keys Detected in Session</span>
                  <span className="text-rose-500 font-normal">Need targeted drill</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(finalResult.mistypedKeys).map(([k, count]) => (
                    <span
                      key={k}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-rose-200 dark:border-rose-900 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
                    >
                      <span>{k === ' ' ? 'SPACE' : k}</span>
                      <span className="text-[10px] px-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300">
                        {count}x
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="text-xs text-emerald-800 dark:text-emerald-300">
                  Flawless accuracy run! Zero mistyped keys detected during this session.
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                id="modal-try-again-btn"
                onClick={handleReset}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>

              {Object.keys(finalResult.mistypedKeys).length > 0 && onPracticeWeakKeys && (
                <button
                  id="modal-practice-weak-btn"
                  onClick={() => {
                    setIsFinished(false);
                    onPracticeWeakKeys();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Practice Weak Keys
                </button>
              )}

              {onNext ? (
                <button
                  id="modal-next-lesson-btn"
                  onClick={() => {
                    setIsFinished(false);
                    onNext();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  Next Lesson
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : onViewCertificate ? (
                <button
                  id="modal-claim-cert-btn"
                  onClick={() => {
                    setIsFinished(false);
                    onViewCertificate();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Claim Certificate
                </button>
              ) : (
                <button
                  id="modal-continue-btn"
                  onClick={() => setIsFinished(false)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  Close Results
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
