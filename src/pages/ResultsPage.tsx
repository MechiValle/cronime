import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { loadSaveData } from '../storage/localStorage';
import { formatTime } from '../utils/formatTime';
import { tokens } from '../theme';
import type { GameOverResult } from '../hooks/useGame';

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state as GameOverResult | null;

  useEffect(() => {
    if (!result) {
      navigate('/', { replace: true });
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const saveData = loadSaveData();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 4,
        padding: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" sx={{ color: tokens.color.textPrimary }}>
        {result.isNewRecord ? 'New Record!' : 'Game Over'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Final Streak:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {result.finalStreak}
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Time:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {formatTime(result.finalTimeMs)}
          </Box>
        </Typography>

        <Box sx={{ height: 8 }} />

        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Best Streak:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {saveData.bestStreak}
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Best Time:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {formatTime(saveData.bestTime)}
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Games Played:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {saveData.totalGames}
          </Box>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" color="secondary" size="large" onClick={() => navigate('/')}>
          Home
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/game')}>
          Play Again
        </Button>
      </Box>
    </Box>
  );
}