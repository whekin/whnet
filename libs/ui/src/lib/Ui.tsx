import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { gql, useApolloClient } from '@apollo/client';
import {
  Box,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const theme = useTheme();
  const { chatId } = useParams();
  const wideScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return wideScreen ? desktopLayout : mobileLayout(chatId);
};

export default Ui;
