import type { Anime } from '../types/anime';
import type { SaveData } from '../types/saveData';

const STORAGE_KEY = 'animeChronologyChallenge.saveData';
const CACHE_MAX_AGE_DAYS = 7;

const defaultSaveData: SaveData = {
  bestStreak: 0,
  bestTime: 0,
  totalGames: 0,
  animeCache: [],
  lastUpdated: '',
};

export function loadSaveData(): SaveData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...defaultSaveData };
  }

  try {
    const parsed = JSON.parse(raw) as SaveData;
    return {
      ...defaultSaveData,
      ...parsed,
    };
  } catch {
    return { ...defaultSaveData };
  }
}

export function saveSaveData(data: SaveData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function isCacheStale(lastUpdated: string): boolean {
  if (!lastUpdated) return true;

  const last = new Date(lastUpdated).getTime();
  const now = Date.now();
  const ageInDays = (now - last) / (1000 * 60 * 60 * 24);

  return ageInDays > CACHE_MAX_AGE_DAYS;
}

export function saveAnimeCache(animeCache: Anime[]): void {
  const current = loadSaveData();
  const updated: SaveData = {
    ...current,
    animeCache,
    lastUpdated: new Date().toISOString(),
  };
  saveSaveData(updated);
}

export function incrementGamesPlayed(): SaveData {
  const current = loadSaveData();
  const updated: SaveData = {
    ...current,
    totalGames: current.totalGames + 1,
  };
  saveSaveData(updated);
  return updated;
}

export function maybeUpdateRecord(
  finalStreak: number,
  finalTime: number
): { data: SaveData; isNewRecord: boolean } {
  const current = loadSaveData();
  let isNewRecord = false;
  let bestStreak = current.bestStreak;
  let bestTime = current.bestTime;

  if (
    finalStreak > current.bestStreak ||
    (finalStreak === current.bestStreak && finalTime < current.bestTime)
  ) {
    const beatsTime =
      current.bestTime === 0 ? true : finalTime < current.bestTime;

    if (finalStreak > current.bestStreak || beatsTime) {
      bestStreak = finalStreak;
      bestTime = finalTime;
      isNewRecord = true;
    }
  }

  const updated: SaveData = {
    ...current,
    bestStreak,
    bestTime,
  };
  saveSaveData(updated);
  return { data: updated, isNewRecord };
}