/**
 * Typing speed and accuracy calculation engine
 * Adheres to standard EdTech metrics: 5 characters = 1 word
 */

export function calculateGrossWpm(totalChars: number, timeSeconds: number): number {
  if (timeSeconds <= 0 || totalChars <= 0) return 0;
  const minutes = timeSeconds / 60;
  return Math.round((totalChars / 5) / minutes);
}

export function calculateNetWpm(correctChars: number, timeSeconds: number): number {
  if (timeSeconds <= 0 || correctChars <= 0) return 0;
  const minutes = timeSeconds / 60;
  return Math.max(0, Math.round((correctChars / 5) / minutes));
}

export function calculateAccuracy(correctChars: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  const accuracy = (correctChars / totalKeystrokes) * 100;
  return Math.min(100, Math.max(0, Math.round(accuracy * 10) / 10));
}

/**
 * Consistency percentage based on variance between interval speeds.
 * 100% means completely steady cadence; lower scores indicate bursts and pauses.
 */
export function calculateConsistency(wpmHistory: number[]): number {
  if (wpmHistory.length < 3) return 92; // default reasonable benchmark
  
  const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
  if (mean <= 0) return 85;

  const variance = wpmHistory.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpmHistory.length;
  const stdDev = Math.sqrt(variance);

  // Coefficient of Variation percentage
  const cv = (stdDev / mean) * 100;
  const consistencyScore = Math.max(10, Math.min(100, 100 - cv * 0.8));
  return Math.round(consistencyScore);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDurationHours(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m ${Math.floor(seconds % 60)}s`;
}
