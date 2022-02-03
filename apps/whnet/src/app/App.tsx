import React, { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { AppContext } from '@whnet/context';

import { useUserAuthNickname } from '@whnet/helpers';

import AppRoutes from '../routes/routes';

const App = () => {
  const nickname = useUserAuthNickname();

  const value = useMemo(() => ({ userNickname: nickname }), [nickname]);

  return (
    <AppContext.Provider value={value}>
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
    </AppContext.Provider>
  );
};

export default App;
