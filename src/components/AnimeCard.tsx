import { Box, Typography } from '@mui/material';
import type { Anime } from '../types/anime';
import { tokens } from '../theme';

type Feedback = 'correct' | 'incorrect' | null;

type AnimeCardProps = {
  anime: Anime;
  showYear: boolean;
  feedback: Feedback;
  disabled: boolean;
  onSelect: (animeId: number) => void;
};

const feedbackTint: Record<NonNullable<Feedback> | 'none', string> = {
  correct: 'rgba(76, 175, 125, 0.28)',
  incorrect: 'rgba(229, 72, 77, 0.28)',
  none: 'transparent',
};

export default function AnimeCard({
  anime,
  showYear,
  feedback,
  disabled,
  onSelect,
}: AnimeCardProps) {
  const tint = feedbackTint[feedback ?? 'none'];

  return (
    <Box
      onClick={() => {
        if (!disabled) onSelect(anime.id);
      }}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: disabled ? 'default' : 'pointer',
        overflow: 'hidden', 
        '&:hover .anime-card-image': disabled
          ? undefined
          : {
              transform: 'scale(1.08)',
            },
      }}
    >

      <Box
        className="anime-card-image"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${anime.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.3s ease',
        }}
      />


      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          pointerEvents: 'none',
        }}
      />


      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: tint,
          transition: 'background-color 0.3s ease',
          pointerEvents: 'none',
        }}
      />


      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: { xs: 2, sm: 3 },
          backgroundColor: 'rgba(0, 0, 0, 0.72)',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: tokens.color.textPrimary,
            fontWeight: 500,
            lineHeight: 1.15,
          }}
        >
          {anime.title}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: tokens.color.gold,
            opacity: showYear ? 1 : 0,
            transform: showYear ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            marginTop: 0.5,
          }}
        >
          {anime.year}
        </Typography>
      </Box>
    </Box>
  );
}