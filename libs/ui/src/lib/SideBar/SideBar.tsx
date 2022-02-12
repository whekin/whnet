import React from 'react';
import { Box, Button } from '@mui/material';

import { useLogout } from '@whnet/helpers';

import Chats from './Chats';

export const SideBar = () => {
  const logout = useLogout();

  return (
    <Box
      sx={{ width: '100%', flexShrink: 0, height: '100vh', overflowY: 'auto' }}
    >
      <Chats />
      <Button onClick={logout}>Logout</Button>
    </Box>
  );
};

export default SideBar;
