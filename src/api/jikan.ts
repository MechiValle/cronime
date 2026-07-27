import type { Anime } from '../types/anime';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const TARGET_POOL_SIZE = 500;
const REQUEST_DELAY_MS = 1100; 
const MAX_RETRIES = 4;
const MIN_VIABLE_POOL_SIZE = 50;

type JikanAnimeEntry = {
  mal_id: number;
  title: string;
  year: number | null;
  images?: {
    jpg?: {
      large_image_url?: string;
    };
  };
};

type JikanTopAnimeResponse = {
  data: JikanAnimeEntry[];
  pagination: {
    has_next_page: boolean;
    last_visible_page: number;
  };
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toAnime(entry: JikanAnimeEntry): Anime | null {
  const imageUrl = entry.images?.jpg?.large_image_url;

  if (!entry.title || !imageUrl || !entry.year) {
    return null;
  }

  return {
    id: entry.mal_id,
    title: entry.title,
    imageUrl,
    year: entry.year,
  };
}

async function fetchTopAnimePage(
  page: number,
  attempt = 1
): Promise<JikanTopAnimeResponse> {
  const response = await fetch(`${JIKAN_BASE_URL}/top/anime?page=${page}`);

  if (!response.ok) {
    const isTransient = response.status === 504 || response.status === 429;

    if (isTransient && attempt < MAX_RETRIES) {
      await delay(1500 * attempt);
      return fetchTopAnimePage(page, attempt + 1);
    }

    throw new Error(`Jikan request failed on page ${page}: ${response.status}`);
  }

  return response.json();
}

export async function fetchAnimePool(): Promise<Anime[]> {
  const pool: Anime[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage && pool.length < TARGET_POOL_SIZE) {
    try {
      const response = await fetchTopAnimePage(page);

      const validEntries = response.data
        .map(toAnime)
        .filter((anime): anime is Anime => anime !== null);

      pool.push(...validEntries);

      hasNextPage = response.pagination.has_next_page;
      page += 1;

      if (hasNextPage && pool.length < TARGET_POOL_SIZE) {
        await delay(REQUEST_DELAY_MS);
      }
    } catch (error) {
      console.warn(
        `Stopping pool fetch early at page ${page} after repeated failures.`,
        error
      );
      break;
    }
  }

  if (pool.length < MIN_VIABLE_POOL_SIZE) {
    throw new Error(
      `Anime pool too small to play (${pool.length} entries). Jikan may be down.`
    );
  }

  return pool;
}