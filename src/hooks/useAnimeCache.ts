import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Anime } from '../types/anime';
import { fetchAnimePool } from '../api/jikan';
import { loadSaveData, saveAnimeCache, isCacheStale } from '../storage/localStorage';

const ANIME_CACHE_QUERY_KEY = ['animeCache'];

async function getAnimeCache(): Promise<Anime[]> {
  const saveData = loadSaveData();

  if (saveData.animeCache.length > 0) {
    return saveData.animeCache;
  }


  const freshPool = await fetchAnimePool();
  saveAnimeCache(freshPool);
  return freshPool;
}

export function useAnimeCache() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ANIME_CACHE_QUERY_KEY,
    queryFn: getAnimeCache,
    staleTime: Infinity,
  });

  useEffect(() => {
    const saveData = loadSaveData();
    const shouldRefreshInBackground =
      saveData.animeCache.length > 0 && isCacheStale(saveData.lastUpdated);

    if (!shouldRefreshInBackground) {
      return;
    }

    fetchAnimePool()
      .then((freshPool) => {
        saveAnimeCache(freshPool);
        queryClient.setQueryData(ANIME_CACHE_QUERY_KEY, freshPool);
      })
      .catch(() => {

      });
  }, []);

  return {
    animeCache: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}