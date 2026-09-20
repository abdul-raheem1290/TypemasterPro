import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../services/audio';
import { storage } from '../services/storage';
import { 
  Gamepad2, 
  Flame, 
  Rocket, 
  Car, 
  Skull, 
  RotateCcw, 
  Play, 
  Trophy, 
  Heart, 
  Zap,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

type GameType = 'menu' | 'word-rush' | 'falling-words' | 'type-racer' | 'zombie-typing' | 'space-typing';

const GAME_WORDS = [
  'quick', 'focus', 'speed', 'rhythm', 'swift', 'power', 'pixel', 'logic', 'cyber',
  'matrix', 'master', 'keystroke', 'cadence', 'accuracy', 'keyboard', 'velocity',
  'quantum', 'circuit', 'stream', 'rocket', 'galaxy', 'future', 'hyper', 'pulse',
  'energy', 'falcon', 'comet', 'vector', 'orbit', 'stellar', 'plasma', 'meteor'
];

export const GamesHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  // ==========================================
  // GAME 1: WORD RUSH STATE
  // ==========================================
  const [rushWord, setRushWord] = useState<string>('speed');
  const [rushInput, setRushInput] = useState<string>('');
  const [rushScore, setRushScore] = useState<number>(0);
  const [rushTimeLeft, setRushTimeLeft] = useState<number>(30);
  const [rushGameOver, setRushGameOver] = useState<boolean>(false);

  // ==========================================
  // GAME 2: FALLING WORDS STATE
  // ==========================================
  interface FallingItem {
    id: number;
    word: string;
    top: number; // 0 to 100 percentage
    lane: number; // 0 to 3
  }
  const [fallingWords, setFallingWords] = useState<FallingItem[]>([]);
  const [fallingInput, setFallingInput] = useState<string>('');
  const [fallingScore, setFallingScore] = useState<number>(0);
  const [fallingLives, setFallingLives] = useState<number>(3);
  const [fallingGameOver, setFallingGameOver] = useState<boolean>(false);

  // ==========================================
  // GAME 3: TYPE RACER STATE
  // ==========================================
  const racerPassage = "The engine roars as you press the accelerator. High-speed typing puts you ahead of the competition on the circuit.";
  const [racerTyped, setRacerTyped] = useState<string>('');
  const [racerProgress, setRacerProgress] = useState<number>(0); // 0 to 100
  const [rivalProgress, setRivalProgress] = useState<number>(0); // 0 to 100
  const [racerWinner, setRacerWinner] = useState<string | null>(null);

  // ==========================================
  // GAME 4: ZOMBIE TYPING STATE
  // ==========================================
  interface Zombie {
    id: number;
    word: string;
    distance: number; // 100 to 0 (reaches player at 0)
  }
  const [zombies, setZombies] = useState<Zombie[]>([]);
  const [zombieInput, setZombieInput] = useState<string>('');
  const [zombieScore, setZombieScore] = useState<number>(0);
  const [zombieHealth, setZombieHealth] = useState<number>(100);
  const [zombieGameOver, setZombieGameOver] = useState<boolean>(false);

  // ==========================================
  // GAME 5: SPACE TYPING STATE
  // ==========================================
  interface Asteroid {
    id: number;
    word: string;
    distance: number; // 100 to 0
  }
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [spaceInput, setSpaceInput] = useState<string>('');
  const [spaceScore, setSpaceScore] = useState<number>(0);
  const [spaceShields, setSpaceShields] = useState<number>(3);
  const [spaceGameOver, setSpaceGameOver] = useState<boolean>(false);

  // ------------------------------------------
  // GAME 1 LOGIC: WORD RUSH
  // ------------------------------------------
  const startWordRush = () => {
    setRushScore(0);
    setRushTimeLeft(30);
    setRushGameOver(false);
    setRushInput('');
    setRushWord(GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)]);
    setActiveGame('word-rush');
  };

  useEffect(() => {
    if (activeGame !== 'word-rush' || rushGameOver) return;
    const interval = setInterval(() => {
      setRushTimeLeft((t) => {
        if (t <= 1) {
          setRushGameOver(true);
          sound.playSuccess();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeGame, rushGameOver]);

  const handleRushInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRushInput(val);
    if (val.trim().toLowerCase() === rushWord.toLowerCase()) {
      sound.playKeyClick();
      setRushScore((s) => s + 1);
      setRushInput('');
      setRushWord(GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)]);
    }
  };

  // ------------------------------------------
  // GAME 2 LOGIC: FALLING WORDS
  // ------------------------------------------
  const startFallingWords = () => {
    setFallingWords([
      { id: Date.now(), word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)], top: 0, lane: 1 },
      { id: Date.now() + 1, word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)], top: -30, lane: 2 },
    ]);
    setFallingScore(0);
    setFallingLives(3);
    setFallingGameOver(false);
    setFallingInput('');
    setActiveGame('falling-words');
  };

  useEffect(() => {
    if (activeGame !== 'falling-words' || fallingGameOver) return;

    const interval = setInterval(() => {
      setFallingWords((prev) => {
        let lifeLost = false;
        const updated = prev
          .map((item) => ({ ...item, top: item.top + 4 }))
          .filter((item) => {
            if (item.top >= 95) {
              lifeLost = true;
              return false;
            }
            return true;
          });

        if (lifeLost) {
          sound.playError();
          setFallingLives((lives) => {
            if (lives <= 1) {
              setFallingGameOver(true);
              return 0;
            }
            return lives - 1;
          });
        }

        // Add new falling word if count is low
        if (updated.length < 3 && Math.random() > 0.4) {
          updated.push({
            id: Date.now() + Math.random(),
            word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)],
            top: 0,
            lane: Math.floor(Math.random() * 4),
          });
        }

        return updated;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [activeGame, fallingGameOver]);

  const handleFallingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setFallingInput(e.target.value);

    const matchIndex = fallingWords.findIndex((item) => item.word.toLowerCase() === val);
    if (matchIndex !== -1) {
      sound.playKeyClick();
      setFallingScore((s) => s + 10);
      setFallingWords((prev) => prev.filter((_, idx) => idx !== matchIndex));
      setFallingInput('');
    }
  };

  // ------------------------------------------
  // GAME 3 LOGIC: TYPE RACER
  // ------------------------------------------
  const startTypeRacer = () => {
    setRacerTyped('');
    setRacerProgress(0);
    setRivalProgress(0);
    setRacerWinner(null);
    setActiveGame('type-racer');
  };

  useEffect(() => {
    if (activeGame !== 'type-racer' || racerWinner) return;

    // Move AI rival car steadily
    const rivalInterval = setInterval(() => {
      setRivalProgress((prev) => {
        const next = prev + Math.random() * 2.5 + 1.2;
        if (next >= 100) {
          setRacerWinner('Rival Car');
          sound.playError();
          return 100;
        }
        return next;
      });
    }, 800);

    return () => clearInterval(rivalInterval);
  }, [activeGame, racerWinner]);

  const handleRacerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (racerWinner) return;

    if (e.key === racerPassage[racerTyped.length]) {
      sound.playKeyClick();
      const nextTyped = racerTyped + e.key;
      setRacerTyped(nextTyped);
      const prog = Math.min(100, Math.round((nextTyped.length / racerPassage.length) * 100));
      setRacerProgress(prog);

      if (nextTyped.length >= racerPassage.length) {
        setRacerWinner('Player');
        sound.playFanfare();
        confetti({ particleCount: 70, spread: 60 });
      }
    } else if (e.key.length === 1 && !['Shift', 'Control', 'Alt'].includes(e.key)) {
      sound.playError();
    }
  };

  // ------------------------------------------
  // GAME 4 LOGIC: ZOMBIE TYPING
  // ------------------------------------------
  const startZombieTyping = () => {
    setZombies([
      { id: 1, word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)], distance: 100 },
      { id: 2, word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)], distance: 130 },
    ]);
    setZombieScore(0);
    setZombieHealth(100);
    setZombieGameOver(false);
    setZombieInput('');
    setActiveGame('zombie-typing');
  };

  useEffect(() => {
    if (activeGame !== 'zombie-typing' || zombieGameOver) return;

    const interval = setInterval(() => {
      setZombies((prev) => {
        let damage = 0;
        const updated = prev
          .map((z) => ({ ...z, distance: z.distance - 4 }))
          .filter((z) => {
            if (z.distance <= 10) {
              damage += 20;
              return false;
            }
            return true;
          });

        if (damage > 0) {
          sound.playError();
          setZombieHealth((h) => {
            const next = h - damage;
            if (next <= 0) {
              setZombieGameOver(true);
              return 0;
            }
            return next;
          });
        }

        if (updated.length < 3 && Math.random() > 0.3) {
          updated.push({
            id: Date.now() + Math.random(),
            word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)],
            distance: 100 + Math.random() * 30,
          });
        }

        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [activeGame, zombieGameOver]);

  const handleZombieInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setZombieInput(e.target.value);

    const matchIdx = zombies.findIndex((z) => z.word.toLowerCase() === val);
    if (matchIdx !== -1) {
      sound.playKeyClick();
      setZombieScore((s) => s + 25);
      setZombies((prev) => prev.filter((_, idx) => idx !== matchIdx));
      setZombieInput('');
    }
  };

  // ------------------------------------------
  // GAME 5 LOGIC: SPACE TYPING
  // ------------------------------------------
  const startSpaceTyping = () => {
    setAsteroids([
      { id: 1, word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)], distance: 100 },
      { id: 2, word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)], distance: 140 },
    ]);
    setSpaceScore(0);
    setSpaceShields(3);
    setSpaceGameOver(false);
    setSpaceInput('');
    setActiveGame('space-typing');
  };

  useEffect(() => {
    if (activeGame !== 'space-typing' || spaceGameOver) return;

    const interval = setInterval(() => {
      setAsteroids((prev) => {
        let shieldHit = false;
        const updated = prev
          .map((a) => ({ ...a, distance: a.distance - 5 }))
          .filter((a) => {
            if (a.distance <= 10) {
              shieldHit = true;
              return false;
            }
            return true;
          });

        if (shieldHit) {
          sound.playError();
          setSpaceShields((s) => {
            if (s <= 1) {
              setSpaceGameOver(true);
              return 0;
            }
            return s - 1;
          });
        }

        if (updated.length < 3 && Math.random() > 0.4) {
          updated.push({
            id: Date.now() + Math.random(),
            word: GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)],
            distance: 120 + Math.random() * 20,
          });
        }

        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [activeGame, spaceGameOver]);

  const handleSpaceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setSpaceInput(e.target.value);

    const matchIdx = asteroids.findIndex((a) => a.word.toLowerCase() === val);
    if (matchIdx !== -1) {
      sound.playKeyClick();
      setSpaceScore((s) => s + 50);
      setAsteroids((prev) => prev.filter((_, idx) => idx !== matchIdx));
      setSpaceInput('');
    }
  };

  return (
    <div id="games-hub-root" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 mb-1">
            <Gamepad2 className="w-4 h-4" />
            Arcade Gamification Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            5 Interactive Typing Games
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Reinforce touch-typing muscle memory, speed bursts, and reaction reflexes through arcade gameplay.
          </p>
        </div>

        {activeGame !== 'menu' && (
          <button
            onClick={() => setActiveGame('menu')}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 self-start md:self-auto"
          >
            ← Back to Games Menu
          </button>
        )}
      </div>

      {/* GAME MENU */}
      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Word Rush */}
          <div
            id="game-card-word-rush"
            onClick={startWordRush}
            className="cursor-pointer group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Game 1: Word Rush
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Words flash rapidly in the center. Type as many as you can before the 30-second clock expires!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Fast-Paced Velocity</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Play Now <Play className="w-3.5 h-3.5 fill-amber-500" />
              </span>
            </div>
          </div>

          {/* Card 2: Falling Words */}
          <div
            id="game-card-falling-words"
            onClick={startFallingWords}
            className="cursor-pointer group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-600 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Game 2: Falling Words
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Words cascade downwards towards a danger line. Type them quickly to zap them before you lose your 3 lives.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <span>Reaction & Multi-Word Scan</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Play Now <Play className="w-3.5 h-3.5 fill-cyan-500" />
              </span>
            </div>
          </div>

          {/* Card 3: Type Racer */}
          <div
            id="game-card-type-racer"
            onClick={startTypeRacer}
            className="cursor-pointer group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Game 3: Type Racer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                A visual racetrack simulator where your sports car accelerates across the track as you type accurately against an AI pace-car!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <span>Track Speed Sprint</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Play Now <Play className="w-3.5 h-3.5 fill-indigo-500" />
              </span>
            </div>
          </div>

          {/* Card 4: Zombie Typing */}
          <div
            id="game-card-zombie-typing"
            onClick={startZombieTyping}
            className="cursor-pointer group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Skull className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Game 4: Zombie Typing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Enemies march toward your barricade. Type the words floating above their heads to blast them before they reach you.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Survival Defense</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Play Now <Play className="w-3.5 h-3.5 fill-emerald-500" />
              </span>
            </div>
          </div>

          {/* Card 5: Space Typing */}
          <div
            id="game-card-space-typing"
            onClick={startSpaceTyping}
            className="cursor-pointer group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Game 5: Space Typing
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Command a starship cruising through deep space. Blast incoming meteors by typing targeting coordinates before your shields fail!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Sci-Fi Starship Reflex</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Play Now <Play className="w-3.5 h-3.5 fill-purple-500" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE GAME 1: WORD RUSH */}
      {activeGame === 'word-rush' && (
        <div className="max-w-2xl mx-auto w-full p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-amber-500 font-mono">Word Rush</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold font-mono">Score: {rushScore}</span>
              <span className="text-sm font-bold font-mono text-rose-500">⏱ {rushTimeLeft}s</span>
            </div>
          </div>

          {!rushGameOver ? (
            <div className="w-full flex flex-col items-center gap-6 my-4">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-wide text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 px-8 py-6 rounded-2xl border border-slate-200 dark:border-slate-700 w-full">
                {rushWord}
              </div>

              <input
                type="text"
                autoFocus
                value={rushInput}
                onChange={handleRushInputChange}
                placeholder="Type the word above..."
                className="w-full p-4 text-center font-mono text-xl rounded-2xl bg-white dark:bg-slate-950 border-2 border-indigo-500 focus:outline-none shadow-sm"
              />
            </div>
          ) : (
            <div className="my-6">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3" />
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Time's Up!</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
                You successfully typed <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{rushScore}</span> words in 30 seconds!
              </p>
              <button
                onClick={startWordRush}
                className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE GAME 2: FALLING WORDS */}
      {activeGame === 'falling-words' && (
        <div className="max-w-2xl mx-auto w-full p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-cyan-500 font-mono">Falling Words</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold font-mono">Score: {fallingScore}</span>
              <span className="text-sm font-bold font-mono text-rose-500">❤️ {fallingLives} Lives</span>
            </div>
          </div>

          {!fallingGameOver ? (
            <div className="w-full flex flex-col items-center">
              {/* Falling Area Stage */}
              <div className="w-full h-80 bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-800 mb-4">
                {fallingWords.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      top: `${item.top}%`,
                      left: `${20 + item.lane * 20}%`,
                    }}
                    className="absolute -translate-x-1/2 px-3 py-1 bg-cyan-500/90 text-white font-mono text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all duration-300"
                  >
                    {item.word}
                  </div>
                ))}
                {/* Danger line */}
                <div className="absolute bottom-2 left-0 right-0 h-0.5 bg-rose-500/80 border-t border-dashed border-rose-400" />
              </div>

              <input
                type="text"
                autoFocus
                value={fallingInput}
                onChange={handleFallingInputChange}
                placeholder="Type falling word to zap it..."
                className="w-full p-3.5 text-center font-mono text-lg rounded-2xl bg-white dark:bg-slate-950 border-2 border-cyan-500 focus:outline-none"
              />
            </div>
          ) : (
            <div className="my-6 text-center">
              <Trophy className="w-16 h-16 text-cyan-500 mx-auto mb-3" />
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Game Over!</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
                Final Score: <span className="font-bold text-cyan-500 font-mono">{fallingScore}</span> points!
              </p>
              <button
                onClick={startFallingWords}
                className="mt-6 px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm shadow-md"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE GAME 3: TYPE RACER */}
      {activeGame === 'type-racer' && (
        <div className="max-w-3xl mx-auto w-full p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">Type Racer Circuit</span>
            <span className="text-xs font-semibold text-slate-400">Type passage to accelerate</span>
          </div>

          {/* Racetrack Visual */}
          <div className="p-4 bg-slate-950 rounded-2xl flex flex-col gap-4 border border-slate-800">
            {/* Player Car Track */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-indigo-400 w-14">YOU:</span>
              <div className="flex-1 bg-slate-800 h-8 rounded-xl relative overflow-hidden">
                <div
                  style={{ left: `${Math.min(92, racerProgress)}%` }}
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-150 flex items-center gap-1 text-xs font-bold text-indigo-400"
                >
                  🏎️
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 w-10 text-right">{racerProgress}%</span>
            </div>

            {/* Rival Car Track */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-rose-400 w-14">RIVAL:</span>
              <div className="flex-1 bg-slate-800 h-8 rounded-xl relative overflow-hidden">
                <div
                  style={{ left: `${Math.min(92, rivalProgress)}%` }}
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 flex items-center gap-1 text-xs font-bold text-rose-400"
                >
                  🚗
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 w-10 text-right">{Math.round(rivalProgress)}%</span>
            </div>
          </div>

          {/* Text Passage */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl font-mono text-base sm:text-lg leading-relaxed border border-slate-200 dark:border-slate-750">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{racerTyped}</span>
            <span className="text-slate-900 dark:text-white font-bold bg-indigo-500/30 px-0.5">
              {racerPassage[racerTyped.length] || ''}
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              {racerPassage.slice(racerTyped.length + 1)}
            </span>
          </div>

          <input
            type="text"
            autoFocus
            onKeyDown={handleRacerKeyDown}
            placeholder="Type the passage above to drive..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-950 border-2 border-indigo-500 text-center font-mono text-base focus:outline-none"
          />

          {racerWinner && (
            <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-900">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                {racerWinner === 'Player' ? '🏆 Victory! You won the race!' : '🏁 Rival car crossed the finish line first!'}
              </h4>
              <button
                onClick={startTypeRacer}
                className="mt-3 px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Race Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE GAME 4: ZOMBIE TYPING */}
      {activeGame === 'zombie-typing' && (
        <div className="max-w-2xl mx-auto w-full p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-emerald-500 font-mono">Zombie Typing Defense</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold font-mono">Score: {zombieScore}</span>
              <span className="text-sm font-bold font-mono text-emerald-500">🛡️ HP: {zombieHealth}%</span>
            </div>
          </div>

          {!zombieGameOver ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-72 bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-800 mb-4 p-4 flex flex-col justify-around">
                {zombies.map((z) => (
                  <div
                    key={z.id}
                    style={{ left: `${Math.max(10, Math.min(85, z.distance))}%` }}
                    className="relative transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="text-2xl">🧟</span>
                    <span className="px-2.5 py-0.5 bg-emerald-600/90 text-white text-xs font-mono font-bold rounded shadow-sm">
                      {z.word}
                    </span>
                  </div>
                ))}
              </div>

              <input
                type="text"
                autoFocus
                value={zombieInput}
                onChange={handleZombieInput}
                placeholder="Type zombie words to shoot them..."
                className="w-full p-3.5 text-center font-mono text-lg rounded-2xl bg-white dark:bg-slate-950 border-2 border-emerald-500 focus:outline-none"
              />
            </div>
          ) : (
            <div className="my-6 text-center">
              <Skull className="w-16 h-16 text-rose-500 mx-auto mb-3" />
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Barricade Breached!</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
                Zombies defeated: <span className="font-bold text-emerald-500 font-mono">{zombieScore / 25}</span> ({zombieScore} pts)
              </p>
              <button
                onClick={startZombieTyping}
                className="mt-6 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md"
              >
                Defend Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE GAME 5: SPACE TYPING */}
      {activeGame === 'space-typing' && (
        <div className="max-w-2xl mx-auto w-full p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-purple-500 font-mono">Starship Navigation</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold font-mono">Score: {spaceScore}</span>
              <span className="text-sm font-bold font-mono text-purple-400">⚡ {spaceShields} Shields</span>
            </div>
          </div>

          {!spaceGameOver ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-72 bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-800 mb-4 p-4 flex flex-col justify-around">
                {asteroids.map((a) => (
                  <div
                    key={a.id}
                    style={{ left: `${Math.max(10, Math.min(85, a.distance))}%` }}
                    className="relative transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="text-2xl">☄️</span>
                    <span className="px-2.5 py-0.5 bg-purple-600/90 text-white text-xs font-mono font-bold rounded shadow-sm">
                      {a.word}
                    </span>
                  </div>
                ))}
              </div>

              <input
                type="text"
                autoFocus
                value={spaceInput}
                onChange={handleSpaceInput}
                placeholder="Type asteroid coordinates to blast..."
                className="w-full p-3.5 text-center font-mono text-lg rounded-2xl bg-white dark:bg-slate-950 border-2 border-purple-500 focus:outline-none"
              />
            </div>
          ) : (
            <div className="my-6 text-center">
              <Rocket className="w-16 h-16 text-purple-500 mx-auto mb-3" />
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Shields Depleted!</h3>
              <p className="text-base text-slate-600 dark:text-slate-400 mt-1">
                Asteroids Destroyed: <span className="font-bold text-purple-500 font-mono">{spaceScore / 50}</span> ({spaceScore} pts)
              </p>
              <button
                onClick={startSpaceTyping}
                className="mt-6 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md"
              >
                Launch Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
