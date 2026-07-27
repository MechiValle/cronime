import { Box, Typography } from '@mui/material';
import { tokens } from '../theme';

type Question = 'newer' | 'older';

type HeaderProps = {
  question: Question;
  streak: number;
};

const questionLabel: Record<Question, string> = {
  newer: '¿Cuál de los dos es el más NUEVO?',
  older: '¿Cuál de los dos es el más ANTIGUO?',
};

export default function Header({ question, streak }: HeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        padding: { xs: 1.5, sm: 2 },
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: tokens.color.textPrimary,
          fontWeight: 500,
        }}
      >
        {questionLabel[question]}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: tokens.color.textSecondary,
        }}
      >
        Racha Actual:{' '}
        <Box
          component="span"
          sx={{ color: tokens.color.gold, fontWeight: 700 }}
        >
          {streak}
        </Box>
      </Typography>
    </Box>
  );
}