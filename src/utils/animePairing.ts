import type { Anime } from '../types/anime';

const MIN_YEAR_DIFFERENCE = 3;

export function isValidPair(a: Anime, b: Anime): boolean {
  return a.id !== b.id && Math.abs(a.year - b.year) >= MIN_YEAR_DIFFERENCE;
}

export function pickInitialPair(
  pool: Anime[],
  excludeIds: Set<number>
): { left: Anime; right: Anime } | null {
  const available = pool.filter((anime) => !excludeIds.has(anime.id));

  for (let attempt = 0; attempt < 300; attempt++) {
    const left = available[Math.floor(Math.random() * available.length)];
    const right = available[Math.floor(Math.random() * available.length)];

    if (left && right && isValidPair(left, right)) {
      return { left, right };
    }
  }

  return null;
}

export function pickReplacement(
  pool: Anime[],
  survivor: Anime,
  excludeIds: Set<number>
): Anime | null {
  const candidates = pool.filter(
    (anime) => !excludeIds.has(anime.id) && isValidPair(anime, survivor)
  );

  if (candidates.length === 0) return null;

  return candidates[Math.floor(Math.random() * candidates.length)];
}