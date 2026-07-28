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
        {result.isNewRecord ? '¡Nuevo Récord!' : 'Racha Concluída'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Racha Actual:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {result.finalStreak}
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Tiempo:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {formatTime(result.finalTimeMs)}
          </Box>
        </Typography>

        <Box sx={{ height: 8 }} />

        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Mejor Racha:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {saveData.bestStreak}
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Mejor Tiempo:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {formatTime(saveData.bestTime)}
          </Box>
        </Typography>

        <Typography variant="body1" sx={{ color: tokens.color.textSecondary }}>
          Partidas Jugadas:{' '}
          <Box component="span" sx={{ color: tokens.color.gold, fontWeight: 700 }}>
            {saveData.totalGames}
          </Box>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" color="secondary" size="large" onClick={() => navigate('/')}>
          Inicio
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/game')}>
          Jugar otra vez
        </Button>
      </Box>
    </Box>
  );
}