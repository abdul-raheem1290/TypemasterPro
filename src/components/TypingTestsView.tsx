import React, { useState } from 'react';
import { TEST_PRESETS, TestPreset } from '../data/sampleTests';
import { TypingEngine } from './TypingEngine';
import { storage } from '../services/storage';
import { 
  Timer, 
  Sparkles, 
  Play, 
  Settings2, 
  Code, 
  FileText, 
  Quote, 
  Hash, 
  Clock, 
  CheckCircle2, 
  PlusCircle,
  Award
} from 'lucide-react';

interface TypingTestsViewProps {
  onViewCertificate?: () => void;
  onPracticeWeakKeys?: () => void;
}

export const TypingTestsView: React.FC<TypingTestsViewProps> = ({
  onViewCertificate,
  onPracticeWeakKeys,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<TestPreset | null>(null);
  const [activeDuration, setActiveDuration] = useState<number>(60);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Custom text creator state
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [customDuration, setCustomDuration] = useState<number>(60);

  const filterPresets = TEST_PRESETS.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    return true;
  });

  const handleStartCustomTest = () => {
    if (!customText.trim()) return;
    storage.saveCustomText(customText);
    setSelectedPreset({
      id: 'custom-' + Date.now(),
      title: 'Custom User Test',
      category: 'sentences',
      durationSeconds: customDuration,
      description: 'User-provided custom typing evaluation.',
      text: customText.trim(),
    });
    setIsCustomMode(false);
  };

  if (selectedPreset) {
    return (
      <div id="active-test-view" className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <button
            id="back-to-test-menu-btn"
            onClick={() => setSelectedPreset(null)}
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            ← Back to Tests Menu
          </button>

          <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
            {selectedPreset.durationSeconds}s Timed Evaluation
          </span>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <Timer className="w-4 h-4" />
            {selectedPreset.category.toUpperCase()} TEST
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {selectedPreset.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {selectedPreset.description}
          </p>
        </div>

        <TypingEngine
          key={selectedPreset.id}
          title={selectedPreset.title}
          category={selectedPreset.category}
          practiceText={selectedPreset.text}
          mode="test"
          timeLimitSeconds={selectedPreset.durationSeconds}
          showKeyboard={true}
          showFingerGuide={true}
          onPracticeWeakKeys={onPracticeWeakKeys}
          onViewCertificate={onViewCertificate}
        />
      </div>
    );
  }

  return (
    <div id="tests-hub-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <Timer className="w-4 h-4" />
            Professional Typing Assessment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Typing Speed & Accuracy Tests
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Select standardized 15s sprints, 1-minute gold benchmarks, or custom employment certification tests.
          </p>
        </div>

        <button
          id="open-custom-test-btn"
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all shrink-0 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          {isCustomMode ? 'View Presets' : 'Create Custom Test'}
        </button>
      </div>

      {/* Custom Test Builder Panel */}
      {isCustomMode && (
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-900 shadow-md flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Paste or Type Your Custom Text
            </h3>
            <span className="text-xs text-slate-400">Great for students, coders, and writers</span>
          </div>

          <textarea
            id="custom-test-textarea"
            rows={4}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your legal document, study notes, book passage, or programming code here to practice..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Test Duration:</span>
              {[30, 60, 120, 300].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setCustomDuration(dur)}
                  className={`px-3 py-1.5 rounded-lg font-mono ${
                    customDuration === dur
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>

            <button
              id="launch-custom-test-btn"
              disabled={!customText.trim()}
              onClick={handleStartCustomTest}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Custom Test
            </button>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Tests' },
          { id: 'words', label: 'Words Sprints' },
          { id: 'sentences', label: 'Sentences' },
          { id: 'paragraph', label: 'Paragraphs & Benchmarks' },
          { id: 'code', label: 'Programming Code' },
          { id: 'numbers', label: 'Numbers & Currency' },
          { id: 'punctuation', label: 'Punctuation & Quotes' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Test Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterPresets.map((preset) => (
          <div
            key={preset.id}
            id={`test-preset-${preset.id}`}
            onClick={() => setSelectedPreset(preset)}
            className="cursor-pointer group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 text-xs font-bold font-mono">
                  {preset.durationSeconds} SECONDS
                </span>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  {preset.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {preset.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {preset.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                ~{Math.round(preset.text.length / 5)} words
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                Take Test <Play className="w-3.5 h-3.5 fill-indigo-600 dark:fill-indigo-400" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
