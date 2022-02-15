import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          width: 100%;
        }
        html {
          overflow: hidden;
        }
        body {
          position: fixed;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
        }
      `,
    },
  },
});

export default theme;
