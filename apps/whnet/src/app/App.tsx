import React, { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { AppContextProvider } from '@whnet/context';

import AppRoutes from '../routes/routes';

const App = () => {
  return (
    <AppContextProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <CssBaseline />
        <AppRoutes />
      </SnackbarProvider>
    </AppContextProvider>
  );
};

export default App;
