import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useNewMessageSubscriptionUpdateCache } from '@whnet/helpers';

import SideBar from './SideBar/SideBar';

const mobileLayout = (chatId: string | undefined) => {
  return chatId ? <Outlet /> : <SideBar />;
};

const desktopLayout = (
  <Box sx={{ display: 'flex' }}>
    <Box sx={{ width: 300, flexShrink: 0 }}>
      <SideBar />
    </Box>
    <Box sx={{ width: '100%' }}>
      <Outlet />
    </Box>
  </Box>
);

export const Ui = () => {
  useNewMessageSubscriptionUpdateCache();

  const theme = useTheme();
  const { chatId } = useParams();
  const wideScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return wideScreen ? desktopLayout : mobileLayout(chatId);
};

export default Ui;
