import type { Anime } from "./anime";


export type SaveData = {
  bestStreak: number;
  bestTime: number;
  totalGames: number;
  animeCache: Anime[];
  lastUpdated: string;
};