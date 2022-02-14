import React from 'react';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { ThemeProvider } from '@mui/material/styles';

import { AppContextProvider } from '@whnet/context';

import AppRoutes from '../routes/routes';
import theme from '../theme/theme';
import useGlobalEvents from '../globalEvents/globalEvents';

const App = () => {
  useGlobalEvents();

  return (
    <AppContextProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <ThemeProvider theme={theme}>
          <AppRoutes />
          <CssBaseline />
        </ThemeProvider>
      </SnackbarProvider>
    </AppContextProvider>
  );
};

export default App;
