import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { loadSaveData } from '../storage/localStorage';
import { formatTime } from '../utils/formatTime';
import { tokens } from '../theme';

export default function HomePage() {
  const navigate = useNavigate();
  const saveData = loadSaveData();

  const handleStart = () => {
    navigate('/game');
  };

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
      <Typography
        variant="h2"
        sx={{
          color: tokens.color.textPrimary,
        }}
      >
        Cronimé
      </Typography>
            <Typography
        variant="subtitle1"
        sx={{
          color: tokens.color.textPrimary,
        }}
      >
        ¿Cuál de estos dos es el más nuevo? ¿Cuál es el más antiguo?
        <br></br>
        Poné a prueba tu conocimiento sobre animé.
      </Typography>
      

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
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

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleStart}
        sx={{
          paddingX: 5,
          paddingY: 1.5,
          fontSize: '1.1rem',
        }}
      >
        Jugar
      </Button>
    </Box>
  );
}