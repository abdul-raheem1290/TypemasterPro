export interface TestPreset {
  id: string;
  title: string;
  category: 'words' | 'sentences' | 'paragraph' | 'code' | 'numbers' | 'punctuation';
  durationSeconds: number;
  description: string;
  text: string;
}

export const TEST_PRESETS: TestPreset[] = [
  {
    id: 'test-15s-words',
    title: '15-Second Word Burst',
    category: 'words',
    durationSeconds: 15,
    description: 'Ultra-fast burst of common English words to test raw reflex acceleration.',
    text: 'time good each year make them see live find right word will give also back place after other look only come take know than'
  },
  {
    id: 'test-30s-sentences',
    title: '30-Second Sentence Sprint',
    category: 'sentences',
    durationSeconds: 30,
    description: 'Short test balancing punctuation, capitalization, and high-frequency verbs.',
    text: 'Every morning brings a new opportunity to learn something extraordinary. With patience and persistent practice, typing becomes as natural as speech itself.'
  },
  {
    id: 'test-60s-standard',
    title: '1-Minute Standard WPM Benchmark',
    category: 'paragraph',
    durationSeconds: 60,
    description: 'The international gold standard test for measuring typing speed and raw accuracy.',
    text: 'The ability to type quickly and accurately is one of the most practical digital skills anyone can master. It allows you to express your thoughts without friction, write documents in a fraction of the usual time, and navigate software with confidence. When your hands move instinctively across the keyboard, your creative mind is completely free to focus on solving problems and generating new ideas.'
  },
  {
    id: 'test-120s-endurance',
    title: '2-Minute Stamina Assessment',
    category: 'paragraph',
    durationSeconds: 120,
    description: 'Evaluate your ability to sustain high WPM without experiencing fatigue or accuracy dips.',
    text: 'Throughout history, breakthroughs in human communication have transformed civilization. In the ancient world, scribes painstakingly copied manuscripts by hand, preserving knowledge for the few who could read. The invention of movable type by Johannes Gutenberg democratized access to the written word, catalyzing revolutions in science, education, and philosophy. Today, the digital revolution has turned every computer into a personal printing press. By mastering the keyboard, you join a centuries-old tradition of thinkers, writers, and creators who harness technology to share knowledge and inspire future generations.'
  },
  {
    id: 'test-300s-pro',
    title: '5-Minute Professional Certification Test',
    category: 'paragraph',
    durationSeconds: 300,
    description: 'Comprehensive 5-minute typing test matching formal employment and exam standards.',
    text: 'Excellence in typing is built on the twin pillars of ergonomics and muscle memory. Ergonomics ensures that your physical posture protects your health: wrists hovering comfortably above the desk, back supported in a neutral vertical position, and elbows bent at approximately ninety degrees. Meanwhile, muscle memory develops through deliberate repetition. Rather than looking down at the keys to guide your fingers, your subconscious brain develops a rich spatial map of every key position. When you see a word, your fingers execute the corresponding keystrokes automatically, just as a pianist plays chords without staring at each key on the piano. To build this intuition, speed must always take second place to accuracy in the early stages. An error requires backspacing and correction, which breaks your cognitive flow and severely penalizes your net words per minute. By typing with deliberate precision, your raw velocity will naturally and steadily accelerate over time.'
  },
  {
    id: 'test-code-js',
    title: '60-Second Full-Stack Code Challenge',
    category: 'code',
    durationSeconds: 60,
    description: 'TypeScript function containing arrow syntax, arrays, destructuring, and generics.',
    text: 'export function processMetrics(data: number[], threshold: number = 50): { average: number; count: number } { const valid = data.filter(n => n >= threshold); const sum = valid.reduce((acc, curr) => acc + curr, 0); return { average: valid.length ? sum / valid.length : 0, count: valid.length }; }'
  },
  {
    id: 'test-numbers',
    title: '45-Second Number & Financial Run',
    category: 'numbers',
    durationSeconds: 45,
    description: 'Practice numbers, dollar amounts, percentages, and serial codes under time pressure.',
    text: 'In fiscal year 2025, company revenue grew by 14.8% to reach $4,850,200 across 12 product lines. Order #9482-B included 15 units at $89.50 each with a net discount of 5% applied at checkout.'
  },
  {
    id: 'test-punctuation',
    title: '45-Second Punctuation & Quotes Workout',
    category: 'punctuation',
    durationSeconds: 45,
    description: 'Sentences loaded with dialog quotes, semicolons, em-dashes, and parenthetical thoughts.',
    text: '"Wait!" called the teacher; "Before you submit the exam (version 2.1), ensure all questions are answered." Truly—with hard work and careful attention—nothing is impossible!'
  }
];
