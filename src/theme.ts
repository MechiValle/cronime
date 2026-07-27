import { createTheme } from '@mui/material/styles';

export const tokens = {
  color: {
    stage: '#0E0E12',       
    surface: '#17171D',  
    gold: '#D4AF6A',      
    violet: '#6C63FF', 
    success: '#4CAF7D', 
    error: '#E5484D', 
    textPrimary: '#F2F0EA',
    textSecondary: '#A8A6B3',
  },
  font: {
    display: '"Oswald", sans-serif',  
    body: '"Inter", sans-serif',      
  },
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: tokens.color.stage,
      paper: tokens.color.surface,
    },
    primary: {
      main: tokens.color.violet,
      contrastText: tokens.color.textPrimary,
    },
    secondary: {
      main: tokens.color.gold,
      contrastText: tokens.color.stage,
    },
    success: {
      main: tokens.color.success,
    },
    error: {
      main: tokens.color.error,
    },
    text: {
      primary: tokens.color.textPrimary,
      secondary: tokens.color.textSecondary,
    },
  },
  typography: {
    fontFamily: tokens.font.body,
    h1: { fontFamily: tokens.font.display, fontWeight: 500, letterSpacing: '0.02em' },
    h2: { fontFamily: tokens.font.display, fontWeight: 500, letterSpacing: '0.02em' },
    h3: { fontFamily: tokens.font.display, fontWeight: 500, letterSpacing: '0.01em' },
    h4: { fontFamily: tokens.font.display, fontWeight: 500 },
    h5: { fontFamily: tokens.font.display, fontWeight: 500 },
    h6: { fontFamily: tokens.font.display, fontWeight: 500 },
    button: { fontFamily: tokens.font.body, fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          height: '100%',
          margin: 0,
        },
        '#root': {
          height: '100%',
        },
      },
    },
  },
});

export default theme;