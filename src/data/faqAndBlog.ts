export interface Article {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  recommendedAction: { label: string; tab: string };
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const ARTICLES: Article[] = [
  {
    slug: 'how-to-increase-typing-speed',
    title: 'How to Increase Typing Speed: The Proven 8-Step Blueprint',
    category: 'Speed Training',
    readTime: '4 min read',
    summary: 'Discover why slowing down to prioritize accuracy accelerates long-term WPM gains faster than brute force.',
    content: [
      'Most typists hit a frustrating speed plateau between 35 and 45 words per minute. The reason is usually simple: they rely on visual confirmation (looking down at the keys) or two-finger "hunt-and-peck" habits formed during childhood.',
      'To break through to 60+ WPM, you must transition to touch typing. In touch typing, your fingers act as automated sensory probes guided by the tactile bumps on the F and J keys.',
      'Step 1: Never look at the keyboard. Even if you miss three keys in a row, let your fingers search by spatial coordinates.',
      'Step 2: Prioritize 98%+ accuracy over raw speed. Correcting errors consumes double the time of slow, steady typing.',
      'Step 3: Practice in 15-minute daily sessions. Consistency produces significantly better neurological consolidation than sporadic 2-hour marathon sessions.'
    ],
    recommendedAction: { label: 'Start Beginner Home Row', tab: 'lessons' }
  },
  {
    slug: 'what-is-wpm-and-good-score',
    title: 'What is WPM and What Counts as a Good Typing Speed?',
    category: 'Benchmarking',
    readTime: '3 min read',
    summary: 'Understanding the standard 5-character formula and global typing distribution across professional industries.',
    content: [
      'WPM stands for Words Per Minute. In standardized typing measurement, a "word" is defined universally as 5 keystrokes, including letters, punctuation, and spaces.',
      'The average worldwide typing speed is approximately 40 WPM. Professional writers, paralegals, and software developers typically type between 60 and 80 WPM.',
      'Speeds exceeding 90 WPM place you in the top 5% of typists, while 100+ WPM is considered supersonic competitive velocity.',
      'When evaluating your performance, always inspect Net WPM rather than Gross WPM. Net WPM subtracts uncorrected errors, giving an accurate picture of real-world productivity.'
    ],
    recommendedAction: { label: 'Take 1-Minute WPM Test', tab: 'tests' }
  },
  {
    slug: 'ergonomics-and-hand-posture',
    title: 'Ergonomics for Typists: Protecting Wrists and Eliminating Fatigue',
    category: 'Health & Technique',
    readTime: '4 min read',
    summary: 'Prevent repetitive strain injury (RSI) and carpal tunnel syndrome with proper keyboard geometry.',
    content: [
      'Speed and endurance are impossible without proper biomechanics. If your wrists rest heavily on the table while typing, your extensor tendons are forced into an unnatural upward bend called extension.',
      'Position your keyboard so your elbows bend at a 90 to 100-degree angle. Your forearms should be parallel to the floor.',
      'Float your wrists gently while active. Think of a concert pianist: their wrists float weightlessly above the keys rather than resting on the piano wood.',
      'Take 30-second micro-breaks every 20 minutes to shake out your hands, stretch your fingers, and focus your eyes on a distant object.'
    ],
    recommendedAction: { label: 'Try Adaptive Weak-Key Drill', tab: 'weak-keys' }
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is WPM and how is it calculated on TypeMaster Pro?',
    answer: 'WPM stands for Words Per Minute. We use the internationally standardized typing equation where 5 characters (including letters, spaces, and punctuation) equal one standard word. Net WPM is calculated as (Total Characters - Uncorrected Errors) / 5 divided by elapsed minutes.',
    category: 'General'
  },
  {
    question: 'What is considered a good typing speed?',
    answer: 'The global average speed is approximately 40 WPM with 92% accuracy. Speeds of 50–65 WPM are considered proficient for office and professional work. Speeds of 70–85 WPM represent advanced typists, while 90+ WPM is elite.',
    category: 'Benchmarks'
  },
  {
    question: 'Is TypeMaster Pro completely free to use?',
    answer: 'Yes! All 100 structured lessons, speed tests, weak-key drills, interactive games, certificates, and dashboard analytics are 100% free with no paywalls or required subscriptions.',
    category: 'Platform'
  },
  {
    question: 'How long does it take to learn touch typing?',
    answer: 'With 15 to 20 minutes of disciplined daily practice on our 10-level curriculum, most beginners develop reliable touch-typing muscle memory within 2 to 3 weeks and reach 50+ WPM within 6 to 8 weeks.',
    category: 'Learning'
  },
  {
    question: 'Can I practice on mobile or tablet devices?',
    answer: 'While TypeMaster Pro is fully responsive and functions on mobile touch keyboards, we strongly recommend connecting a physical keyboard for touch-typing training to develop genuine tactile finger memory.',
    category: 'Hardware'
  },
  {
    question: 'How does the Weak-Key Analyzer work?',
    answer: 'During every lesson, test, and game, TypeMaster Pro tracks every individual keystroke. If you repeatedly mistype specific characters (e.g. P, Q, Z, or B), our adaptive engine highlights those keys and generates customized drill exercises targeting those exact finger motions.',
    category: 'Features'
  },
  {
    question: 'Where is my progress stored?',
    answer: 'In Phase 1, all your stats, completed lessons, daily streaks, test histories, and unlocked achievements are securely stored in your browser’s LocalStorage. You can export a complete JSON backup or CSV report at any time from your Dashboard.',
    category: 'Privacy'
  }
];

export const TYPING_BENCHMARKS = [
  { level: 'Beginner', wpm: '0–25', description: 'Visual hunt-and-peck typist. Relying heavily on looking at keys.' },
  { level: 'Casual', wpm: '26–45', description: 'Everyday typing for email and casual messaging.' },
  { level: 'Proficient', wpm: '46–65', description: 'Standard professional office and administrative speed.' },
  { level: 'Advanced', wpm: '66–85', description: 'Software developers, legal transcriptionists, writers.' },
  { level: 'Elite', wpm: '86–100+', description: 'Top 2% competitive touch typists and speedrunners.' },
];

export const FAQS = FAQ_ITEMS;
export const BLOG_POSTS = ARTICLES.map((a) => ({
  id: a.slug,
  title: a.title,
  category: a.category,
  readTime: a.readTime,
  date: 'Updated recently',
  summary: a.summary,
  content: a.content.join('\n\n'),
}));

