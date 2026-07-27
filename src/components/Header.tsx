import { Box, Typography } from '@mui/material';
import { tokens } from '../theme';

type Question = 'newer' | 'older';

type HeaderProps = {
  question: Question;
  streak: number;
};

const questionLabel: Record<Question, string> = {
  newer: 'Which anime is newer?',
  older: 'Which anime is older?',
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
        variant="subtitle1"
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
        Current Streak:{' '}
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