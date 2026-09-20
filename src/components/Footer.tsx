import React from 'react';
import { ViewTab } from '../types';
import { Sparkles, Heart, Keyboard, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: ViewTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-base shadow-sm">
                T
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
                TypeMaster <span className="text-indigo-600 dark:text-indigo-400">Pro</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The premier web-based touch typing academy and benchmarking suite. Designed to help professionals, students, and programmers type faster, accurately, and effortlessly.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% Free Forever • Client-Side Offline First
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home & Quick Benchmark
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('lessons')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  100 Structured Lessons
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('tests')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Speed Tests (15s–5min)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('games')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  5 Arcade Typing Games
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('weak-keys')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Weak-Key Coach
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  User Stats & History
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('learn')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Ergonomics & FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Keyboard Shortcuts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5" /> Hotkeys
            </h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Restart Test</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] border border-slate-200 dark:border-slate-700">Tab + Enter</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Pause Session</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] border border-slate-200 dark:border-slate-700">Esc</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Home Keys</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">F & J Bumps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} TypeMaster Pro. All rights reserved. Open learning platform.
          </div>
          <div className="flex items-center gap-1">
            Engineered with precision for peak human typing performance.
          </div>
        </div>
      </div>
    </footer>
  );
};
