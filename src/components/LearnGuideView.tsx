import React, { useState } from 'react';
import { FAQS, BLOG_POSTS, TYPING_BENCHMARKS } from '../data/faqAndBlog';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  Zap, 
  Award,
  ArrowRight
} from 'lucide-react';

export const LearnGuideView: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const selectedArticle = BLOG_POSTS.find((p) => p.id === selectedBlogId);

  return (
    <div id="learn-guide-root" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          <BookOpen className="w-4 h-4" />
          Touch Typing Academy & Knowledge Base
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          The Science of Ergonomic Touch Typing
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mt-3 leading-relaxed">
          Master the biomechanics, finger assignments, and mental strategies required to reach effortless 100+ WPM typing speed without looking at the keys.
        </p>
      </div>

      {/* 4 Core Pillars of Touch Typing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center mb-3">
            01
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            The Home Row Anchor
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Rest your left fingers on <strong>A-S-D-F</strong> and right fingers on <strong>J-K-L-;</strong>. Feel the tactile bumps on <strong>F</strong> and <strong>J</strong> to navigate blindly.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center mb-3">
            02
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            Strict Finger Zones
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Each of your 10 fingers is assigned specific vertical and diagonal columns. Never cross fingers across columns to ensure predictable muscle memory.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center mb-3">
            03
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            Accuracy Before Speed
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Speed is a natural byproduct of accuracy. If you type fast with mistakes, you burn 3x more time hitting backspace and interrupting your flow.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center mb-3">
            04
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            Posture & Ergonomics
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Keep elbows at 90 degrees, wrists floating slightly rather than resting hard on desks, and screen at eye level to prevent carpal tunnel syndrome.
          </p>
        </div>
      </div>

      {/* Speed Benchmarks Table */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Global Typing Speed Benchmarks
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          Compare your words per minute (WPM) to international occupational standards.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TYPING_BENCHMARKS.map((b) => (
            <div
              key={b.level}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {b.level}
                </span>
                <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-slate-100 mt-1">
                  {b.wpm} <span className="text-xs font-normal text-slate-400">WPM</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Blog & Educational Articles */}
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
            Educational Guides
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Expert Typing Articles & Tutorials
          </h2>
        </div>

        {selectedArticle ? (
          <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedBlogId(null)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start"
            >
              ← Back to all articles
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="uppercase font-bold text-indigo-600 dark:text-indigo-400">
                {selectedArticle.category}
              </span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {selectedArticle.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {selectedArticle.summary}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              {selectedArticle.content.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedBlogId(post.id)}
                className="cursor-pointer group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Accordion */}
      <div className="p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Common Touch-Typing Inquiries
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-base text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed animate-in fade-in duration-150">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
