import React, { useMemo } from 'react';

interface VirtualKeyboardProps {
  activeChar: string;
  isError?: boolean;
  showFingerGuide?: boolean;
}

interface KeyDef {
  key: string;
  shiftKey?: string;
  label?: string;
  finger: 'lp' | 'lr' | 'lm' | 'li' | 'th' | 'ri' | 'rm' | 'rr' | 'rp';
  width?: string;
}

const FINGER_INFO: Record<string, { name: string; color: string; bg: string }> = {
  lp: { name: 'Left Pinky', color: 'text-pink-600 dark:text-pink-400', bg: 'border-pink-300 dark:border-pink-800' },
  lr: { name: 'Left Ring', color: 'text-indigo-600 dark:text-indigo-400', bg: 'border-indigo-300 dark:border-indigo-800' },
  lm: { name: 'Left Middle', color: 'text-cyan-600 dark:text-cyan-400', bg: 'border-cyan-300 dark:border-cyan-800' },
  li: { name: 'Left Index', color: 'text-emerald-600 dark:text-emerald-400', bg: 'border-emerald-300 dark:border-emerald-800' },
  th: { name: 'Thumb (Space)', color: 'text-amber-600 dark:text-amber-400', bg: 'border-amber-300 dark:border-amber-800' },
  ri: { name: 'Right Index', color: 'text-emerald-600 dark:text-emerald-400', bg: 'border-emerald-300 dark:border-emerald-800' },
  rm: { name: 'Right Middle', color: 'text-cyan-600 dark:text-cyan-400', bg: 'border-cyan-300 dark:border-cyan-800' },
  rr: { name: 'Right Ring', color: 'text-indigo-600 dark:text-indigo-400', bg: 'border-indigo-300 dark:border-indigo-800' },
  rp: { name: 'Right Pinky', color: 'text-pink-600 dark:text-pink-400', bg: 'border-pink-300 dark:border-pink-800' },
};

const KEYBOARD_ROWS: KeyDef[][] = [
  // Number row
  [
    { key: '`', shiftKey: '~', finger: 'lp' },
    { key: '1', shiftKey: '!', finger: 'lp' },
    { key: '2', shiftKey: '@', finger: 'lr' },
    { key: '3', shiftKey: '#', finger: 'lm' },
    { key: '4', shiftKey: '$', finger: 'li' },
    { key: '5', shiftKey: '%', finger: 'li' },
    { key: '6', shiftKey: '^', finger: 'ri' },
    { key: '7', shiftKey: '&', finger: 'ri' },
    { key: '8', shiftKey: '*', finger: 'rm' },
    { key: '9', shiftKey: '(', finger: 'rr' },
    { key: '0', shiftKey: ')', finger: 'rp' },
    { key: '-', shiftKey: '_', finger: 'rp' },
    { key: '=', shiftKey: '+', finger: 'rp' },
    { key: 'Backspace', label: '⌫', finger: 'rp', width: 'w-16' },
  ],
  // Top row
  [
    { key: 'Tab', label: 'Tab', finger: 'lp', width: 'w-14' },
    { key: 'q', shiftKey: 'Q', finger: 'lp' },
    { key: 'w', shiftKey: 'W', finger: 'lr' },
    { key: 'e', shiftKey: 'E', finger: 'lm' },
    { key: 'r', shiftKey: 'R', finger: 'li' },
    { key: 't', shiftKey: 'T', finger: 'li' },
    { key: 'y', shiftKey: 'Y', finger: 'ri' },
    { key: 'u', shiftKey: 'U', finger: 'ri' },
    { key: 'i', shiftKey: 'I', finger: 'rm' },
    { key: 'o', shiftKey: 'O', finger: 'rr' },
    { key: 'p', shiftKey: 'P', finger: 'rp' },
    { key: '[', shiftKey: '{', finger: 'rp' },
    { key: ']', shiftKey: '}', finger: 'rp' },
    { key: '\\', shiftKey: '|', finger: 'rp', width: 'w-12' },
  ],
  // Home row
  [
    { key: 'CapsLock', label: 'Caps', finger: 'lp', width: 'w-16' },
    { key: 'a', shiftKey: 'A', finger: 'lp' },
    { key: 's', shiftKey: 'S', finger: 'lr' },
    { key: 'd', shiftKey: 'D', finger: 'lm' },
    { key: 'f', shiftKey: 'F', finger: 'li' },
    { key: 'g', shiftKey: 'G', finger: 'li' },
    { key: 'h', shiftKey: 'H', finger: 'ri' },
    { key: 'j', shiftKey: 'J', finger: 'ri' },
    { key: 'k', shiftKey: 'K', finger: 'rm' },
    { key: 'l', shiftKey: 'L', finger: 'rr' },
    { key: ';', shiftKey: ':', finger: 'rp' },
    { key: "'", shiftKey: '"', finger: 'rp' },
    { key: 'Enter', label: 'Enter', finger: 'rp', width: 'w-20' },
  ],
  // Bottom row
  [
    { key: 'ShiftLeft', label: 'Shift', finger: 'lp', width: 'w-20' },
    { key: 'z', shiftKey: 'Z', finger: 'lp' },
    { key: 'x', shiftKey: 'X', finger: 'lr' },
    { key: 'c', shiftKey: 'C', finger: 'lm' },
    { key: 'v', shiftKey: 'V', finger: 'li' },
    { key: 'b', shiftKey: 'B', finger: 'li' },
    { key: 'n', shiftKey: 'N', finger: 'ri' },
    { key: 'm', shiftKey: 'M', finger: 'ri' },
    { key: ',', shiftKey: '<', finger: 'rm' },
    { key: '.', shiftKey: '>', finger: 'rr' },
    { key: '/', shiftKey: '?', finger: 'rp' },
    { key: 'ShiftRight', label: 'Shift', finger: 'rp', width: 'w-24' },
  ],
  // Space row
  [
    { key: 'Ctrl', label: 'Ctrl', finger: 'lp', width: 'w-14' },
    { key: 'Alt', label: 'Alt', finger: 'lp', width: 'w-12' },
    { key: ' ', label: 'Space', finger: 'th', width: 'flex-1 max-w-sm' },
    { key: 'Alt', label: 'Alt', finger: 'rp', width: 'w-12' },
    { key: 'Ctrl', label: 'Ctrl', finger: 'rp', width: 'w-14' },
  ]
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeChar,
  isError = false,
  showFingerGuide = true,
}) => {
  // Find which key matches activeChar
  const activeKeyInfo = useMemo(() => {
    if (!activeChar) return null;
    const char = activeChar;
    for (const row of KEYBOARD_ROWS) {
      for (const k of row) {
        if (k.key === char || k.shiftKey === char || (k.key === ' ' && char === ' ')) {
          const requiresShift = Boolean(k.shiftKey && k.shiftKey === char);
          return { key: k, requiresShift };
        }
      }
    }
    return null;
  }, [activeChar]);

  const activeFinger = activeKeyInfo ? FINGER_INFO[activeKeyInfo.key.finger] : null;

  return (
    <div id="virtual-keyboard-container" className="w-full max-w-4xl mx-auto p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all">
      {/* Finger Guidance Banner */}
      {showFingerGuide && (
        <div id="finger-guide-banner" className="mb-3 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Target Key:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold">
              {activeChar === ' ' ? 'SPACE' : activeChar || 'Ready'}
            </span>
            {activeKeyInfo?.requiresShift && (
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-mono font-semibold">
                + Shift
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Finger:</span>
            <span className={`font-semibold ${activeFinger ? activeFinger.color : 'text-slate-700 dark:text-slate-300'}`}>
              {activeFinger ? activeFinger.name : 'Home Row Position'}
            </span>
          </div>
        </div>
      )}

      {/* Keyboard Matrix */}
      <div className="flex flex-col gap-1.5 select-none text-slate-800 dark:text-slate-200">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((kDef, kIdx) => {
              const isTargetKey =
                kDef.key === activeChar ||
                kDef.shiftKey === activeChar ||
                (kDef.key === ' ' && activeChar === ' ');

              const isShiftNeeded =
                activeKeyInfo?.requiresShift &&
                ((kDef.key === 'ShiftLeft' && ['rp', 'rm', 'rr', 'ri'].includes(activeKeyInfo.key.finger)) ||
                  (kDef.key === 'ShiftRight' && ['lp', 'lm', 'lr', 'li'].includes(activeKeyInfo.key.finger)));

              const isFOrJ = kDef.key === 'f' || kDef.key === 'j';

              let keyClasses = 'h-9 sm:h-11 rounded-lg flex flex-col items-center justify-center font-mono text-xs sm:text-sm font-medium transition-all relative border ';

              if (isTargetKey) {
                if (isError) {
                  keyClasses += 'bg-rose-500 text-white border-rose-600 scale-95 shadow-md shadow-rose-500/30';
                } else {
                  keyClasses += 'bg-indigo-600 text-white border-indigo-700 scale-105 shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400 dark:ring-indigo-300';
                }
              } else if (isShiftNeeded) {
                keyClasses += 'bg-indigo-500/80 text-white border-indigo-600 animate-pulse';
              } else {
                keyClasses += 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-2xs';
              }

              const widthClass = kDef.width || 'w-8 sm:w-11';

              return (
                <div
                  key={kIdx}
                  id={`vk-key-${kDef.key}`}
                  className={`${keyClasses} ${widthClass}`}
                >
                  {kDef.shiftKey && (
                    <span className={`text-[10px] sm:text-xs opacity-60 leading-none ${isTargetKey ? 'text-white' : ''}`}>
                      {kDef.shiftKey}
                    </span>
                  )}
                  <span className="leading-tight">
                    {kDef.label || kDef.key.toUpperCase()}
                  </span>
                  {/* F and J Home Row Nub Indicators */}
                  {isFOrJ && (
                    <div className="absolute bottom-1 w-2.5 h-0.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
