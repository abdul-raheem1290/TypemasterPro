import React, { useRef, useState } from 'react';
import { storage } from '../services/storage';
import { Award, CheckCircle2, Download, Printer, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ onClose }) => {
  const profile = storage.getProfile();
  const history = storage.getTestHistory();
  const bestWpm = history.reduce((max, r) => Math.max(max, r.wpm), 45);
  const bestAccuracy = history.reduce((max, r) => Math.max(max, r.accuracy), 97.5);

  const [userName, setUserName] = useState<string>(profile.name || 'Jane Doe');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(Math.max(30, bestWpm));

  const certRef = useRef<HTMLDivElement | null>(null);

  const certificateId = `TMP-${(Math.abs(userName.split('').reduce((a, b) => a + b.charCodeAt(0), 1000) * 8923) % 90000000 + 10000000)}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    window.print();
  };

  return (
    <div
      id="certificate-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              Verifiable Achievement
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              TypeMaster Pro Certificate of Achievement
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Customization Row */}
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Name on Certificate:</span>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Speed Tier:</span>
            {[30, 50, 70, 90, 100].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedSpeed(tier)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                  selectedSpeed === tier
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-750'
                }`}
              >
                {tier} WPM
              </button>
            ))}
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CANVAS */}
        <div
          ref={certRef}
          id="printable-certificate-card"
          className="relative w-full p-8 sm:p-12 bg-amber-50/40 dark:bg-slate-950 border-8 border-double border-indigo-900 dark:border-indigo-800 rounded-3xl text-center flex flex-col items-center justify-between shadow-lg print:border-4"
        >
          {/* Certificate Watermark / Icon */}
          <div className="w-16 h-16 rounded-full bg-indigo-900 dark:bg-indigo-800 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-md">
            <Award className="w-9 h-9" />
          </div>

          <div className="text-xs uppercase tracking-[0.25em] font-extrabold text-indigo-900 dark:text-indigo-400">
            TypeMaster Pro Educational Platform
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-serif my-2 tracking-wide">
            Certificate of Typing Achievement
          </h1>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-serif italic mb-4">
            This certifies that
          </p>

          <div className="text-2xl sm:text-3xl font-bold font-serif text-indigo-950 dark:text-indigo-200 border-b-2 border-indigo-300 dark:border-indigo-700 px-8 pb-1 inline-block mb-4">
            {userName}
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-lg leading-relaxed mb-6 font-serif">
            has demonstrated verified touch-typing proficiency, completing rigorous standardized keyboard evaluation with high cadence and technical accuracy.
          </p>

          {/* Metrics badges */}
          <div className="flex items-center justify-center gap-6 my-2">
            <div className="p-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl min-w-[110px]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Speed Achieved</span>
              <div className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                {selectedSpeed} WPM
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl min-w-[110px]">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Accuracy</span>
              <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {bestAccuracy}%
              </div>
            </div>
          </div>

          {/* Signature & Date & ID Footer */}
          <div className="w-full grid grid-cols-3 items-end pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono">
            <div className="text-left">
              <div className="font-serif italic font-bold text-slate-800 dark:text-slate-200">TypeMaster Pro</div>
              <span className="text-[10px]">Academic Board</span>
            </div>

            <div className="text-center">
              <div className="font-bold text-slate-800 dark:text-slate-200">{dateStr}</div>
              <span className="text-[10px]">Issue Date</span>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-800 dark:text-slate-200">{certificateId}</div>
              <span className="text-[10px]">Verification ID</span>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 mt-6 font-sans">
            * This is an unofficial achievement credential issued by TypeMaster Pro and does not constitute an accredited government or academic degree.
          </div>
        </div>
      </div>
    </div>
  );
};
