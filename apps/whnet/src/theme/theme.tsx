import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          overflow: hidden;
        }
        html {
          height: -webkit-fill-available;
        }
        body {
          -webkit-overflow-scrolling: touch;
          height: calc(var(--vh, 1vh)*100)
        }
      `,
    },
  },
});

export default theme;
