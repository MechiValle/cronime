import { Box, Typography } from '@mui/material';
import { tokens } from '../theme';
import { formatTime } from '../utils/formatTime';

type TimerProps = {
  elapsedMs: number;
};

export default function Timer({ elapsedMs }: TimerProps) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h6"
        sx={{
          color: tokens.color.textSecondary,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatTime(elapsedMs)}
      </Typography>
    </Box>
  );
}