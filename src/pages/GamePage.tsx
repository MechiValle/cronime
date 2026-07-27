import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useAnimeCache } from '../hooks/useAnimeCache';
import { useGame } from '../hooks/useGame';
import Header from '../components/Header';
import Timer from '../components/Timer';
import AnimeCard from '../components/AnimeCard';
import { tokens } from '../theme';

export default function GamePage() {
  const navigate = useNavigate();
  const { animeCache, isLoading } = useAnimeCache();
  const {
    status,
    question,
    leftAnime,
    rightAnime,
    leftYearVisible,
    rightYearVisible,
    feedbackLeft,
    feedbackRight,
    streak,
    elapsedMs,
    gameOverResult,
    startGame,
    selectAnime,
  } = useGame(animeCache);

  useEffect(() => {
    if (!isLoading && animeCache.length > 0 && status === 'idle') {
      startGame();
    }
  }, [isLoading, animeCache.length, status, startGame]);

  useEffect(() => {
    if (status === 'gameover' && gameOverResult) {
      navigate('/results', { state: gameOverResult });
    }
  }, [status, gameOverResult, navigate]);

  const isBoardLoading = isLoading || !leftAnime || !rightAnime;
  const cardsDisabled = status !== 'playing';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Header question={question} streak={streak} />
      <Timer elapsedMs={elapsedMs} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          minHeight: 0,
        }}
      >
        {isBoardLoading ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
              Loading anime library…
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <AnimeCard
                anime={leftAnime}
                showYear={leftYearVisible}
                feedback={feedbackLeft}
                disabled={cardsDisabled}
                onSelect={() => selectAnime('left')}
              />
            </Box>

            <Box
              sx={{
                width: { xs: '100%', sm: '2px' },
                height: { xs: '2px', sm: '100%' },
                backgroundColor: tokens.color.violet,
              }}
            />

            <Box sx={{ flex: 1, position: 'relative' }}>
              <AnimeCard
                anime={rightAnime}
                showYear={rightYearVisible}
                feedback={feedbackRight}
                disabled={cardsDisabled}
                onSelect={() => selectAnime('right')}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}