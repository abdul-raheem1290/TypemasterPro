import React, { useState } from 'react';
import { ViewTab } from '../types';
import { TypingEngine } from './TypingEngine';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Timer, 
  Target, 
  Gamepad2, 
  Award, 
  ShieldCheck, 
  Zap, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface HomeHeroProps {
  onSelectTab: (tab: ViewTab) => void;
  onStartLesson: (lessonId: number) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onSelectTab, onStartLesson }) => {
  const [miniTestDuration, setMiniTestDuration] = useState<number>(30);
  const [testKey, setTestKey] = useState<number>(1);

  const miniTestText =
    "Focus on accuracy first and your speed will naturally follow. Touch typing is the ultimate digital superpower, freeing your mind to think and create with absolute confidence.";

  return (
    <div id="home-view-container" className="flex flex-col gap-16 py-8">
      {/* Hero Intro */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Complete Professional Typing School & Testing Suite</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.15] mb-6">
          Master Your Typing. <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Every Keystroke Counts.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Learn faster. Type smarter. Practice with 100+ structured lessons, instant weak-key diagnostics, 5 arcade typing games, and verifiable achievement certificates.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            id="hero-start-practice-btn"
            onClick={() => onSelectTab('lessons')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            Start Typing Practice
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-take-test-btn"
            onClick={() => onSelectTab('tests')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-base shadow-sm hover:-translate-y-0.5 transition-all"
          >
            <Timer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Take a Typing Test
          </button>

          <button
            id="hero-learn-touch-btn"
            onClick={() => onStartLesson(1)}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Beginner Lesson 1
          </button>
        </div>
      </section>

      {/* Platform Real Statistics Grid */}
      <section className="max-w-6xl mx-auto w-full px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 p-4 sm:p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-xs">
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">100+</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Structured Lessons</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">50+</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Typing Tests</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">10</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Curriculum Levels</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">5</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Arcade Games</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">100%</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Free Forever</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">Real-Time</div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Weak-Key Coach</div>
          </div>
        </div>
      </section>

      {/* Live Mini Typing Test Widget */}
      <section className="max-w-5xl mx-auto w-full px-4">
        <div className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Timer className="w-4 h-4" />
                Live Quick Test Widget
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                Test Your Typing Speed Right Now
              </h2>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl">
              {[15, 30, 60].map((dur) => (
                <button
                  key={dur}
                  onClick={() => {
                    setMiniTestDuration(dur);
                    setTestKey((k) => k + 1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    miniTestDuration === dur
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>

          <TypingEngine
            key={`mini-test-${miniTestDuration}-${testKey}`}
            title={`Quick ${miniTestDuration}s Typing Benchmark`}
            practiceText={miniTestText}
            mode="test"
            timeLimitSeconds={miniTestDuration}
            showKeyboard={true}
            showFingerGuide={true}
            onPracticeWeakKeys={() => onSelectTab('weak-keys')}
            onViewCertificate={() => onSelectTab('dashboard')}
          />
        </div>
      </section>

      {/* Why TypeMaster Pro Feature Cards */}
      <section className="max-w-6xl mx-auto w-full px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Why Choose TypeMaster Pro?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-base">
            Engineered with deep EdTech learning principles to systematically rewire your keyboard reflexes from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Adaptive Weak-Key Coaching
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Don’t waste time practicing keys you already know. Our engine pinpoints your most mistyped keys and dynamically generates personalized drills to iron them out.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              5 Arcade Gamified Modes
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Transform practice into play with Word Rush, Falling Words, Type Racer, Zombie Defense, and Space Navigator. Build speed under high-pressure scenarios.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Verifiable Achievement Certificates
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Reach speed milestones (30, 50, 70, 90, 100 WPM) to earn elegant, personalized certificates featuring your verified WPM, accuracy, and official verification code.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action banner */}
      <section className="max-w-5xl mx-auto w-full px-4">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Ready to double your typing speed?
            </h3>
            <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
              Start with Level 1 Home Row fundamentals or jump right into intermediate paragraph drills. Free forever, no account required to practice.
            </p>
          </div>

          <button
            id="cta-start-now-btn"
            onClick={() => onSelectTab('lessons')}
            className="px-8 py-4 rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 font-extrabold text-base shadow-lg hover:scale-105 transition-all shrink-0"
          >
            Explore 100 Lessons
          </button>
        </div>
      </section>
    </div>
  );
};
